package com.tsmarthome.be.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.DeviceLog;
import com.tsmarthome.be.entity.DeviceState;
import com.tsmarthome.be.entity.SensorData;
import com.tsmarthome.be.repository.DeviceLogRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.DeviceStateRepository;
import com.tsmarthome.be.repository.SensorDataRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttService implements MqttCallback {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    private MqttClient mqttClient;

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Khai báo các Repository để thao tác DB
    private final DeviceRepository deviceRepository;
    private final SensorDataRepository sensorDataRepository;
    private final DeviceStateRepository deviceStateRepository;
    private final DeviceLogRepository deviceLogRepository;

    // Bộ nhớ đệm (Cache) để giảm tải truy vấn SELECT xuống Database
    private final Map<String, Device> deviceCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void connect() {
        try {
            mqttClient = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(10);

            mqttClient.setCallback(this);
            mqttClient.connect(options);
            log.info("Đã kết nối thành công tới MQTT Broker: {}", brokerUrl);

            mqttClient.subscribe("home/tsmarthome/+/+/+/data", 1);
            mqttClient.subscribe("home/tsmarthome/+/+/+/status", 1);
            log.info("Đã subscribe các topic /data và /status");

        } catch (MqttException e) {
            log.error("Lỗi kết nối MQTT: {}", e.getMessage());
        }
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String payload = new String(message.getPayload());
        Map<String, Object> data = objectMapper.readValue(payload, new TypeReference<>() {});

        if (topic.endsWith("/data")) {
            handleSensorData(topic, data);
        } else if (topic.endsWith("/status")) {
            handleDeviceStatus(topic, data);
        }

        // Đẩy dữ liệu lên WebSocket cho React cập nhật realtime
        messagingTemplate.convertAndSend("/topic/smarthome/realtime", (Object) data);
    }

    // Hàm lấy thiết bị từ Cache, nếu chưa có thì tìm trong Database và lưu lại
    private Device getDeviceFromCache(String deviceName) {
        if (deviceCache.containsKey(deviceName)) {
            return deviceCache.get(deviceName);
        }

        Device device = deviceRepository.findByName(deviceName).orElse(null);
        if (device != null) {
            deviceCache.put(deviceName, device);
        } else {
            log.warn("CẢNH BÁO: Không tìm thấy thiết bị '{}' trong Database! Dữ liệu sẽ bị bỏ qua.", deviceName);
        }
        return device;
    }

    // XỬ LÝ LƯU SENSOR DATA (Dữ liệu môi trường, an ninh)
    @Transactional
    protected void handleSensorData(String topic, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(deviceName);

        if (device != null) {
            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
            }

            SensorData sensorData = SensorData.builder()
                    .device(device)
                    .value(data) // Lưu toàn bộ JSON gốc (gồm cả distance, angle, v.v.) vào cột JSONB
                    .createdAt(extractTimestamp(data))
                    .build();

            // 1. Tự động bóc tách chuỗi "25.5°C / 60%" của DHT22
            if (data.containsKey("value")) {
                String valStr = String.valueOf(data.get("value"));
                if (valStr.contains("°C") && valStr.contains("%")) {
                    try {
                        String[] parts = valStr.split("/");
                        double temp = Double.parseDouble(parts[0].replace("°C", "").trim());
                        double hum = Double.parseDouble(parts[1].replace("%", "").trim());

                        sensorData.setTemperature(temp);
                        sensorData.setHumidity(hum);
                    } catch (Exception e) {
                        log.warn("Không thể bóc tách nhiệt độ/độ ẩm từ chuỗi: {}", valStr);
                    }
                }
            }

            // 2. Logic xử lý riêng cho Radar (In log ra Terminal cho đẹp)
            if ("radar".equals(device.getDeviceType())) {
                double dist = data.containsKey("distance") ? ((Number) data.get("distance")).doubleValue() : 0;
                log.info("📡 [RADAR - {}] Phát hiện vật thể tại khoảng cách: {} cm", deviceName, dist);
            }

            sensorDataRepository.save(sensorData);
            log.info("Đã lưu dữ liệu Sensor vào DB cho thiết bị: {}", deviceName);

            // Cập nhật trạng thái vào bảng Device
            if (data.containsKey("status")) {
                device.setStatus((String) data.get("status"));
                deviceRepository.save(device);
            }
        }
    }

    // XỬ LÝ LƯU DEVICE STATUS & LOG (Trạng thái Bật/Tắt)
    @Transactional
    protected void handleDeviceStatus(String topic, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(deviceName);

        if (device != null) {
            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
            }

            LocalDateTime actionTime = extractTimestamp(data);

            // 1. Cập nhật trạng thái mới nhất vào bảng DeviceState
            DeviceState state = deviceStateRepository.findById(device.getId())
                    .orElse(DeviceState.builder()
                            .deviceId(device.getId())
                            .device(device).build());

            state.setState(data); // Lưu nguyên cục JSON
            state.setUpdatedAt(actionTime);
            deviceStateRepository.save(state);

            // 2. Ghi Log hành động thông minh
            String actionValue = "Cập nhật trạng thái";
            if (data.containsKey("value")) {
                actionValue = (String) data.get("value");
            } else if (data.containsKey("enable")) {
                boolean isEnable = (Boolean) data.get("enable");
                actionValue = isEnable ? "Kích hoạt cảm biến" : "Tắt cảm biến";
            } else if (data.containsKey("state")) {
                boolean isOn = (Boolean) data.get("state");
                actionValue = isOn ? "Bật thiết bị" : "Tắt thiết bị";
            }

            DeviceLog logEntry = DeviceLog.builder()
                    .device(device)
                    .action(actionValue)
                    .data(data)
                    .createdAt(actionTime)
                    .build();
            deviceLogRepository.save(logEntry);
            log.info("Đã cập nhật Trạng thái & Log cho thiết bị: {} -> {}", deviceName, actionValue);

            // 3. Cập nhật cột status của bảng Device
            if (data.containsKey("status")) {
                device.setStatus((String) data.get("status"));
                deviceRepository.save(device);
            }
        }
    }

    // Hàm bóc tách Unix Timestamp từ ESP32 (Giây) sang LocalDateTime của Server
    private LocalDateTime extractTimestamp(Map<String, Object> data) {
        if (data.containsKey("timestamp")) {
            long unixSeconds = ((Number) data.get("timestamp")).longValue();
            return LocalDateTime.ofInstant(Instant.ofEpochSecond(unixSeconds), ZoneId.systemDefault());
        }
        return LocalDateTime.now();
    }

    public void publishCommand(String topic, Map<String, Object> payloadMap) {
        try {
            String payloadJson = objectMapper.writeValueAsString(payloadMap);
            MqttMessage message = new MqttMessage(payloadJson.getBytes());
            message.setQos(1);
            mqttClient.publish(topic, message);
            log.info("Đã gửi lệnh tới ESP32 - Topic: {} | Lệnh: {}", topic, payloadJson);
        } catch (Exception e) {
            log.error("Lỗi gửi lệnh MQTT: {}", e.getMessage());
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("Mất kết nối MQTT! Đang thử lại...");
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}
}
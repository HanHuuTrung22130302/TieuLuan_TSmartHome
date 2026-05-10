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

    private final DeviceRepository deviceRepository;
    private final SensorDataRepository sensorDataRepository;
    private final DeviceStateRepository deviceStateRepository;
    private final DeviceLogRepository deviceLogRepository;

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

        messagingTemplate.convertAndSend("/topic/smarthome/realtime", (Object) data);
    }

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

    // XỬ LÝ LƯU SENSOR DATA (Đã xóa bỏ logic bóc tách Nhiệt/Ẩm)
    @Transactional
    protected void handleSensorData(String topic, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(deviceName);

        if (device != null) {
            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
            }

            // Chỉ cần lưu toàn bộ cục JSON vào biến 'value' là xong
            SensorData sensorData = SensorData.builder()
                    .device(device)
                    .value(data)
                    .createdAt(extractTimestamp(data))
                    .build();

            // Vẫn giữ lại Log cho Radar để Terminal báo đẹp
            if ("radar".equals(device.getDeviceType())) {
                double dist = data.containsKey("distance") ? ((Number) data.get("distance")).doubleValue() : 0;
                log.info("📡 [RADAR - {}] Phát hiện vật thể tại khoảng cách: {} cm", deviceName, dist);
            }

            sensorDataRepository.save(sensorData);
            log.info("Đã lưu dữ liệu Sensor vào DB cho thiết bị: {}", deviceName);
        }
    }

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

            DeviceState state = deviceStateRepository.findById(device.getId())
                    .orElse(DeviceState.builder()
                            .deviceId(device.getId())
                            .device(device).build());

            state.setState(data);
            state.setUpdatedAt(actionTime);
            deviceStateRepository.save(state);

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

            // ĐÃ SỬA: Đọc key "state" hoặc "enable" (boolean) để ép ra chữ Bật/Tắt
            boolean statusChanged = false;
            if (data.containsKey("state")) {
                device.setStatus((Boolean) data.get("state") ? "Bật" : "Tắt");
                statusChanged = true;
            } else if (data.containsKey("enable")) {
                device.setStatus((Boolean) data.get("enable") ? "Bật" : "Tắt");
                statusChanged = true;
            }

            // Chỉ lưu lại bảng Device nếu trạng thái Bật/Tắt thực sự có thay đổi
            if (statusChanged) {
                deviceRepository.save(device);
            }
        }
    }

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
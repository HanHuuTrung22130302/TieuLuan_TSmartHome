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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttService implements MqttCallbackExtended {

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
    private final Object mqttLock = new Object();

    private void subscribeTopics() throws MqttException {
        mqttClient.subscribe("home/tsmarthome/+/+/+/data", 1);
        mqttClient.subscribe("home/tsmarthome/+/+/+/status", 1);
        log.info("Đã subscribe các topic /data và /status");
    }

    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        log.info("MQTT đã kết nối. reconnect={}, serverURI={}", reconnect, serverURI);
        try {
            subscribeTopics();

            // Nếu là lần khởi động đầu tiên (không phải reconnect do mất mạng), tiến hành đồng bộ
            if (!reconnect) {
                syncDeviceStatesToIoT();
            }
        } catch (MqttException e) {
            log.error("Lỗi subscribe/đồng bộ sau khi kết nối: {}", e.getMessage(), e);
        }
    }

    @PostConstruct
    public void connect() {
        try {
            mqttClient = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(1000);

            mqttClient.setCallback(this);
            mqttClient.connect(options);
            log.info("Đã kết nối thành công tới MQTT Broker: {}", brokerUrl);

        } catch (MqttException e) {
            log.error("Lỗi kết nối MQTT: {}", e.getMessage());
        }
    }

    // --- HÀM MỚI: Đồng bộ trạng thái từ DB xuống IoT khi Backend chạy lại ---
    public void syncDeviceStatesToIoT() {
        log.info("Đang tiến hành đồng bộ State từ Database xuống các thiết bị IoT...");
        List<Device> devices = deviceRepository.findAll();

        for (Device device : devices) {
            // Chỉ gửi lệnh cho các thiết bị đang hoạt động (isFake = false) và có giá trị state
            if (Boolean.FALSE.equals(device.getIsFake()) && device.getState() != null && device.getMqttTopic() != null) {
                // Bỏ qua cảm biến môi trường (vì chúng chạy ngầm, không nhận lệnh)
                if ("temperature".equals(device.getDeviceType()) || "air_quality".equals(device.getDeviceType())) {
                    continue;
                }

                String commandTopic = device.getMqttTopic() + "/command";
                Map<String, Object> payload = new HashMap<>();
                payload.put("deviceId", device.getName());
                payload.put("state", device.getState());

                publishCommand(commandTopic, payload);
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        log.info("Đã hoàn tất gửi lệnh đồng bộ khởi tạo hệ thống!");
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        // LUÔN LUÔN BỌC TRY-CATCH ở đây để tránh sập service khi nhận JSON lỗi
        try {
            String payload = new String(message.getPayload());
            Map<String, Object> data = objectMapper.readValue(payload, new TypeReference<>() {});

            if (topic.endsWith("/data")) {
                handleSensorData(topic, data);
            } else if (topic.endsWith("/status")) {
                handleDeviceStatus(topic, data);
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý payload MQTT tại {}: {}", topic, e.getMessage());
        }
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

    @Transactional
    protected void handleSensorData(String topic, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(deviceName);

        if (device != null) {
            boolean needSaveDevice = false;

            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
                needSaveDevice = true;
            }

            if (data.containsKey("status")) {
                device.setStatus(String.valueOf(data.get("status")));
                needSaveDevice = true;
            }

            if (needSaveDevice) {
                deviceRepository.save(device);
            }

            SensorData sensorData = SensorData.builder()
                    .device(device)
                    .value(data)
                    .createdAt(extractTimestamp(data))
                    .build();

            if ("radar".equals(device.getDeviceType())) {
                double dist = data.containsKey("distance") ? ((Number) data.get("distance")).doubleValue() : 0;
                log.info("📡 [RADAR - {}] Phát hiện vật thể tại khoảng cách: {} cm", deviceName, dist);
            }

            sensorDataRepository.save(sensorData);

            // --- LOGIC MỚI: LƯU VÀO BẢNG device_logs CHO CÁC CẢM BIẾN ---
            String type = device.getDeviceType();
            if ("safety".equals(type) || "environment".equals(type) || "security".equals(type) || "radar".equals(type)) {
                String actionValue = data.containsKey("value") ? String.valueOf(data.get("value")) : "Ghi nhận dữ liệu";

                DeviceLog logEntry = DeviceLog.builder()
                        .device(device)
                        .action(actionValue)
                        .data(data)
                        .createdAt(extractTimestamp(data))
                        .build();
                deviceLogRepository.save(logEntry);
            }

            messagingTemplate.convertAndSend("/topic/home-dashboard", (Object) data);
        }
    }

    @Transactional
    protected void handleDeviceStatus(String topic, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(deviceName);

        if (device != null) {
            boolean needSaveDevice = false;

            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
                needSaveDevice = true;
            }

            if (data.containsKey("state")) {
                device.setState((Boolean) data.get("state"));
                needSaveDevice = true;
            }

            if (data.containsKey("status")) {
                device.setStatus(String.valueOf(data.get("status")));
                needSaveDevice = true;
            }

            if (needSaveDevice) {
                deviceRepository.save(device);
            }

            LocalDateTime actionTime = extractTimestamp(data);

            // GHI NHẬN LỊCH SỬ VÀO BẢNG device_states (Đã sửa lỗi lưu đúp)
            DeviceState stateObj = DeviceState.builder()
                    .device(device)
                    .state(data)
                    .updatedAt(actionTime)
                    .build();
            deviceStateRepository.save(stateObj);

            // Xác định hành động để in ra Log Console cho dễ debug
            String actionValue = "Cập nhật trạng thái";
            if (data.containsKey("value")) {
                actionValue = String.valueOf(data.get("value"));
            } else if (data.containsKey("state")) {
                boolean isOn = (Boolean) data.get("state");
                actionValue = isOn ? "Bật thiết bị/cảm biến" : "Tắt thiết bị/cảm biến";
            }
            log.info("Đã cập nhật Trạng thái cho thiết bị: {} -> {}", deviceName, actionValue);

            messagingTemplate.convertAndSend("/topic/home-dashboard", (Object) data);
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
        String payloadJson;

        try {
            payloadJson = objectMapper.writeValueAsString(payloadMap);
        } catch (Exception e) {
            log.error("Lỗi convert payload MQTT: {}", e.getMessage(), e);
            return;
        }

        int maxRetry = 3;

        for (int attempt = 1; attempt <= maxRetry; attempt++) {
            try {
                synchronized (mqttLock) {
                    if (mqttClient == null) {
                        log.warn("MQTT client chưa được khởi tạo. Thử lại lần {}/{}", attempt, maxRetry);
                        Thread.sleep(500);
                        continue;
                    }

                    if (!mqttClient.isConnected()) {
                        log.warn("MQTT đang mất kết nối. Đang reconnect trước khi gửi lệnh... lần {}/{}", attempt, maxRetry);

                        try {
                            mqttClient.reconnect();
                        } catch (MqttException reconnectError) {
                            log.warn("Reconnect MQTT thất bại lần {}/{}: {}", attempt, maxRetry, reconnectError.getMessage());
                            Thread.sleep(1000);
                            continue;
                        }
                    }

                    MqttMessage message = new MqttMessage(payloadJson.getBytes());
                    message.setQos(1);
                    message.setRetained(false);

                    mqttClient.publish(topic, message);

                    log.info("Đã gửi lệnh tới ESP32 - Topic: {} | Lệnh: {} | attempt={}", topic, payloadJson, attempt);
                    return;
                }
            } catch (Exception e) {
                log.warn("Gửi lệnh MQTT thất bại lần {}/{} - Topic: {} | Lỗi: {}",
                        attempt, maxRetry, topic, e.getMessage());

                try {
                    Thread.sleep(1000);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        log.error("Gửi lệnh MQTT thất bại sau {} lần - Topic: {} | Payload: {}", maxRetry, topic, payloadJson);
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("Mất kết nối MQTT! Paho sẽ tự reconnect. Lý do: {}",
                cause != null ? cause.getMessage() : "unknown");
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}
}
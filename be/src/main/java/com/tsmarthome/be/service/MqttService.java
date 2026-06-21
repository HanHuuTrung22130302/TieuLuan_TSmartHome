package com.tsmarthome.be.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.DeviceLog;
import com.tsmarthome.be.entity.DeviceState;
import com.tsmarthome.be.entity.SensorData;
import com.tsmarthome.be.entity.Home;
import com.tsmarthome.be.repository.DeviceLogRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.DeviceStateRepository;
import com.tsmarthome.be.repository.SensorDataRepository;
import com.tsmarthome.be.repository.HomeRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.repository.UserProfileRepository;
import com.tsmarthome.be.service.TelegramService;
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
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttService implements MqttCallbackExtended {

    private final MqttClient mqttClient;
    private final MqttConnectOptions mqttConnectOptions;

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final DeviceRepository deviceRepository;
    private final SensorDataRepository sensorDataRepository;
    private final DeviceStateRepository deviceStateRepository;
    private final DeviceLogRepository deviceLogRepository;
    private final HomeRepository homeRepository;
    private final UserHomeRepository userHomeRepository;
    private final UserProfileRepository userProfileRepository;
    private final TelegramService telegramService;

    private final Map<String, Device> deviceCache = new ConcurrentHashMap<>();
    private final Map<String, Long> lastNotificationTimes = new ConcurrentHashMap<>();
    private final Object mqttLock = new Object();

    private void subscribeTopics() throws MqttException {
        mqttClient.subscribe("+/home/tsmarthome/+/+/+/data", 1);
        mqttClient.subscribe("+/home/tsmarthome/+/+/+/status", 1);
        log.info("Đã subscribe các topic động: +/home/tsmarthome/+/+/+/data và status");
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
            mqttClient.setCallback(this);
            mqttClient.connect(mqttConnectOptions);
            log.info("Đã kết nối thành công tới MQTT Broker!");

        } catch (MqttException e) {
            log.error("Lỗi kết nối MQTT: {}", e.getMessage());
        }
    }

    public void syncDeviceStatesToIoT() {
        log.info("Đang tiến hành đồng bộ State từ Database xuống các thiết bị IoT...");
        List<Device> devices = deviceRepository.findAll();
        for (Device device : devices) {
            if (device != null && Boolean.FALSE.equals(device.getIsFake()) && device.getState() != null && device.getMqttTopic() != null) {
                if ("temperature".equals(device.getDeviceType()) || "air_quality".equals(device.getDeviceType())) {
                    continue;
                }
                UUID homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                        ? device.getRoom().getHome().getId() 
                        : null;
                if (homeId == null) continue;
                String commandTopic = homeId.toString() + "/" + device.getMqttTopic() + "/command";
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
        try {
            String payload = new String(message.getPayload());
            Map<String, Object> data = objectMapper.readValue(payload, new TypeReference<>() {});

            String homeIdStr = (String) data.get("homeId");
            UUID homeId = null;
            if (homeIdStr != null) {
                try {
                    homeId = UUID.fromString(homeIdStr);
                } catch (IllegalArgumentException e) {
                    log.warn("Payload homeId không phải là UUID hợp lệ: {}", homeIdStr);
                }
            }

            if (homeId == null) {
                int firstSlash = topic.indexOf('/');
                if (firstSlash != -1) {
                    String topicHomeId = topic.substring(0, firstSlash);
                    try {
                        homeId = UUID.fromString(topicHomeId);
                    } catch (IllegalArgumentException e) {
                        // ignore
                    }
                }
            }

            if (homeId == null) {
                log.warn("Không xác định được homeId từ cả payload và topic: {}", topic);
                return;
            }

            if (topic.endsWith("/data")) {
                handleSensorData(homeId, data);
            } else if (topic.endsWith("/status")) {
                handleDeviceStatus(homeId, data);
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý payload MQTT tại {}: {}", topic, e.getMessage());
        }
    }

    private Device getDeviceFromCache(UUID homeId, String deviceName) {
        if (homeId == null || deviceName == null) return null;
        String cacheKey = homeId + ":" + deviceName;
        if (deviceCache.containsKey(cacheKey)) {
            return deviceCache.get(cacheKey);
        }

        Device device = deviceRepository.findByHomeIdAndName(homeId, deviceName).orElse(null);
        if (device != null) {
            deviceCache.put(cacheKey, device);
        } else {
            log.warn("CẢNH BÁO: Không tìm thấy thiết bị '{}' thuộc Home '{}' trong Database! Dữ liệu sẽ bị bỏ qua.", deviceName, homeId);
        }
        return device;
    }

    @Transactional
    protected void handleSensorData(UUID homeId, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(homeId, deviceName);

        if (device != null) {
            boolean deviceChanged = false;
            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
                deviceChanged = true;
            }

            if (data.containsKey("status")) {
                String statusVal = String.valueOf(data.get("status"));
                device.setStatus(statusVal);
                deviceChanged = true;
            }

            if (deviceChanged) {
                deviceRepository.save(device);
            }

            triggerTelegramNotificationIfNeeded(device, data);

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

            messagingTemplate.convertAndSend("/topic/home-dashboard/" + homeId.toString(), (Object) data);
        }
    }

    @Transactional
    protected void handleDeviceStatus(UUID homeId, Map<String, Object> data) {
        String deviceName = (String) data.get("deviceId");
        if (deviceName == null) return;

        Device device = getDeviceFromCache(homeId, deviceName);

        if (device != null) {
            boolean deviceChanged = false;
            if (data.containsKey("isFake")) {
                device.setIsFake((Boolean) data.get("isFake"));
                deviceChanged = true;
            }

            if (data.containsKey("state") || data.containsKey("status")) {
                if (data.containsKey("state")) {
                    device.setState((Boolean) data.get("state"));
                }
                if (data.containsKey("status")) {
                    device.setStatus(String.valueOf(data.get("status")));
                }
                deviceChanged = true;
            }

            if (deviceChanged) {
                deviceRepository.save(device);
            }

            triggerTelegramNotificationIfNeeded(device, data);

            LocalDateTime actionTime = extractTimestamp(data);

            DeviceState stateObj = DeviceState.builder()
                    .device(device)
                    .state(data)
                    .updatedAt(actionTime)
                    .build();
            deviceStateRepository.save(stateObj);

            String actionValue = "Cập nhật trạng thái";
            if (data.containsKey("value")) {
                actionValue = String.valueOf(data.get("value"));
            } else if (data.containsKey("state")) {
                boolean isOn = (Boolean) data.get("state");
                actionValue = isOn ? "Bật thiết bị/cảm biến" : "Tắt thiết bị/cảm biến";
            }
            log.info("Đã cập nhật Trạng thái cho thiết bị: {} -> {}", deviceName, actionValue);

            messagingTemplate.convertAndSend("/topic/home-dashboard/" + homeId.toString(), (Object) data);
        }
    }

    private void triggerTelegramNotificationIfNeeded(Device device, Map<String, Object> data) {
        if (device == null || device.getDeviceType() == null) return;

        String type = device.getDeviceType();
        if ("security".equals(type) || "radar".equals(type) || "environment".equals(type) || "safety".equals(type)) {
            boolean isAlert = false;
            String status = null;
            String value = null;

            if ("security".equals(type)) {
                boolean isPersonAlert = false;
                if (data.containsKey("personCount")) {
                    try {
                        int count = ((Number) data.get("personCount")).intValue();
                        if (count > 0) {
                            isPersonAlert = true;
                        }
                    } catch (Exception e) {}
                }
                
                if (!isPersonAlert && data.containsKey("status")) {
                    String lowerStatus = String.valueOf(data.get("status")).toLowerCase();
                    if ((lowerStatus.contains("phát hiện") || lowerStatus.contains("detect")) 
                            && !lowerStatus.contains("không") && !lowerStatus.contains("no")) {
                        isPersonAlert = true;
                    }
                }

                if (!isPersonAlert && data.containsKey("value")) {
                    String lowerValue = String.valueOf(data.get("value")).toLowerCase();
                    if ((lowerValue.contains("phát hiện") || lowerValue.contains("detect")) 
                            && !lowerValue.contains("không") && !lowerValue.contains("no")) {
                        isPersonAlert = true;
                    }
                }

                if (!isPersonAlert) {
                    return; // Do NOT trigger notification for security/camera if no person is detected
                }

                status = data.containsKey("status") ? String.valueOf(data.get("status")) : "Phát hiện";
                value = data.containsKey("value") ? String.valueOf(data.get("value")) : "Phát hiện người";
                isAlert = true;

                // Rate limit check: 1 minute (60,000 ms)
                long now = System.currentTimeMillis();
                String rateLimitKey = device.getId().toString();
                Long lastTime = lastNotificationTimes.get(rateLimitKey);
                if (lastTime != null && (now - lastTime) < 60000) {
                    log.info("Bỏ qua gửi thông báo Telegram cho thiết bị {} do giới hạn 1 phút", device.getName());
                    return;
                }
                lastNotificationTimes.put(rateLimitKey, now);
            } else {
                if (data.containsKey("status")) {
                    status = String.valueOf(data.get("status"));
                    String lower = status.toLowerCase();
                    if (lower.contains("cảnh báo") || lower.contains("nguy hiểm") || lower.contains("phát hiện") || lower.contains("cháy") || lower.contains("khói") || lower.contains("rò rỉ") || lower.contains("gas")
                            || lower.contains("warning") || lower.contains("danger") || lower.contains("alert") || lower.contains("detect") || lower.contains("smoke") || lower.contains("fire") || lower.contains("leak")
                            || lower.contains("high") || lower.contains("low") || lower.contains("abnormal") || lower.contains("error")) {
                        isAlert = true;
                    }
                }

                if (data.containsKey("value")) {
                    value = String.valueOf(data.get("value"));
                    String lower = value.toLowerCase();
                    if (lower.contains("cảnh báo") || lower.contains("nguy hiểm") || lower.contains("phát hiện") || lower.contains("cháy") || lower.contains("khói") || lower.contains("rò rỉ") || lower.contains("gas")
                            || lower.contains("warning") || lower.contains("danger") || lower.contains("alert") || lower.contains("detect") || lower.contains("smoke") || lower.contains("fire") || lower.contains("leak")
                            || lower.contains("high") || lower.contains("low") || lower.contains("abnormal") || lower.contains("error")) {
                        isAlert = true;
                    }
                }
            }

            if ("radar".equals(type) && data.containsKey("distance")) {
                value = "Khoảng cách: " + data.get("distance") + " cm";
                if (status == null || status.isBlank()) {
                    status = "Phát hiện";
                    isAlert = true;
                }
            }

            if ("environment".equals(type)) {
                if (data.containsKey("temperature")) {
                    double temp = ((Number) data.get("temperature")).doubleValue();
                    if (temp > 40.0 || temp < 10.0) {
                        isAlert = true;
                        value = "Nhiệt độ bất thường: " + temp + " °C";
                        if (status == null || status.isBlank()) {
                            status = temp > 40.0 ? "Nhiệt độ cao" : "Nhiệt độ thấp";
                        }
                    }
                }
                if (data.containsKey("humidity")) {
                    double hum = ((Number) data.get("humidity")).doubleValue();
                    if (hum > 85.0 || hum < 20.0) {
                        isAlert = true;
                        if (value == null) {
                            value = "Độ ẩm bất thường: " + hum + " %";
                        }
                        if (status == null || status.isBlank()) {
                            status = "Cảnh báo độ ẩm";
                        }
                    }
                }
                if (data.containsKey("co2")) {
                    double co2 = ((Number) data.get("co2")).doubleValue();
                    if (co2 > 1000.0) {
                        isAlert = true;
                        if (value == null) {
                            value = "Nồng độ CO2 cao: " + co2 + " ppm";
                        }
                        if (status == null || status.isBlank()) {
                            status = "Cảnh báo chất lượng không khí";
                        }
                    }
                }
            }

            if ("safety".equals(type)) {
                if (data.containsKey("gas") || data.containsKey("smoke")) {
                    double gasVal = data.containsKey("gas") ? ((Number) data.get("gas")).doubleValue() : 0;
                    double smokeVal = data.containsKey("smoke") ? ((Number) data.get("smoke")).doubleValue() : 0;
                    if (gasVal > 300.0 || smokeVal > 300.0) {
                        isAlert = true;
                        value = "Gas: " + gasVal + " ppm, Khói: " + smokeVal + " ppm";
                        if (status == null || status.isBlank()) {
                            status = "Cảnh báo an toàn (Rò rỉ khí/Khói)";
                        }
                    }
                }
            }

            if (isAlert) {
                String homeName = (device.getRoom() != null && device.getRoom().getHome() != null)
                        ? device.getRoom().getHome().getName() : "Không xác định";
                String roomName = (device.getRoom() != null) ? device.getRoom().getName() : "Không xác định";
                String deviceLabel = device.getLabel() != null ? device.getLabel() : device.getName();

                String alertStatus = status != null ? status : "Cảnh báo";
                String alertValue = value != null ? value : "Phát hiện sự kiện cảnh báo";

                String deviceTypeVi = device.getDeviceType();
                if ("security".equals(deviceTypeVi)) deviceTypeVi = "An ninh";
                else if ("radar".equals(deviceTypeVi)) deviceTypeVi = "Radar cảm biến";
                else if ("environment".equals(deviceTypeVi)) deviceTypeVi = "Môi trường";
                else if ("safety".equals(deviceTypeVi)) deviceTypeVi = "An toàn";

                String timeStr = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

                String message = String.format(
                        "<b>THÔNG BÁO KHẨN CẤP - TSMARTHOME</b>\n" +
                        "----------------------------------\n" +
                        "• <b>Thiết bị:</b> %s (Nhóm: %s)\n" +
                        "• <b>Vị trí:</b> Phòng %s - %s\n" +
                        "• <b>Trạng thái:</b> %s\n" +
                        "• <b>Chi tiết:</b> %s\n" +
                        "• <b>Thời gian:</b> %s",
                        deviceLabel, deviceTypeVi, roomName, homeName, alertStatus, alertValue, timeStr
                );

                UUID homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                        ? device.getRoom().getHome().getId() : null;

                if (homeId != null) {
                    try {
                        List<com.tsmarthome.be.entity.UserHome> userHomes = userHomeRepository.findByHomeId(homeId);
                        for (com.tsmarthome.be.entity.UserHome uh : userHomes) {
                            if (uh.getUser() != null) {
                                userProfileRepository.findById(uh.getUser().getId()).ifPresent(profile -> {
                                    if (profile.getTelegramChatId() != null && !profile.getTelegramChatId().isBlank()) {
                                        telegramService.sendMessage(profile.getTelegramChatId(), message);
                                    }
                                });
                            }
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi gửi thông báo Telegram cho thiết bị {}: {}", device.getName(), e.getMessage());
                    }
                }
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
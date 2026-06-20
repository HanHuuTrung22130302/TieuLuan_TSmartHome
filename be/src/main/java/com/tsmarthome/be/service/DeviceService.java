package com.tsmarthome.be.service;

import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.DeviceState;
import com.tsmarthome.be.entity.Home;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.DeviceStateRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceStateRepository deviceStateRepository;
    private final MqttService mqttService;
    private final SimpMessagingTemplate messagingTemplate;
    private final SecurityUtil securityUtil;
    private final UserHomeRepository userHomeRepository;

    @Transactional
    public void controlDevice(UUID deviceId, Map<String, Object> command) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị"));

        if (Boolean.TRUE.equals(device.getIsFake())) {
            // --- CASE 1: THIẾT BỊ FAKE ---
            log.info("Xử lý thiết bị FAKE: {}", device.getName());
            handleFakeDevice(device, command);
        } else {
            // --- CASE 2: THIẾT BỊ REAL ---
            log.info("Gửi lệnh tới thiết bị REAL: {}", device.getName());
            handleRealDevice(device, command);
        }
    }

    private void handleFakeDevice(Device device, Map<String, Object> command) {
        // 1. Cập nhật Status hiển thị (Bật/Tắt)
        Boolean targetState = null;
        if (command.containsKey("state")) {
            targetState = (Boolean) command.get("state");
        } else if (command.containsKey("enable")) {
            targetState = (Boolean) command.get("enable");
        }

        if (targetState != null) {
            device.setState(targetState);
            device.setStatus(targetState ? "Bật" : "Tắt");
            deviceRepository.save(device);
        }

        // 3. Đẩy WebSocket ngay lập tức để FE cập nhật UI 3D
        // Gắn thêm deviceId vào payload để FE biết cái nào vừa đổi
        command.put("deviceId", device.getName());

        UUID homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                ? device.getRoom().getHome().getId()
                : null;
        String destTopic = (homeId != null) 
                ? "/topic/smarthome/realtime/" + homeId.toString() 
                : "/topic/smarthome/realtime";

        // ĐÃ FIX LỖI ÉP KIỂU Ở ĐÂY:
        messagingTemplate.convertAndSend(destTopic, (Object) command);
    }

    private void handleRealDevice(Device device, Map<String, Object> command) {
        // 1. Lấy topic gốc từ DB (VD: home/tsmarthome/kitchen/light/kitchen_light_main)
        String baseTopic = device.getMqttTopic();

        // 2. TẠO COMMAND TOPIC CHUẨN
        // Dọn dẹp nếu DB lỡ lưu thừa đuôi /data hoặc /status
        if (baseTopic.endsWith("/data") || baseTopic.endsWith("/status")) {
            baseTopic = baseTopic.substring(0, baseTopic.lastIndexOf("/"));
        }

        UUID homeId = null;
        try {
            User user = securityUtil.getCurrentUser();
            if (user != null) {
                java.util.List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
                if (!homeIds.isEmpty()) {
                    homeId = homeIds.get(0);
                }
            }
        } catch (Exception e) {
            // Không có ngữ cảnh xác thực (ví dụ chạy ngầm scheduler)
        }

        // Fallback lấy theo thực thể liên kết room/home nếu không có user session
        if (homeId == null) {
            homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                    ? device.getRoom().getHome().getId()
                    : null;
        }

        if (homeId == null) {
            throw new RuntimeException("Thiết bị không liên kết với ngôi nhà nào");
        }

        // Nối thêm tiền tố homeId và đuôi /command
        String commandTopic = homeId.toString() + "/" + baseTopic + "/command";

        // 3. Gắn deviceId vào payload theo đúng đặc tả của ESP32
        command.put("deviceId", device.getName());

        // 4. Gửi lệnh đi
        mqttService.publishCommand(commandTopic, command);

    }
}
package com.tsmarthome.be.service;

import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.DeviceState;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.DeviceStateRepository;
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
        if (command.containsKey("state")) {
            device.setStatus((Boolean) command.get("state") ? "Bật" : "Tắt");
        } else if (command.containsKey("enable")) {
            device.setStatus((Boolean) command.get("enable") ? "Bật" : "Tắt");
        }
        deviceRepository.save(device);

        // 2. Cập nhật DeviceState (JSONB)
        DeviceState state = deviceStateRepository.findById(device.getId())
                .orElse(DeviceState.builder().device(device).deviceId(device.getId()).build());
        state.setState(command);
        state.setUpdatedAt(LocalDateTime.now());
        deviceStateRepository.save(state);

        // 3. Đẩy WebSocket ngay lập tức để FE cập nhật UI 3D
        // Gắn thêm deviceId vào payload để FE biết cái nào vừa đổi
        command.put("deviceId", device.getName());

        // ĐÃ FIX LỖI ÉP KIỂU Ở ĐÂY:
        messagingTemplate.convertAndSend("/topic/smarthome/realtime", (Object) command);
    }

    private void handleRealDevice(Device device, Map<String, Object> command) {
        // 1. Lấy topic gốc từ DB (VD: home/tsmarthome/kitchen/light/kitchen_light_main)
        String baseTopic = device.getMqttTopic();

        // 2. TẠO COMMAND TOPIC CHUẨN
        // Dọn dẹp nếu DB lỡ lưu thừa đuôi /data hoặc /status
        if (baseTopic.endsWith("/data") || baseTopic.endsWith("/status")) {
            baseTopic = baseTopic.substring(0, baseTopic.lastIndexOf("/"));
        }
        // Nối thêm đuôi /command
        String commandTopic = baseTopic + "/command";

        // 3. Gắn deviceId vào payload theo đúng đặc tả của ESP32
        command.put("deviceId", device.getName());

        // 4. Gửi lệnh đi
        mqttService.publishCommand(commandTopic, command);

        // Ghi chú: Đã xóa log ở đây vì bên MqttService.publishCommand đã có sẵn dòng log:
        // "Đã gửi lệnh tới ESP32 - Topic: ... | Lệnh: ..."
    }
}
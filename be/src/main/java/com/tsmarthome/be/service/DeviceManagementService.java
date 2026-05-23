package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.device.response.DeviceResponse;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceManagementService {

    private final DeviceRepository deviceRepository;
    private final MqttService mqttService;

    // ĐÃ SỬA: Đổi kiểu String status -> Boolean state
    public List<DeviceResponse> getFilteredDevices(String deviceType, UUID roomId, Boolean state) {
        List<Device> devices = deviceRepository.findDevicesFiltered(deviceType, roomId, state);
        return devices.stream().map(d -> DeviceResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .label(d.getLabel())
                .deviceType(d.getDeviceType())
                .mqttTopic(d.getMqttTopic())
                .status(d.getStatus())
                .state(d.getState()) // TRẢ VỀ STATE CHO FRONTEND LÀM CÔNG TẮC BẬT/TẮT
                .isFake(d.getIsFake())
                .icon(d.getIcon())
                .pos2dX(d.getPos2dX())
                .pos2dY(d.getPos2dY())
                .roomId(d.getRoom() != null ? d.getRoom().getId() : null)
                .roomName(d.getRoom() != null ? d.getRoom().getName() : "Không xác định")
                .build()
        ).collect(Collectors.toList());
    }

    public void controlDevice(UUID id, boolean action) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị yêu cầu điều khiển"));

        if ("temperature".equals(device.getDeviceType()) || "air_quality".equals(device.getDeviceType())) {
            throw new RuntimeException("Cảm biến môi trường chạy ngầm bảo vệ hệ thống, không hỗ trợ điều khiển tắt mở");
        }

        String commandTopic = device.getMqttTopic() + "/command";
        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", device.getName());
        payload.put("state", action);

        mqttService.publishCommand(commandTopic, payload);
        // ĐÃ XÓA dòng gửi trùng lặp ở đây
    }
}
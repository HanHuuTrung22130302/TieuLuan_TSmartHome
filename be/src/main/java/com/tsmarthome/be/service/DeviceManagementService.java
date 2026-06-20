package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.device.response.*;
import com.tsmarthome.be.entity.CameraStream;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.DeviceLog;
import com.tsmarthome.be.entity.DeviceState;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.CameraStreamRepository;
import com.tsmarthome.be.repository.DeviceLogRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.DeviceStateRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final CameraStreamRepository cameraStreamRepository;
    private final DeviceStateRepository deviceStateRepository;
    private final DeviceLogRepository deviceLogRepository;
    private final UserHomeRepository userHomeRepository;
    private final SecurityUtil securityUtil;

    // ĐÃ SỬA: Đổi kiểu String status -> Boolean state
    public List<DeviceResponse> getFilteredDevices(String deviceType, UUID roomId, Boolean state) {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return List.of();

        List<Device> devices = deviceRepository.findDevicesFiltered(homeIds, deviceType, roomId, state);
        return devices.stream().map(d -> {
            String statusVal = d.getStatus() != null ? d.getStatus() : "Không xác định";
            Boolean stateVal = d.getState() != null ? d.getState() : false;

            return DeviceResponse.builder()
                    .id(d.getId())
                    .name(d.getName())
                    .label(d.getLabel())
                    .deviceType(d.getDeviceType())
                    .mqttTopic(d.getMqttTopic())
                    .status(statusVal)
                    .state(stateVal)
                    .isFake(d.getIsFake())
                    .icon(d.getIcon())
                    .pos2dX(d.getPos2dX())
                    .pos2dY(d.getPos2dY())
                    .roomId(d.getRoom() != null ? d.getRoom().getId() : null)
                    .roomName(d.getRoom() != null ? d.getRoom().getName() : "Không xác định")
                    .build();
        }).collect(Collectors.toList());
    }

    public void validateDeviceControlPermission(UUID deviceId) {
        User user = securityUtil.getCurrentUser();
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị"));

        List<UUID> userHomeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (userHomeIds.isEmpty()) {
            throw new RuntimeException("Bạn không sở hữu ngôi nhà nào để thực hiện thao tác");
        }

        UUID deviceHomeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                ? device.getRoom().getHome().getId()
                : null;

        // Nếu thiết bị có liên kết Home, kiểm tra xem user có thuộc Home đó không
        if (deviceHomeId != null && !userHomeIds.contains(deviceHomeId)) {
            throw new RuntimeException("Bạn không có quyền truy cập vào thiết bị này");
        }
    }

    public void controlDevice(UUID id, boolean action) {
        validateDeviceControlPermission(id);
        
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) {
            throw new RuntimeException("Không tìm thấy homeId để gửi lệnh");
        }
        UUID homeId = homeIds.get(0); // Lấy home của user hiện tại

        Device device = deviceRepository.findById(id).get();

        if ("temperature".equals(device.getDeviceType()) || "air_quality".equals(device.getDeviceType())) {
            throw new RuntimeException("Cảm biến môi trường chạy ngầm bảo vệ hệ thống, không hỗ trợ điều khiển tắt mở");
        }

        String commandTopic = homeId.toString() + "/" + device.getMqttTopic() + "/command";
        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", device.getName());
        payload.put("state", action);

        mqttService.publishCommand(commandTopic, payload);
    }

    // Nhớ khai báo: private final CameraStreamRepository cameraStreamRepository;

    public List<SecuritySidebarResponse> getSecuritySidebarDevices() {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return List.of();

        List<Device> securityDevices = deviceRepository.findActiveSecurityDevices(homeIds);
        List<CameraStream> cameras = cameraStreamRepository.findAll();

        Map<UUID, String> cameraMap = cameras.stream()
                .collect(Collectors.toMap(c -> c.getDevice().getId(), CameraStream::getStreamUrl));

        return securityDevices.stream().map(d -> SecuritySidebarResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .label(d.getLabel())
                .deviceType(d.getDeviceType())
                .icon(d.getIcon())
                .roomName(d.getRoom() != null ? d.getRoom().getName() : "Không xác định")
                .streamUrl(cameraMap.getOrDefault(d.getId(), null))
                .build()
        ).collect(Collectors.toList());
    }

    // ... code cũ giữ nguyên

    public List<DeviceResponse> getAllMapDevices() {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return List.of();

        List<Device> devices = deviceRepository.findAllByHomeIds(homeIds);

        return devices.stream().map(d -> {
            String statusVal = d.getStatus() != null ? d.getStatus() : "Không xác định";
            Boolean stateVal = d.getState() != null ? d.getState() : false;

            return DeviceResponse.builder()
                    .id(d.getId())
                    .name(d.getName())
                    .label(d.getLabel())
                    .deviceType(d.getDeviceType())
                    .mqttTopic(d.getMqttTopic())
                    .status(statusVal)
                    .state(stateVal)
                    .isFake(d.getIsFake())
                    .icon(d.getIcon())
                    .pos2dX(d.getPos2dX())
                    .pos2dY(d.getPos2dY())
                    .pos3dX(d.getPos3dX())
                    .pos3dY(d.getPos3dY())
                    .pos3dZ(d.getPos3dZ())
                    .roomId(d.getRoom() != null ? d.getRoom().getId() : null)
                    .roomName(d.getRoom() != null ? d.getRoom().getName() : "Không xác định")
                    .build();
        }).collect(Collectors.toList());
    }
    public List<CameraStreamResponse> getAllCameraStreams() {
        // cameraStreamRepository đã được inject từ bước trước
        List<CameraStream> cameras = cameraStreamRepository.findAll();

        return cameras.stream().map(c -> CameraStreamResponse.builder()
                .deviceId(c.getDevice().getId()) // Lấy ID của thiết bị
                .streamUrl(c.getStreamUrl())
                .build()
        ).collect(Collectors.toList());
    }

    // LƯU Ý: Khai báo private final DeviceStateRepository deviceStateRepository; (nếu chưa có)

    // ĐÃ SỬA: Nhận thêm UUID deviceId
    public List<DeviceHistoryResponse> getDeviceHistory(UUID deviceId, String filter) {
        validateDeviceControlPermission(deviceId);
        LocalDateTime startDate = LocalDateTime.now();

        if ("3d".equalsIgnoreCase(filter)) {
            startDate = startDate.minusDays(3);
        } else {
            startDate = startDate.minusDays(1);
        }

        List<DeviceState> states = deviceStateRepository.findHistoryByDeviceIdAndDate(deviceId, startDate);

        return states.stream().map(stateObj -> {
            Boolean stateVal = null;
            String action = "Cập nhật trạng thái";

            Map<String, Object> data = stateObj.getState();
            if (data != null) {
                if (data.containsKey("state")) {
                    stateVal = (Boolean) data.get("state");
                    action = Boolean.TRUE.equals(stateVal) ? "Bật thiết bị/cảm biến" : "Tắt thiết bị/cảm biến";
                }

                if (data.containsKey("value")) {
                    action = String.valueOf(data.get("value"));
                }
            }

            return DeviceHistoryResponse.builder()
                    .id(stateObj.getId())
                    .deviceId(stateObj.getDevice().getId())
                    .deviceName(stateObj.getDevice().getName())
                    .deviceLabel(stateObj.getDevice().getLabel())
                    .roomName(stateObj.getDevice().getRoom() != null ? stateObj.getDevice().getRoom().getName() : "Không xác định")
                    .action(action)
                    .state(stateVal)
                    .createdAt(stateObj.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    // HÀM LẤY LỊCH SỬ DỮ LIỆU CẢM BIẾN / CẢNH BÁO
    public List<DeviceAlertResponse> getDeviceAlerts(UUID deviceId, String filter) {
        validateDeviceControlPermission(deviceId);
        LocalDateTime startDate = LocalDateTime.now();

        if ("3d".equalsIgnoreCase(filter)) {
            startDate = startDate.minusDays(3);
        } else {
            startDate = startDate.minusDays(1);
        }

        List<DeviceLog> logs = deviceLogRepository.findLogsByDeviceIdAndDate(deviceId, startDate);

        return logs.stream().map(logObj -> {
            String status = "Không xác định";
            String value = "";

            // Bóc tách biến status và value từ cục JSON
            Map<String, Object> data = logObj.getData();
            if (data != null) {
                if (data.containsKey("status")) {
                    status = String.valueOf(data.get("status"));
                }
                if (data.containsKey("value")) {
                    value = String.valueOf(data.get("value"));
                }
            }

            return DeviceAlertResponse.builder()
                    .id(logObj.getId())
                    .deviceId(logObj.getDevice().getId())
                    .deviceName(logObj.getDevice().getName())
                    .deviceLabel(logObj.getDevice().getLabel())
                    .roomName(logObj.getDevice().getRoom() != null ? logObj.getDevice().getRoom().getName() : "Không xác định")
                    .action(logObj.getAction())
                    .status(status)
                    .value(value)
                    .createdAt(logObj.getCreatedAt()) // Bảng log dùng createdAt
                    .build();
        }).collect(Collectors.toList());
    }
}
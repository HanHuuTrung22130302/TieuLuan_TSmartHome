package com.tsmarthome.be.dto.device.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DeviceHistoryResponse {
    private UUID id;
    private UUID deviceId;
    private String deviceName;
    private String deviceLabel;
    private String roomName;
    private String action;      // Tên hành động (VD: "Bật thiết bị", "Phát hiện ở Phòng Khách")
    private Boolean state;      // Trạng thái true/false tại thời điểm đó
    private LocalDateTime createdAt;
}
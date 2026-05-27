package com.tsmarthome.be.dto.device.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DeviceAlertResponse {
    private Long id; // Bảng device_logs dùng Long
    private UUID deviceId;
    private String deviceName;
    private String deviceLabel;
    private String roomName;
    private String action; // VD: "Phát hiện ở Phòng Khách (Block 1)"
    private String status; // VD: "Cảnh báo", "Nguy hiểm", "An toàn"
    private String value;  // VD: "25.5°C / 60%", "45 dB"
    private LocalDateTime createdAt;
}
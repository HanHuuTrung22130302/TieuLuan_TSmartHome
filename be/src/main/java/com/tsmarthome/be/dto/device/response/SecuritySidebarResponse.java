package com.tsmarthome.be.dto.device.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SecuritySidebarResponse {
    private UUID id;
    private String name;        // Dùng để so sánh với thiết bị từ WebSocket
    private String label;       // Tên hiển thị (VD: Cảm biến Khói Bếp)
    private String deviceType;  // security, safety, radar
    private String icon;
    private String roomName;
    private String streamUrl;   // Sẽ có link nếu là Camera, null nếu là cảm biến
}
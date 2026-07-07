package com.tsmarthome.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminHomeDetailResponse {
    private UUID id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    private List<RoomDetail> rooms;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomDetail {
        private UUID id;
        private String name;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<DeviceDetail> devices;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceDetail {
        private UUID id;
        private String name;
        private String deviceType;
        private String status;
        private Boolean state;
        private String label;
        private String icon;
        private Double pos2dX;
        private Double pos2dY;
        private Double pos3dX;
        private Double pos3dY;
        private Double pos3dZ;
        private String mqttTopic;
        private Boolean isFake;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

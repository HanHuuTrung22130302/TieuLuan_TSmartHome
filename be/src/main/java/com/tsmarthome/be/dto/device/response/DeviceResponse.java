package com.tsmarthome.be.dto.device.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class DeviceResponse {
    private UUID id;
    private String name;
    private String label;
    private String deviceType;
    private String mqttTopic;
    private String status;
    private Boolean state;
    private Boolean isFake;
    private String icon;
    private Double pos2dX;
    private Double pos2dY;

    private Double pos3dX;
    private Double pos3dY;
    private Double pos3dZ;

    private UUID roomId;
    private String roomName;
}
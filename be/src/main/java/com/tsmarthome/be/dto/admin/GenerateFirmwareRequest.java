package com.tsmarthome.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateFirmwareRequest {
    private UUID homeId;
    private String node;
    private String wifiSsid;
    private String wifiPassword;
    private String mqttBroker;
    private Integer mqttPort;
    private String mqttClientId;
}

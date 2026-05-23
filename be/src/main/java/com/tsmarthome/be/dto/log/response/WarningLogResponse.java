package com.tsmarthome.be.dto.log.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WarningLogResponse {
    private Long id;
    private String deviceId;
    private String deviceName;
    private String value;
    private String status;
    private String time;
    private String date;
    private String type;
    private String room;
}
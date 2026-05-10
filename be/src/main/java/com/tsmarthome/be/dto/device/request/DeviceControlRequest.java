package com.tsmarthome.be.dto.device.request;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class DeviceControlRequest {
    // Các lệnh như {"state": true} hoặc {"level": 75} hoặc {"enable": false}
    private Map<String, Object> command;
}
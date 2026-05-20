package com.tsmarthome.be.dto.log.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SensorLogResponse {
    private Long id;
    private String deviceId;    // Mapped từ Device.name
    private String deviceName;  // Mapped từ Device.label
    private String value;       // Trích xuất từ JSONB
    private String status;      // Mapped từ Device.status
    private String time;        // Format HH:mm:ss
    private String date;        // Format dd/MM/yyyy
    private String type;        // Loại cảm biến để FE hiển thị Icon
}
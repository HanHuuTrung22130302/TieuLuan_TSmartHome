package com.tsmarthome.be.dto.schedule.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {
    private UUID id;
    private UUID deviceId;
    private String deviceName;
    private String deviceLabel;
    private Map<String, Object> action;
    private String scheduleType;
    private String time; // "yyyy-MM-ddTHH:mm" or "HH:mm"
    private Boolean isActive;
    private LocalDateTime executeTime;
    private String cronExpression;
    private LocalDateTime updatedAt;
}

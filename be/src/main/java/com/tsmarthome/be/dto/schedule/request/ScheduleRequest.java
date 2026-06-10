package com.tsmarthome.be.dto.schedule.request;

import lombok.*;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequest {
    private UUID deviceId;
    private Map<String, Object> action;
    private String scheduleType; // "ONCE" or "DAILY"
    private String time; // For ONCE: "yyyy-MM-ddTHH:mm", for DAILY: "HH:mm"
    private Boolean isActive;
}

package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.log.response.SensorLogResponse;
import com.tsmarthome.be.entity.SensorData;
import com.tsmarthome.be.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class SensorLogService {

    private final SensorDataRepository sensorDataRepository;

    public Page<SensorLogResponse> getFilteredLogs(String timeFilter, String deviceType, int page, int size) {
        LocalDateTime startTime = calculateStartTime(timeFilter);
        Pageable pageable = PageRequest.of(page, size);

        Page<SensorData> sensorDataPage = sensorDataRepository.findLatestLogsFiltered(startTime, deviceType, pageable);

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return sensorDataPage.map(data -> {
            String icon = data.getDevice().getIcon();
            String deviceName = data.getDevice().getName();
            String type = mapIconToType(icon, deviceName);

            String displayValue = "Chưa có dữ liệu";
            if (data.getValue() != null && data.getValue().containsKey("value")) {
                displayValue = String.valueOf(data.getValue().get("value"));
            }

            return SensorLogResponse.builder()
                    .id(data.getId())
                    .deviceId(deviceName)
                    .deviceName(data.getDevice().getLabel())
                    .value(displayValue)
                    .status(data.getDevice().getStatus())
                    .time(data.getCreatedAt().format(timeFormatter))
                    .date(data.getCreatedAt().format(dateFormatter))
                    .type(type)
                    .build();
        });
    }

    private LocalDateTime calculateStartTime(String timeFilter) {
        LocalDateTime now = LocalDateTime.now();
        return switch (timeFilter) {
            case "12H" -> now.minusHours(12);
            case "1D" -> now.toLocalDate().atStartOfDay();
            case "7D" -> now.minusDays(7);
            default -> now.minusHours(12);
        };
    }

    private String mapIconToType(String icon, String deviceName) {
        if (icon == null) return "unknown";
        return switch (icon) {
            case "Flame" -> "flame";
            case "Mic" -> "audio";
            case "Thermometer" -> "temp";
            case "Wind" -> "gas";
            case "Radar" -> "radar";
            case "Activity" -> {
                if (deviceName != null && deviceName.contains("pir")) yield "pir";
                yield "activity";
            }
            default -> "unknown";
        };
    }
}
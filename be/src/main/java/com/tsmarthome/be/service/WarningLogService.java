package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.log.response.WarningCountResponse;
import com.tsmarthome.be.dto.log.response.WarningLogResponse;
import com.tsmarthome.be.entity.SensorData;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.SensorDataRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class WarningLogService {

    private final SensorDataRepository sensorDataRepository;
    private final SecurityUtil securityUtil;
    private final UserHomeRepository userHomeRepository;

    public Page<WarningLogResponse> getWarningLogs(String filterType, String startDate, String endDate, String deviceType, int page) {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return Page.empty();

        LocalDateTime[] timeRange = calculateTimeRange(filterType, startDate, endDate);
        Pageable pageable = PageRequest.of(page, 20);

        Page<SensorData> sensorDataPage = sensorDataRepository.findWarningLogs(homeIds, timeRange[0], timeRange[1], deviceType, pageable);

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

            return WarningLogResponse.builder()
                    .id(data.getId())
                    .deviceId(deviceName)
                    .deviceName(data.getDevice().getLabel())
                    .value(displayValue)
                    .status(data.getDevice().getStatus() != null ? data.getDevice().getStatus() : "Không xác định")
                    .time(data.getCreatedAt().format(timeFormatter))
                    .date(data.getCreatedAt().format(dateFormatter))
                    .type(type)
                    .room(data.getDevice().getRoom() != null ? data.getDevice().getRoom().getName() : "Không xác định")
                    .build();
        });
    }

    public WarningCountResponse getWarningCounts(String filterType, String startDate, String endDate, String deviceType) {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return new WarningCountResponse(0, 0);

        LocalDateTime[] timeRange = calculateTimeRange(filterType, startDate, endDate);

        long warningCount = sensorDataRepository.countByStatus(homeIds, timeRange[0], timeRange[1], deviceType, "Cảnh báo");
        long dangerCount = sensorDataRepository.countByStatus(homeIds, timeRange[0], timeRange[1], deviceType, "Nguy hiểm");

        return new WarningCountResponse(warningCount, dangerCount);
    }

    private LocalDateTime[] calculateTimeRange(String filterType, String startDate, String endDate) {
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();

        switch (filterType) {
            case "TODAY" -> {
                start = LocalDate.now().atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
            }
            case "LAST_WEEK" -> start = LocalDateTime.now().minusDays(7);
            case "SPECIFIC_DATE" -> {
                LocalDate date = LocalDate.parse(startDate);
                start = date.atStartOfDay();
                end = date.atTime(LocalTime.MAX);
            }
            case "SPECIFIC_MONTH" -> {
                YearMonth ym = YearMonth.parse(startDate);
                start = ym.atDay(1).atStartOfDay();
                end = ym.atEndOfMonth().atTime(LocalTime.MAX);
            }
            case "CUSTOM_RANGE" -> {
                LocalDate startLocal = LocalDate.parse(startDate);
                LocalDate endLocal = LocalDate.parse(endDate);
                if (ChronoUnit.MONTHS.between(startLocal, endLocal) > 3 ||
                        (ChronoUnit.MONTHS.between(startLocal, endLocal) == 3 && startLocal.getDayOfMonth() < endLocal.getDayOfMonth())) {
                    throw new RuntimeException("Khoảng thời gian chọn tối đa không được vượt quá 3 tháng!");
                }
                start = startLocal.atStartOfDay();
                end = endLocal.atTime(LocalTime.MAX);
            }
            default -> start = LocalDate.now().atStartOfDay();
        }
        return new LocalDateTime[]{start, end};
    }

    private String mapIconToType(String icon, String deviceName) {
        if (icon == null) return "unknown";
        return switch (icon) {
            case "Flame" -> "flame";
            case "Mic" -> "audio";
            case "Thermometer" -> "temp";
            case "Wind" -> "gas";
            case "Radar" -> "radar";
            case "Activity" -> (deviceName != null && deviceName.contains("pir")) ? "pir" : "activity";
            default -> "unknown";
        };
    }
}
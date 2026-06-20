package com.tsmarthome.be.service;

import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.Schedule;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.ScheduleRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.util.SecurityUtil;
import com.tsmarthome.be.dto.schedule.request.ScheduleRequest;
import com.tsmarthome.be.dto.schedule.response.ScheduleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceService deviceService;
    private final SecurityUtil securityUtil;
    private final UserHomeRepository userHomeRepository;

    private Device validateDeviceAccess(UUID deviceId) {
        User user = securityUtil.getCurrentUser();
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị"));

        UUID homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                ? device.getRoom().getHome().getId()
                : null;

        if (homeId == null) {
            throw new RuntimeException("Thiết bị không liên kết với ngôi nhà nào");
        }

        List<UUID> userHomeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (!userHomeIds.contains(homeId)) {
            throw new RuntimeException("Bạn không có quyền thao tác với thiết bị này");
        }
        return device;
    }

    public List<ScheduleResponse> getAllSchedules() {
        User user = securityUtil.getCurrentUser();
        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
        if (homeIds.isEmpty()) return List.of();
        return scheduleRepository.findAllWithDevice(homeIds).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Device device = validateDeviceAccess(request.getDeviceId());

        Schedule schedule = new Schedule();
        schedule.setDevice(device);
        schedule.setAction(request.getAction());
        schedule.setScheduleType(request.getScheduleType());
        schedule.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if ("ONCE".equalsIgnoreCase(request.getScheduleType())) {
            LocalDateTime dt = parseDateTime(request.getTime());
            schedule.setExecuteTime(dt);
            schedule.setCronExpression(null);
        } else if ("DAILY".equalsIgnoreCase(request.getScheduleType())) {
            schedule.setCronExpression(request.getTime());
            schedule.setExecuteTime(null);
        }

        Schedule saved = scheduleRepository.save(schedule);
        return convertToResponse(saved);
    }

    @Transactional
    public ScheduleResponse updateSchedule(UUID id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn giờ"));

        if (schedule.getDevice() != null) {
            validateDeviceAccess(schedule.getDevice().getId());
        }

        if (request.getDeviceId() != null) {
            Device device = validateDeviceAccess(request.getDeviceId());
            schedule.setDevice(device);
        }

        if (request.getAction() != null) {
            schedule.setAction(request.getAction());
        }

        if (request.getScheduleType() != null) {
            schedule.setScheduleType(request.getScheduleType());
        }

        if (request.getIsActive() != null) {
            schedule.setIsActive(request.getIsActive());
        }

        if (request.getTime() != null) {
            if ("ONCE".equalsIgnoreCase(schedule.getScheduleType())) {
                LocalDateTime dt = parseDateTime(request.getTime());
                schedule.setExecuteTime(dt);
                schedule.setCronExpression(null);
            } else if ("DAILY".equalsIgnoreCase(schedule.getScheduleType())) {
                schedule.setCronExpression(request.getTime());
                schedule.setExecuteTime(null);
            }
        }

        Schedule saved = scheduleRepository.save(schedule);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteSchedule(UUID id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn giờ"));
        if (schedule.getDevice() != null) {
            validateDeviceAccess(schedule.getDevice().getId());
        }
        scheduleRepository.delete(schedule);
    }

    private LocalDateTime parseDateTime(String timeStr) {
        try {
            if (timeStr.contains("T")) {
                if (timeStr.endsWith("Z")) {
                    timeStr = timeStr.substring(0, timeStr.length() - 1);
                }
                if (timeStr.length() > 16) {
                    timeStr = timeStr.substring(0, 16); // "yyyy-MM-ddTHH:mm"
                }
                return LocalDateTime.parse(timeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
            } else {
                return LocalDateTime.parse(timeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            }
        } catch (Exception e) {
            log.error("Lỗi parse ngày giờ: {}", timeStr, e);
            throw new RuntimeException("Định dạng ngày giờ không hợp lệ. Vui lòng dùng yyyy-MM-ddTHH:mm");
        }
    }

    private ScheduleResponse convertToResponse(Schedule s) {
        String time = "";
        if ("ONCE".equalsIgnoreCase(s.getScheduleType())) {
            time = s.getExecuteTime() != null ? s.getExecuteTime().toString() : "";
        } else if ("DAILY".equalsIgnoreCase(s.getScheduleType())) {
            time = s.getCronExpression() != null ? s.getCronExpression() : "";
        }

        return ScheduleResponse.builder()
                .id(s.getId())
                .deviceId(s.getDevice() != null ? s.getDevice().getId() : null)
                .deviceName(s.getDevice() != null ? s.getDevice().getName() : "Không rõ")
                .deviceLabel(s.getDevice() != null ? s.getDevice().getLabel() : "Không rõ")
                .action(s.getAction())
                .scheduleType(s.getScheduleType())
                .time(time)
                .isActive(s.getIsActive())
                .executeTime(s.getExecuteTime())
                .cronExpression(s.getCronExpression())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    /**
     * Bổ sung chạy ngầm mỗi phút để kiểm tra lịch hẹn giờ.
     * Cần thêm @EnableScheduling vào BeApplication.java
     */
    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void checkAndExecuteSchedules() {
        LocalDateTime now = LocalDateTime.now();
        String currentDailyTime = now.format(DateTimeFormatter.ofPattern("HH:mm"));

        log.info("[Scheduler] Đang chạy kiểm tra lịch hẹn giờ lúc: {} (daily format: {})", now, currentDailyTime);

        List<Schedule> activeSchedules = scheduleRepository.findByIsActiveTrue();

        for (Schedule schedule : activeSchedules) {
            try {
                boolean shouldExecute = false;

                if ("ONCE".equalsIgnoreCase(schedule.getScheduleType())) {
                    LocalDateTime execTime = schedule.getExecuteTime();
                    if (execTime != null) {
                        // So sánh theo phút. Nếu thời gian hiện tại >= execTime
                        if (!execTime.isAfter(now)) {
                            shouldExecute = true;
                            // Đánh dấu tắt để không chạy lại nữa
                            schedule.setIsActive(false);
                            scheduleRepository.save(schedule);
                        }
                    }
                } else if ("DAILY".equalsIgnoreCase(schedule.getScheduleType())) {
                    String scheduleTime = schedule.getCronExpression(); // e.g. "08:30"
                    if (scheduleTime != null && scheduleTime.equals(currentDailyTime)) {
                        shouldExecute = true;
                    }
                }

                if (shouldExecute) {
                    log.info("[Scheduler] Kích hoạt hẹn giờ cho thiết bị {} (ID: {}). Action: {}", 
                            schedule.getDevice().getName(), schedule.getDevice().getId(), schedule.getAction());
                    
                    deviceService.controlDevice(schedule.getDevice().getId(), schedule.getAction());
                }
            } catch (Exception e) {
                log.error("[Scheduler] Lỗi khi xử lý hẹn giờ ID: {}", schedule.getId(), e);
            }
        }
    }
}

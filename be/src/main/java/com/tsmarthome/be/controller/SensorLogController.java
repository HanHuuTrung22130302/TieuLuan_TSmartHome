package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.log.response.SensorLogResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.SensorLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class SensorLogController {

    private final SensorLogService sensorLogService;

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<Page<SensorLogResponse>>> getRecentLogs(
            @RequestParam(defaultValue = "12H") String timeFilter,
            @RequestParam(defaultValue = "all") String deviceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SensorLogResponse> logs = sensorLogService.getFilteredLogs(timeFilter, deviceType, page, size);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy nhật ký thành công", logs));
    }
}
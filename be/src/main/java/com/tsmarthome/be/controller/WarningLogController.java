package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.log.response.WarningCountResponse;
import com.tsmarthome.be.dto.log.response.WarningLogResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.WarningLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warning-history")
@RequiredArgsConstructor
public class WarningLogController {

    private final WarningLogService warningLogService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<WarningLogResponse>>> getWarningLogList(
            @RequestParam(defaultValue = "TODAY") String filterType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "all") String deviceType,
            @RequestParam(defaultValue = "0") int page) {
        try {
            Page<WarningLogResponse> logs = warningLogService.getWarningLogs(filterType, startDate, endDate, deviceType, page);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách lịch sử cảnh báo thành công", logs));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1010, e.getMessage(), null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<WarningCountResponse>> getWarningLogStats(
            @RequestParam(defaultValue = "TODAY") String filterType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "all") String deviceType) {
        try {
            WarningCountResponse stats = warningLogService.getWarningCounts(filterType, startDate, endDate, deviceType);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy số liệu thống kê cảnh báo thành công", stats));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1011, e.getMessage(), null));
        }
    }
}
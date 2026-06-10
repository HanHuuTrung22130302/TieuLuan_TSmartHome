package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.dto.schedule.request.ScheduleRequest;
import com.tsmarthome.be.dto.schedule.response.ScheduleResponse;
import com.tsmarthome.be.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAllSchedules() {
        List<ScheduleResponse> list = scheduleService.getAllSchedules();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách hẹn giờ thành công", list));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@RequestBody ScheduleRequest request) {
        try {
            ScheduleResponse response = scheduleService.createSchedule(request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Tạo lịch hẹn giờ thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1099, e.getMessage(), null));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable UUID id,
            @RequestBody ScheduleRequest request) {
        try {
            ScheduleResponse response = scheduleService.updateSchedule(id, request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Cập nhật lịch hẹn giờ thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1099, e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable UUID id) {
        try {
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Xóa lịch hẹn giờ thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1099, e.getMessage(), null));
        }
    }
}

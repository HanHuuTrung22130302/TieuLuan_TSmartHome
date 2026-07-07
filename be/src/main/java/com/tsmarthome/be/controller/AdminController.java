package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.dto.admin.*;
import com.tsmarthome.be.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final com.tsmarthome.be.service.AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<com.tsmarthome.be.entity.AuditLog>>> getLogs(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "startDate", required = false) String startDateStr,
            @RequestParam(value = "endDate", required = false) String endDateStr,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        java.time.LocalDateTime startDate = null;
        java.time.LocalDateTime endDate = null;
        
        if (startDateStr != null && !startDateStr.trim().isEmpty()) {
            startDate = java.time.LocalDate.parse(startDateStr).atStartOfDay();
        }
        if (endDateStr != null && !endDateStr.trim().isEmpty()) {
            endDate = java.time.LocalDate.parse(endDateStr).atTime(23, 59, 59, 999999999);
        }
        
        org.springframework.data.domain.Page<com.tsmarthome.be.entity.AuditLog> responses = auditLogService.getLogs(search, startDate, endDate, page, size);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách audit logs thành công", responses));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        List<AdminUserResponse> responses = adminService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách người dùng thành công", responses));
    }

    @GetMapping("/users/unlinked")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getUnlinkedUsers() {
        List<AdminUserResponse> responses = adminService.getUnlinkedUsers();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách người dùng chưa có nhà thành công", responses));
    }

    @PostMapping("/users/{userId}/toggle-lock")
    public ResponseEntity<ApiResponse<Void>> toggleLock(@PathVariable UUID userId) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String message = adminService.toggleLock(userId, currentUserEmail);
        return ResponseEntity.ok(new ApiResponse<>(1000, message, null));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<Void>> changeRole(@PathVariable UUID userId, @RequestBody String role) {
        adminService.changeRole(userId, role);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Cập nhật vai trò hệ thống thành công", null));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<Void>> createUser(@RequestBody CreateUserRequest request) {
        try {
            adminService.createUser(request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Tạo tài khoản người dùng thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(new ApiResponse<>(1001, e.getMessage(), null));
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> updateUser(@PathVariable UUID userId, @RequestBody UpdateUserRequest request) {
        adminService.updateUser(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Cập nhật thông tin người dùng thành công", null));
    }

    @GetMapping("/homes")
    public ResponseEntity<ApiResponse<List<AdminHomeResponse>>> getAllHomes() {
        List<AdminHomeResponse> responses = adminService.getAllHomes();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách ngôi nhà thành công", responses));
    }

    @DeleteMapping("/homes/{homeId}")
    public ResponseEntity<ApiResponse<Void>> deleteHome(@PathVariable UUID homeId) {
        adminService.deleteHome(homeId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Giải tán ngôi nhà thành công", null));
    }

    @GetMapping("/homes/{homeId}/detail")
    public ResponseEntity<ApiResponse<AdminHomeDetailResponse>> getHomeDetail(@PathVariable UUID homeId) {
        AdminHomeDetailResponse detail = adminService.getHomeDetail(homeId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy thông tin chi tiết ngôi nhà thành công", detail));
    }

    @PutMapping("/devices/{deviceId}")
    public ResponseEntity<ApiResponse<Void>> updateDevice(@PathVariable UUID deviceId, @RequestBody UpdateDeviceRequest request) {
        adminService.updateDevice(deviceId, request);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Cập nhật thiết bị thành công", null));
    }

    @PostMapping("/homes")
    public ResponseEntity<ApiResponse<Void>> createHome(@RequestBody CreateHomeRequest request) {
        adminService.createHome(request);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Tạo ngôi nhà mới thành công", null));
    }

    @PostMapping("/homes/{homeId}/link-owner/{userId}")
    public ResponseEntity<ApiResponse<Void>> linkOwner(@PathVariable UUID homeId, @PathVariable UUID userId) {
        adminService.linkOwner(homeId, userId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Liên kết chủ sở hữu thành công", null));
    }

    @PostMapping("/firmware/generate")
    public ResponseEntity<ApiResponse<GenerateFirmwareResponse>> generateFirmware(@RequestBody GenerateFirmwareRequest request) {
        GenerateFirmwareResponse response = adminService.generateFirmware(request);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Tạo cấu hình mã nguồn thành công", response));
    }

    @GetMapping("/homes/{homeId}/devices")
    public ResponseEntity<ApiResponse<List<AdminHomeDetailResponse.DeviceDetail>>> getHomeDevices(@PathVariable UUID homeId) {
        List<AdminHomeDetailResponse.DeviceDetail> responses = adminService.getHomeDevices(homeId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách thiết bị thành công", responses));
    }

    @PostMapping("/devices/{deviceId}/ping")
    public ResponseEntity<ApiResponse<Boolean>> pingDevice(@PathVariable UUID deviceId) {
        boolean connected = adminService.pingDevice(deviceId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Kiểm tra kết nối thiết bị thành công", connected));
    }

    @PostMapping("/homes/{homeId}/ping-all")
    public ResponseEntity<ApiResponse<List<AdminHomeDetailResponse.DeviceDetail>>> pingAllDevices(@PathVariable UUID homeId) {
        List<AdminHomeDetailResponse.DeviceDetail> responses = adminService.pingAllDevices(homeId);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Kiểm tra kết nối toàn bộ thiết bị thành công", responses));
    }
}

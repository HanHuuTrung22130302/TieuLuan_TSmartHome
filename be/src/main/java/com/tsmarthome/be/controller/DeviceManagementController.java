package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.device.request.DeviceControlRequest;
import com.tsmarthome.be.dto.device.response.*;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.DeviceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceManagementController {

    private final DeviceManagementService deviceManagementService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getDeviceList(
            @RequestParam(defaultValue = "all") String deviceType,
            @RequestParam(required = false) UUID roomId,
            @RequestParam(required = false) Boolean state) { // ĐÃ SỬA: Nhận tham số Boolean state (Tùy chọn)
        List<DeviceResponse> list = deviceManagementService.getFilteredDevices(deviceType, roomId, state);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách thiết bị thành công", list));
    }

    @PostMapping("/{id}/control")
    public ResponseEntity<ApiResponse<Void>> controlDeviceState(
            @PathVariable UUID id,
            @RequestBody DeviceControlRequest request) {
        try {
            deviceManagementService.controlDevice(id, request.isAction());
            return ResponseEntity.ok(new ApiResponse<>(1000, "Gửi lệnh điều khiển thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1020, e.getMessage(), null));
        }
    }
    @GetMapping("/security-sidebar")
    public ResponseEntity<ApiResponse<List<SecuritySidebarResponse>>> getSecuritySidebar() {
        List<SecuritySidebarResponse> list = deviceManagementService.getSecuritySidebarDevices();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách an ninh thành công", list));
    }

    // ... code API /list và /control cũ giữ nguyên

    // API CHUYÊN DỤNG LẤY TỌA ĐỘ CHO BẢN ĐỒ 2D/3D
    @GetMapping("/map")
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getDevicesForMap() {
        List<DeviceResponse> list = deviceManagementService.getAllMapDevices();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy dữ liệu bản đồ 2D/3D thành công", list));
    }

    @GetMapping("/cameras")
    public ResponseEntity<ApiResponse<List<CameraStreamResponse>>> getAllCameras() {
        List<CameraStreamResponse> list = deviceManagementService.getAllCameraStreams();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách link camera thành công", list));
    }

    // ĐÃ SỬA: Thêm {id} vào đường dẫn
    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<DeviceHistoryResponse>>> getDeviceHistory(
            @PathVariable UUID id, // Lấy ID của thiết bị từ URL
            @RequestParam(defaultValue = "1d") String filter) {

        List<DeviceHistoryResponse> list = deviceManagementService.getDeviceHistory(id, filter);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy lịch sử thiết bị thành công", list));
    }
    // API LẤY LỊCH SỬ CẢNH BÁO (Dành cho Cảm biến, Radar...)
    @GetMapping("/{id}/alerts")
    public ResponseEntity<ApiResponse<List<DeviceAlertResponse>>> getDeviceAlerts(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1d") String filter) {

        List<DeviceAlertResponse> list = deviceManagementService.getDeviceAlerts(id, filter);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy dữ liệu cảnh báo thành công", list));
    }
}
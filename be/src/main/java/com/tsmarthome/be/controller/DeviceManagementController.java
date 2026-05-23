package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.device.request.DeviceControlRequest;
import com.tsmarthome.be.dto.device.response.DeviceResponse;
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
}
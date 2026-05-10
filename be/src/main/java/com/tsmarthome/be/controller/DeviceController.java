package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.device.request.DeviceControlRequest;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggleDevice(
            @PathVariable UUID id,
            @RequestBody DeviceControlRequest request) {
        try {
            deviceService.controlDevice(id, request.getCommand());
            return ResponseEntity.ok(new ApiResponse<>(1000, "Gửi lệnh thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1007, e.getMessage(), null));
        }
    }
}
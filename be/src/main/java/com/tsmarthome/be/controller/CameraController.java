package com.tsmarthome.be.controller;

import com.tsmarthome.be.entity.CameraCapture;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.CameraCaptureRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.service.CloudinaryService;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/camera")
@RequiredArgsConstructor
@Slf4j
public class CameraController {

    private final CloudinaryService cloudinaryService;
    private final CameraCaptureRepository cameraCaptureRepository;
    private final DeviceRepository deviceRepository;
    private final UserHomeRepository userHomeRepository;
    private final SecurityUtil securityUtil;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCapture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("homeId") String homeIdStr,
            @RequestParam("deviceName") String deviceName) {
        try {
            UUID homeId = UUID.fromString(homeIdStr);
            Device device = deviceRepository.findByHomeIdAndName(homeId, deviceName)
                    .orElseThrow(() -> new RuntimeException("Device not found: " + deviceName));

            String imageUrl = cloudinaryService.uploadImage(file);

            CameraCapture capture = CameraCapture.builder()
                    .device(device)
                    .homeId(homeId)
                    .imageUrl(imageUrl)
                    .build();

            cameraCaptureRepository.save(capture);
            log.info("Saved camera capture for homeId {} from device {}: {}", homeId, deviceName, imageUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 1000);
            response.put("message", "Upload capture success");
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to upload capture: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 1001);
            response.put("message", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/captures")
    public ResponseEntity<?> getCaptures(
            @RequestParam("homeId") String homeIdStr,
            @RequestParam(value = "filter", defaultValue = "all") String filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        try {
            UUID homeId = UUID.fromString(homeIdStr);
            User user = securityUtil.getCurrentUser();
            List<UUID> userHomeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
            if (!userHomeIds.contains(homeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("code", 1003, "message", "You do not have permission to access captures for this home"));
            }

            LocalDateTime startDate = LocalDateTime.now();
            if ("today".equalsIgnoreCase(filter)) {
                startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            } else if ("7d".equalsIgnoreCase(filter)) {
                startDate = startDate.minusDays(7);
            } else if ("30d".equalsIgnoreCase(filter)) {
                startDate = startDate.minusDays(30);
            } else {
                startDate = null; // all
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<CameraCapture> capturesPage;
            if (startDate != null) {
                capturesPage = cameraCaptureRepository.findCapturesWithFilter(homeId, startDate, pageable);
            } else {
                capturesPage = cameraCaptureRepository.findCapturesWithoutFilter(homeId, pageable);
            }

            List<Map<String, Object>> responseData = capturesPage.getContent().stream().map(c -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", c.getId());
                item.put("deviceId", c.getDevice().getId());
                item.put("deviceName", c.getDevice().getName());
                item.put("deviceLabel", c.getDevice().getLabel());
                item.put("imageUrl", c.getImageUrl());
                item.put("createdAt", c.getCreatedAt());
                return item;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("code", 1000);
            response.put("message", "Get captures success");
            response.put("data", responseData);
            response.put("page", capturesPage.getNumber());
            response.put("totalPages", capturesPage.getTotalPages());
            response.put("totalElements", capturesPage.getTotalElements());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to retrieve captures: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", 1001, "message", "Retrieval failed: " + e.getMessage()));
        }
    }
}

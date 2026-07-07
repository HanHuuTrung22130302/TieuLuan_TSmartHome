package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.profile.UpdateProfileRequest;
import com.tsmarthome.be.dto.profile.UserProfileResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.entity.UserProfile;
import com.tsmarthome.be.entity.TelegramLinkCode;
import com.tsmarthome.be.repository.UserProfileRepository;
import com.tsmarthome.be.repository.UserRepository;
import com.tsmarthome.be.repository.TelegramLinkCodeRepository;
import com.tsmarthome.be.service.TelegramService;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/users/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final SecurityUtil securityUtil;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final TelegramLinkCodeRepository telegramLinkCodeRepository;
    private final TelegramService telegramService;

    private static final String DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    private static final String DEFAULT_REGION = "Việt Nam";

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        try {
            User user = securityUtil.getCurrentUser();
            UserProfile profile = userProfileRepository.findById(user.getId()).orElse(null);

             UserProfileResponse response = UserProfileResponse.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phoneNumber(profile != null ? profile.getPhoneNumber() : null)
                    .region(profile != null ? (profile.getRegion() != null ? profile.getRegion() : DEFAULT_REGION) : DEFAULT_REGION)
                    .avatarUrl(profile != null ? (profile.getAvatarUrl() != null ? profile.getAvatarUrl() : DEFAULT_AVATAR) : DEFAULT_AVATAR)
                    .telegramChatId(profile != null ? profile.getTelegramChatId() : null)
                    .telegramUsername(profile != null ? profile.getTelegramUsername() : null)
                    .createdAt(user.getCreatedAt())
                    .build();

            return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy thông tin profile thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1007, e.getMessage(), null));
        }
    }

    @PutMapping
    @Transactional
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        try {
            User user = securityUtil.getCurrentUser();

            // Update user details if provided
            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            userRepository.save(user);

            // Fetch or create profile
            UserProfile profile = userProfileRepository.findById(user.getId()).orElse(null);
            if (profile == null) {
                profile = UserProfile.builder()
                        .user(user)
                        .build();
            }

            if (request.getPhoneNumber() != null) {
                profile.setPhoneNumber(request.getPhoneNumber());
            }
            if (request.getRegion() != null) {
                profile.setRegion(request.getRegion());
            }
            if (request.getAvatarUrl() != null) {
                profile.setAvatarUrl(request.getAvatarUrl());
            }
            if (request.getTelegramChatId() != null) {
                profile.setTelegramChatId(request.getTelegramChatId());
            }

            userProfileRepository.save(profile);

            UserProfileResponse response = UserProfileResponse.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phoneNumber(profile.getPhoneNumber())
                    .region(profile.getRegion() != null ? profile.getRegion() : DEFAULT_REGION)
                    .avatarUrl(profile.getAvatarUrl() != null ? profile.getAvatarUrl() : DEFAULT_AVATAR)
                    .telegramChatId(profile.getTelegramChatId())
                    .telegramUsername(profile.getTelegramUsername())
                    .createdAt(user.getCreatedAt())
                    .build();

            return ResponseEntity.ok(new ApiResponse<>(1000, "Cập nhật profile thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1007, e.getMessage(), null));
        }
    }

    @PostMapping("/telegram/code")
    @Transactional
    public ResponseEntity<?> generateTelegramLinkCode() {
        try {
            User user = securityUtil.getCurrentUser();
            
            // Generate a random code: TSM- followed by 6 alphanumeric characters
            String codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            StringBuilder sb = new StringBuilder();
            Random random = new Random();
            for (int i = 0; i < 6; i++) {
                sb.append(codeChars.charAt(random.nextInt(codeChars.length())));
            }
            String randomCode = "TSM-" + sb.toString();

            TelegramLinkCode linkCode = TelegramLinkCode.builder()
                    .userId(user.getId())
                    .code(randomCode)
                    .expiresAt(LocalDateTime.now().plusMinutes(10))
                    .isUsed(false)
                    .build();

            telegramLinkCodeRepository.save(linkCode);

            return ResponseEntity.ok(Map.of(
                    "code", 1000,
                    "message", "Tạo mã liên kết Telegram thành công",
                    "data", Map.of(
                            "code", randomCode,
                            "expiresAt", linkCode.getExpiresAt().toString(),
                            "botUsername", "MYTSMARTHOME_BOT"
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("code", 1007, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/telegram")
    @Transactional
    public ResponseEntity<?> unlinkTelegram() {
        try {
            User user = securityUtil.getCurrentUser();
            UserProfile profile = userProfileRepository.findById(user.getId()).orElse(null);
            if (profile != null) {
                String oldChatId = profile.getTelegramChatId();
                profile.setTelegramChatId(null);
                profile.setTelegramUsername(null);
                userProfileRepository.save(profile);

                if (oldChatId != null && !oldChatId.isBlank()) {
                    telegramService.sendMessage(oldChatId, "⚠️ <b>Hủy liên kết tài khoản!</b>\nTài khoản Telegram này đã bị ngắt kết nối khỏi hệ thống TSmartHome.");
                }
            }
            return ResponseEntity.ok(Map.of(
                    "code", 1000,
                    "message", "Hủy liên kết Telegram thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("code", 1007, "message", e.getMessage()));
        }
    }
}

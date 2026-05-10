package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.auth.request.*;
import com.tsmarthome.be.dto.auth.response.AuthResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.entity.RefreshToken;
import com.tsmarthome.be.service.AuthService;
import com.tsmarthome.be.service.RefreshTokenService;
import com.tsmarthome.be.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            ApiResponse<Void> response = new ApiResponse<>(1000, "Đăng ký tài khoản thành công", null);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ApiResponse<Void> errorResponse = new ApiResponse<>(1001, e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse data = authService.login(request);
            ApiResponse<AuthResponse> response = new ApiResponse<>(1000, "Đăng nhập thành công", data);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ApiResponse<AuthResponse> errorResponse = new ApiResponse<>(1002, e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshtoken(@RequestBody TokenRefreshRequest request) {
        try {
            String requestRefreshToken = request.getRefreshToken();

            return refreshTokenService.findByToken(requestRefreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        // ĐÃ SỬA CHỖ NÀY: Truyền thẳng object 'user' vào thay vì 'user.getEmail()'
                        String newAccessToken = jwtUtil.generateToken(user);

                        AuthResponse data = new AuthResponse(newAccessToken, requestRefreshToken, user.getEmail(),
                                user.getId(),
                                user.getFirstName() + " " + user.getLastName());
                        return ResponseEntity.ok(new ApiResponse<>(1000, "Làm mới Token thành công", data));
                    })
                    .orElseThrow(() -> new RuntimeException("Refresh Token không tồn tại trong hệ thống!"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1003, e.getMessage(), null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Mã OTP đã được gửi đến email của bạn", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1004, e.getMessage(), null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            authService.verifyOtp(request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Mã OTP hợp lệ", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1005, e.getMessage(), null));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(new ApiResponse<>(1000, "Đặt lại mật khẩu thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(1006, e.getMessage(), null));
        }
    }
}
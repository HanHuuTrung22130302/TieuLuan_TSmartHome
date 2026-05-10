package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.auth.request.*;
import com.tsmarthome.be.dto.auth.response.AuthResponse;
import com.tsmarthome.be.entity.RefreshToken;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.UserRepository;
import com.tsmarthome.be.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tsmarthome.be.entity.OtpCode;
import com.tsmarthome.be.repository.OtpCodeRepository;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final OtpCodeRepository otpCodeRepository;
    private final EmailService emailService;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu nhập lại không khớp!");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isVerified(false)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng!");
        }

        // Xóa token cũ của user này (nếu có) để tránh rác DB
        refreshTokenService.deleteByUserId(user.getId());

        // ĐÃ SỬA CHỖ NÀY: Truyền thẳng object 'user' vào thay vì 'user.getEmail()'
        String jwt = jwtUtil.generateToken(user);
        String refreshTokenString = null;

        if (request.isRememberMe()) {
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
            refreshTokenString = refreshToken.getToken();
        }

        return new AuthResponse(jwt, refreshTokenString, user.getEmail(),user.getId(),
                user.getFirstName() + " " + user.getLastName());
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpCode otpCode = OtpCode.builder()
                .email(user.getEmail())
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .isUsed(false)
                .build();
        otpCodeRepository.save(otpCode);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public void verifyOtp(VerifyOtpRequest request) {
        OtpCode otpCode = otpCodeRepository.findByEmailAndOtpCode(request.getEmail(), request.getOtpCode())
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ!"));

        if (otpCode.getIsUsed()) {
            throw new RuntimeException("Mã OTP này đã được sử dụng!");
        }
        if (otpCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu nhập lại không khớp!");
        }

        OtpCode otpCode = otpCodeRepository.findByEmailAndOtpCode(request.getEmail(), request.getOtpCode())
                .orElseThrow(() -> new RuntimeException("Yêu cầu không hợp lệ!"));

        if (otpCode.getIsUsed() || otpCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn hoặc được sử dụng!");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy User"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpCode.setIsUsed(true);
        otpCodeRepository.save(otpCode);
    }
}
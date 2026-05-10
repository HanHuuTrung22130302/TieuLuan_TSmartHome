package com.tsmarthome.be.dto.auth.request;
import lombok.Getter; import lombok.Setter;
@Getter @Setter
public class ResetPasswordRequest {
    private String email;
    private String otpCode; // Phải gửi kèm OTP để Backend xác thực lại lần cuối
    private String newPassword;
    private String confirmPassword;
}
package com.tsmarthome.be.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tsmarthome.system@gmail.com"); // Email hiển thị người gửi
        message.setTo(toEmail);
        message.setSubject("Mã OTP Khôi Phục Mật Khẩu - TSmartHome");
        message.setText("Chào bạn,\n\n" +
                "Mã OTP để khôi phục mật khẩu của bạn là: " + otpCode + "\n" +
                "Mã này sẽ hết hạn trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\n" +
                "Trân trọng,\nĐội ngũ TSmartHome");

        mailSender.send(message);
    }
}
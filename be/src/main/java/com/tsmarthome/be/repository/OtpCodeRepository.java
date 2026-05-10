package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {
    Optional<OtpCode> findByEmailAndOtpCode(String email, String otpCode);
}
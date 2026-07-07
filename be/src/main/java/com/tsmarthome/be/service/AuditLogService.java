package com.tsmarthome.be.service;

import com.tsmarthome.be.entity.AuditLog;
import com.tsmarthome.be.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String email, String action, String target, String type, boolean executed) {
        String finalEmail = email;
        if (finalEmail == null || finalEmail.isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                finalEmail = auth.getName();
            } else {
                finalEmail = "Hệ thống";
            }
        }
        AuditLog auditLog = AuditLog.builder()
                .email(finalEmail)
                .action(action)
                .target(target)
                .type(type)
                .executed(executed)
                .build();
        auditLogRepository.save(auditLog);
    }

    public org.springframework.data.domain.Page<AuditLog> getLogs(
            String search,
            java.time.LocalDateTime startDate,
            java.time.LocalDateTime endDate,
            int page,
            int size) {
        return auditLogRepository.searchLogs(search, startDate, endDate, org.springframework.data.domain.PageRequest.of(page, size));
    }
}

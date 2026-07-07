package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @Query("SELECT a FROM AuditLog a WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            " LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(a.target) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:startDate IS NULL OR a.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR a.createdAt <= :endDate) " +
            "ORDER BY a.createdAt DESC")
    Page<AuditLog> searchLogs(
            @Param("search") String search,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            Pageable pageable);
}

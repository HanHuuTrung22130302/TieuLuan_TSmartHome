package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.DeviceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface DeviceLogRepository extends JpaRepository<DeviceLog, Long> {

    // Lấy dữ liệu cảnh báo của 1 thiết bị cụ thể
    @Query("SELECT l FROM DeviceLog l JOIN FETCH l.device d LEFT JOIN FETCH d.room r " +
            "WHERE d.id = :deviceId AND d.isFake = false AND l.createdAt >= :startDate " +
            "ORDER BY l.createdAt DESC")
    List<DeviceLog> findLogsByDeviceIdAndDate(
            @Param("deviceId") UUID deviceId,
            @Param("startDate") LocalDateTime startDate);
}
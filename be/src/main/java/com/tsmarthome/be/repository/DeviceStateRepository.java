package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.DeviceState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface DeviceStateRepository extends JpaRepository<DeviceState, UUID> {
    @Query("SELECT ds FROM DeviceState ds JOIN FETCH ds.device d LEFT JOIN FETCH d.room r " +
            "WHERE d.id = :deviceId AND d.isFake = false AND ds.updatedAt >= :startDate " +
            "ORDER BY ds.updatedAt DESC")
    List<DeviceState> findHistoryByDeviceIdAndDate(
            @Param("deviceId") UUID deviceId,
            @Param("startDate") LocalDateTime startDate);
}

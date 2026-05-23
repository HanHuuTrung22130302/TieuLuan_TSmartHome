package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

    @Query("SELECT s FROM SensorData s JOIN FETCH s.device d WHERE " +
            "(s.createdAt >= :startTime) AND " +
            "(:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "ORDER BY s.createdAt DESC")
    Page<SensorData> findLatestLogsFiltered(
            @Param("startTime") LocalDateTime startTime,
            @Param("deviceType") String deviceType,
            Pageable pageable);

    @Query("SELECT s FROM SensorData s JOIN FETCH s.device d LEFT JOIN FETCH d.room r " +
            "WHERE s.createdAt >= :start AND s.createdAt <= :end " +
            "AND (:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "ORDER BY s.createdAt DESC")
    Page<SensorData> findWarningLogs(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("deviceType") String deviceType,
            Pageable pageable);

    @Query("SELECT COUNT(s) FROM SensorData s JOIN s.device d " +
            "WHERE s.createdAt >= :start AND s.createdAt <= :end " +
            "AND (:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "AND FUNCTION('jsonb_extract_path_text', s.value, 'status') = :status")
    long countByStatus(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("deviceType") String deviceType,
            @Param("status") String status);
}
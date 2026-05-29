package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

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

    @Query(value = """
            SELECT d.device_type, COUNT(*)
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            WHERE sd.created_at >= :startTime
              AND sd.created_at < :endTime
              AND d.device_type IN ('radar', 'safety', 'security')
              AND (
                    sd.data ->> 'status' IN ('Cảnh báo', 'Nguy hiểm', 'Phát hiện')
                    OR sd.data ->> 'value' ILIKE '%cảnh báo%'
                    OR sd.data ->> 'value' ILIKE '%nguy hiểm%'
                    OR sd.data ->> 'value' ILIKE '%phát hiện%'
                  )
            GROUP BY d.device_type
            """, nativeQuery = true)
    List<Object[]> countTodayWarningsByDeviceType(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
            SELECT sd.data::text
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            WHERE d.name = 'livingroom_sensor_dht22'
              AND sd.created_at >= :startTime
              AND sd.created_at < :endTime
            ORDER BY sd.created_at DESC
            LIMIT 1
            """, nativeQuery = true)
    String findLatestDht22DataToday(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
            SELECT d.label, d.name, d.device_type, sd.data::text, sd.created_at
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            WHERE sd.created_at >= :startTime
              AND sd.created_at < :endTime
              AND d.device_type IN ('radar', 'safety', 'security')
              AND (
                    sd.data ->> 'status' IN ('Cảnh báo', 'Nguy hiểm', 'Phát hiện')
                    OR sd.data ->> 'value' ILIKE '%cảnh báo%'
                    OR sd.data ->> 'value' ILIKE '%nguy hiểm%'
                    OR sd.data ->> 'value' ILIKE '%phát hiện%'
                  )
            ORDER BY sd.created_at DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findRecentWarningSamplesToday(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
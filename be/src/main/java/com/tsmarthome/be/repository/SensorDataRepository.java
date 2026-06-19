package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

    @Query("SELECT s FROM SensorData s JOIN FETCH s.device d LEFT JOIN FETCH d.room r WHERE " +
            "r.home.id IN :homeIds AND " +
            "(s.createdAt >= :startTime) AND " +
            "(:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "ORDER BY s.createdAt DESC")
    Page<SensorData> findLatestLogsFiltered(
            @Param("homeIds") List<UUID> homeIds,
            @Param("startTime") LocalDateTime startTime,
            @Param("deviceType") String deviceType,
            Pageable pageable);

    @Query("SELECT s FROM SensorData s JOIN FETCH s.device d LEFT JOIN FETCH d.room r " +
            "WHERE r.home.id IN :homeIds AND " +
            "s.createdAt >= :start AND s.createdAt <= :end " +
            "AND (:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "ORDER BY s.createdAt DESC")
    Page<SensorData> findWarningLogs(
            @Param("homeIds") List<UUID> homeIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("deviceType") String deviceType,
            Pageable pageable);

    @Query("SELECT COUNT(s) FROM SensorData s JOIN s.device d LEFT JOIN d.room r " +
            "WHERE r.home.id IN :homeIds AND " +
            "s.createdAt >= :start AND s.createdAt <= :end " +
            "AND (:deviceType = 'all' OR d.deviceType = :deviceType) " +
            "AND FUNCTION('jsonb_extract_path_text', s.value, 'status') = :status")
    long countByStatus(
            @Param("homeIds") List<UUID> homeIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("deviceType") String deviceType,
            @Param("status") String status);

    @Query(value = """
            SELECT d.device_type, COUNT(*)
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            JOIN rooms r ON d.room_id = r.id
            WHERE r.home_id IN :homeIds
              AND sd.created_at >= :startTime
              AND sd.created_at < :endTime
              AND d.device_type IN ('radar', 'safety', 'security')
              AND (
                    sd.value ->> 'status' IN ('Cảnh báo', 'Nguy hiểm', 'Phát hiện')
                    OR sd.value ->> 'value' ILIKE '%cảnh báo%'
                    OR sd.value ->> 'value' ILIKE '%nguy hiểm%'
                    OR sd.value ->> 'value' ILIKE '%phát hiện%'
                  )
            GROUP BY d.device_type
            """, nativeQuery = true)
    List<Object[]> countTodayWarningsByDeviceType(
            @Param("homeIds") List<UUID> homeIds,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
            SELECT sd.value::text
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            JOIN rooms r ON d.room_id = r.id
            WHERE r.home_id IN :homeIds
              AND d.name = 'livingroom_sensor_dht22'
              AND sd.created_at >= :startTime
              AND sd.created_at < :endTime
            ORDER BY sd.created_at DESC
            LIMIT 1
            """, nativeQuery = true)
    String findLatestDht22DataToday(
            @Param("homeIds") List<UUID> homeIds,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query(value = """
            SELECT d.label, d.name, d.device_type, sd.value::text, sd.created_at
            FROM sensor_data sd
            JOIN devices d ON sd.device_id = d.id
            JOIN rooms r ON d.room_id = r.id
            WHERE r.home_id IN :homeIds
              AND sd.created_at >= :startTime
              AND sd.created_at < :endTime
              AND d.device_type IN ('radar', 'safety', 'security')
              AND (
                    sd.value ->> 'status' IN ('Cảnh báo', 'Nguy hiểm', 'Phát hiện')
                    OR sd.value ->> 'value' ILIKE '%cảnh báo%'
                    OR sd.value ->> 'value' ILIKE '%nguy hiểm%'
                    OR sd.value ->> 'value' ILIKE '%phát hiện%'
                  )
            ORDER BY sd.created_at DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findRecentWarningSamplesToday(
            @Param("homeIds") List<UUID> homeIds,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
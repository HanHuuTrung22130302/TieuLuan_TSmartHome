package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    Optional<Device> findByName(String name);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r WHERE " +
            "(:deviceType = 'all' OR d.deviceType = :deviceType) AND " +
            "(:roomId IS NULL OR r.id = :roomId) AND " +
            "(:state IS NULL OR d.state = :state) " +
            "ORDER BY d.createdAt DESC")
    List<Device> findDevicesFiltered(
            @Param("deviceType") String deviceType,
            @Param("roomId") UUID roomId,
            @Param("state") Boolean state);
}
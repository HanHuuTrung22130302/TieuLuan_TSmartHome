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
    List<Device> findAllByName(String name);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r LEFT JOIN FETCH r.home h WHERE h.id = :homeId AND d.name = :name")
    Optional<Device> findByHomeIdAndName(@Param("homeId") UUID homeId, @Param("name") String name);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r WHERE " +
            "r.home.id IN :homeIds AND " +
            "(:deviceType = 'all' OR d.deviceType = :deviceType) AND " +
            "(:roomId IS NULL OR r.id = :roomId) AND " +
            "(:state IS NULL OR d.state = :state) " +
            "ORDER BY d.createdAt DESC")
    List<Device> findDevicesFiltered(
            @Param("homeIds") List<UUID> homeIds,
            @Param("deviceType") String deviceType,
            @Param("roomId") UUID roomId,
            @Param("state") Boolean state);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r " +
            "WHERE r.home.id IN :homeIds AND d.deviceType IN ('security', 'safety', 'radar') AND d.isFake = false " +
            "ORDER BY d.createdAt DESC")
    List<Device> findActiveSecurityDevices(@Param("homeIds") List<UUID> homeIds);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r WHERE r.home.id IN :homeIds")
    List<Device> findAllByHomeIds(@Param("homeIds") List<UUID> homeIds);

    @Query("SELECT COUNT(d) FROM Device d WHERE d.room.home.id = :homeId AND d.isFake = false")
    long countRealDevicesByHomeId(@Param("homeId") UUID homeId);

    List<Device> findByRoomId(UUID roomId);

    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.room r WHERE r.home.id = :homeId")
    List<Device> findByHomeId(@Param("homeId") UUID homeId);
}
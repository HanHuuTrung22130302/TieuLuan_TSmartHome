package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.CameraCapture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface CameraCaptureRepository extends JpaRepository<CameraCapture, UUID> {
    @Query("SELECT c FROM CameraCapture c WHERE c.homeId = :homeId AND c.createdAt >= :startDate")
    Page<CameraCapture> findCapturesWithFilter(
            @Param("homeId") UUID homeId,
            @Param("startDate") LocalDateTime startDate,
            Pageable pageable);

    @Query("SELECT c FROM CameraCapture c WHERE c.homeId = :homeId")
    Page<CameraCapture> findCapturesWithoutFilter(
            @Param("homeId") UUID homeId,
            Pageable pageable);
}

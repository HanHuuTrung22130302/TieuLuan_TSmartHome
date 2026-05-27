package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.CameraStream;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CameraStreamRepository extends JpaRepository<CameraStream, UUID> {
}
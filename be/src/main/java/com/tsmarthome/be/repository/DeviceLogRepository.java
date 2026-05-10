package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.DeviceLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceLogRepository extends JpaRepository<DeviceLog, Long> {}

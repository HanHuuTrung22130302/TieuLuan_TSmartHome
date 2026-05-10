package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {}
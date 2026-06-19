package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    List<Schedule> findByIsActiveTrue();

    @Query("SELECT s FROM Schedule s LEFT JOIN FETCH s.device d LEFT JOIN FETCH d.room r WHERE r.home.id IN :homeIds ORDER BY s.updatedAt DESC")
    List<Schedule> findAllWithDevice(@Param("homeIds") List<UUID> homeIds);
}

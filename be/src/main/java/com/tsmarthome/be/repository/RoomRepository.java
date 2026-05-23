package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {

    @Query("SELECT r FROM Room r ORDER BY r.name ASC")
    List<Room> findAllOrderedByName();
}
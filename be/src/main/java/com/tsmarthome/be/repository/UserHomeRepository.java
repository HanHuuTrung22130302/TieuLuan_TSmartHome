package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.UserHome;
import com.tsmarthome.be.entity.UserHomeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface UserHomeRepository extends JpaRepository<UserHome, UserHomeId> {
    @Query("SELECT uh.home.id FROM UserHome uh WHERE uh.user.id = :userId")
    List<UUID> findHomeIdsByUserId(@Param("userId") UUID userId);

    List<UserHome> findByUserId(UUID userId);

    @Query("SELECT uh FROM UserHome uh JOIN FETCH uh.user WHERE uh.home.id = :homeId")
    List<UserHome> findByHomeId(@Param("homeId") UUID homeId);
}


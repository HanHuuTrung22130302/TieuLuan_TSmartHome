package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.Home;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface HomeRepository extends JpaRepository<Home, UUID> {
}

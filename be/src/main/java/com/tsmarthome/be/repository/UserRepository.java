package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    // Spring Boot tự động hỗ trợ hàm này, nhưng khai báo ra cho tường minh
    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query(
        "SELECT u FROM User u WHERE u.systemRole = 'USER' AND u.id NOT IN (SELECT uh.user.id FROM UserHome uh)"
    )
    java.util.List<User> findUnlinkedUsers();
}
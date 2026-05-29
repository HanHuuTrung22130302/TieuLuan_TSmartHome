package com.tsmarthome.be.repository;

import com.tsmarthome.be.entity.AssistantChat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AssistantChatRepository extends JpaRepository<AssistantChat, UUID> {
    // Lấy tin nhắn mới nhất lùi dần về quá khứ (để phục vụ lazy loading chuẩn xác)
    @Query("SELECT c FROM AssistantChat c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
    List<AssistantChat> findByUserIdPageable(@Param("userId") UUID userId, Pageable pageable);
}
package com.tsmarthome.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assistant_chats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssistantChat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(columnDefinition = "text", nullable = false)
    private String message;

    @Column(name = "is_assistant")
    private Boolean isAssistant;

    @Column(name = "action_type", length = 50)
    private String actionType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
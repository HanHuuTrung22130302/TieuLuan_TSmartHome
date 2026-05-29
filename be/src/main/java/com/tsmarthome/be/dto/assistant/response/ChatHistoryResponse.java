package com.tsmarthome.be.dto.assistant.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ChatHistoryResponse {
    private UUID id;
    private String message;
    private Boolean isAssistant;
    private String actionType;
    private LocalDateTime createdAt;
}
package com.tsmarthome.be.dto.assistant.request;

import lombok.Data;

import java.util.UUID;

@Data
public class AssistantChatRequest {
    private String message;
    private UUID userId;
}
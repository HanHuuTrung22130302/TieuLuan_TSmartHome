package com.tsmarthome.be.dto.assistant.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantChatResponse {
    private String reply;
    private boolean actionExecuted;
    private String actionType;
}
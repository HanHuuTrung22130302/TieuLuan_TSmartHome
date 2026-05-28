package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.assistant.request.AssistantChatRequest;
import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.AssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AssistantChatResponse>> chat(@RequestBody AssistantChatRequest request) {
        AssistantChatResponse data = assistantService.chat(request.getMessage());

        return ResponseEntity.ok(
                new ApiResponse<>(1000, "Assistant xử lý thành công", data)
        );
    }
}
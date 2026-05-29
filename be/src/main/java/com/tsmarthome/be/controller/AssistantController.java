package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.assistant.request.AssistantChatRequest;
import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.dto.assistant.response.ChatHistoryResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.AssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AssistantChatResponse>> chat(@RequestBody AssistantChatRequest request) {

        UUID currentUserId = request.getUserId();
        AssistantChatResponse data = assistantService.chat(currentUserId, request.getMessage());
        return ResponseEntity.ok(
                new ApiResponse<>(1000, "Assistant xử lý thành công", data)
        );
    }
    // API LẤY LỊCH SỬ CHAT PHÂN TRANG (LAZY LOADING)
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatHistoryResponse>>> getChatHistory(
            @RequestParam UUID userId, // Frontend truyền trực tiếp userId qua query
            @RequestParam(defaultValue = "0") int page) { // Mặc định lần đầu vào là trang 0

        List<ChatHistoryResponse> history = assistantService.getUserChatHistoryLazy(userId, page);
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy lịch sử hội thoại thành công", history));
    }
}
package com.tsmarthome.be.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelegramService {

    @Value("${telegram.bot.token:8849083231:AAGayZO4N5MJmXwLuKEqkoZqUuoeFBk5R3I}")
    private String botToken;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static final String TELEGRAM_API_URL = "https://api.telegram.org/bot";

    public void sendMessage(String chatId, String text) {
        if (chatId == null || chatId.isBlank()) {
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("chat_id", chatId);
            payload.put("text", text);
            payload.put("parse_mode", "HTML");

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(TELEGRAM_API_URL + botToken + "/sendMessage"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() != 200) {
                            log.error("Gửi tin nhắn Telegram thất bại! Status code: {}, Response: {}", response.statusCode(), response.body());
                        } else {
                            log.info("Đã gửi tin nhắn Telegram thành công tới chat ID: {}", chatId);
                        }
                    })
                    .exceptionally(ex -> {
                        log.error("Lỗi khi gửi tin nhắn Telegram tới chat ID {}: {}", chatId, ex.getMessage(), ex);
                        return null;
                    });

        } catch (Exception e) {
            log.error("Lỗi chuẩn bị payload gửi Telegram: {}", e.getMessage(), e);
        }
    }
}

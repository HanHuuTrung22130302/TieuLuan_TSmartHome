package com.tsmarthome.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String askGemini(String userMessage) {
        try {
            String systemPrompt = """
                    Bạn là trợ lý AI cho hệ thống nhà thông minh TSmartHome.
                    Hãy trả lời ngắn gọn, dễ hiểu bằng tiếng Việt.
                    Nếu người dùng hỏi về thiết bị trong nhà, hãy giải thích theo ngữ cảnh nhà thông minh.
                    Nếu không chắc dữ liệu thực tế, hãy nói rằng cần kiểm tra hệ thống.
                    """;

            String prompt = systemPrompt + "\n\nNgười dùng hỏi: " + userMessage;

            String requestBody = objectMapper.writeValueAsString(
                    objectMapper.createObjectNode()
                            .set("contents", objectMapper.createArrayNode()
                                    .add(objectMapper.createObjectNode()
                                            .set("parts", objectMapper.createArrayNode()
                                                    .add(objectMapper.createObjectNode()
                                                            .put("text", prompt)
                                                    )
                                            )
                                    )
                            )
            );

            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model
                    + ":generateContent";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return "Gemini đang phản hồi lỗi: HTTP " + response.statusCode();
            }

            JsonNode root = objectMapper.readTree(response.body());

            JsonNode textNode = root
                    .path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                return "Tôi chưa nhận được câu trả lời phù hợp từ Gemini.";
            }

            return textNode.asText();

        } catch (Exception e) {
            return "Lỗi khi gọi Gemini API: " + e.getMessage();
        }
    }
}
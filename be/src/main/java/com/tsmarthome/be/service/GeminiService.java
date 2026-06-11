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
        int maxRetries = 3;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String systemPrompt = """
                    Bạn là trợ lý AI cho hệ thống nhà thông minh TSmartHome.
                    Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt.
                    Nếu người dùng hỏi về thiết bị trong nhà, hãy trả lời dựa trên thông tin thực tế được cung cấp.
                    LƯU Ý QUAN TRỌNG: Bạn KHÔNG được tự ý tuyên bố rằng bạn đã thực hiện các lệnh bật/tắt thiết bị, mở cửa, phát nhạc hay kích hoạt kịch bản tự động hóa (như kịch bản buổi sáng, rời nhà, đi ngủ) vì các hành động điều khiển thực tế được xử lý bởi hệ thống lệnh của máy chủ. Nếu người dùng yêu cầu điều khiển hoặc chạy kịch bản nhưng hệ thống lệnh không bắt được, hãy trả lời lịch sự rằng bạn không thể điều khiển trực tiếp và khuyên họ sử dụng câu lệnh rõ ràng hơn (ví dụ: "bật đèn ngủ", "kích hoạt kịch bản buổi sáng").
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

                int statusCode = response.statusCode();

                if (statusCode >= 200 && statusCode < 300) {
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
                }

                // Các lỗi tạm thời: retry
                if (statusCode == 429 || statusCode == 500 || statusCode == 503 || statusCode == 504) {
                    if (attempt < maxRetries) {
                        long delayMs = calculateRetryDelayMs(attempt);
                        System.out.println("Gemini tạm lỗi HTTP " + statusCode
                                + ", thử lại lần " + attempt + "/" + maxRetries
                                + " sau " + delayMs + "ms");

                        Thread.sleep(delayMs);
                        continue;
                    }

                    return "Gemini đang tạm thời quá tải hoặc chưa sẵn sàng. Bạn thử lại sau vài giây nhé.";
                }

                // Các lỗi không nên retry: 400, 401, 403...
                return "Gemini phản hồi lỗi HTTP " + statusCode + ": " + response.body();

            } catch (Exception e) {
                if (attempt < maxRetries) {
                    try {
                        long delayMs = calculateRetryDelayMs(attempt);
                        System.out.println("Lỗi gọi Gemini, thử lại sau " + delayMs + "ms: " + e.getMessage());
                        Thread.sleep(delayMs);
                    } catch (InterruptedException interruptedException) {
                        Thread.currentThread().interrupt();
                        return "Yêu cầu Gemini bị gián đoạn.";
                    }
                } else {
                    return "Lỗi khi gọi Gemini API: " + e.getMessage();
                }
            }
        }

        return "Gemini hiện chưa phản hồi được. Bạn thử lại sau nhé.";
    }

    private long calculateRetryDelayMs(int attempt) {
        // exponential backoff: 1s, 2s, 4s + jitter nhỏ
        long baseDelay = (long) Math.pow(2, attempt - 1) * 1000L;
        long jitter = (long) (Math.random() * 500L);
        return baseDelay + jitter;
    }
}
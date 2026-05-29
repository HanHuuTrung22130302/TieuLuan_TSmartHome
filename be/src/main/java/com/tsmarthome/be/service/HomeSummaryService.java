package com.tsmarthome.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeSummaryService {

    private final SensorDataRepository sensorDataRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AssistantChatResponse summarizeToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startTime = today.atStartOfDay();
        LocalDateTime endTime = today.plusDays(1).atStartOfDay();

        List<Object[]> counts = sensorDataRepository.countTodayWarningsByDeviceType(startTime, endTime);
        String latestDht22 = sensorDataRepository.findLatestDht22DataToday(startTime, endTime);
        List<Object[]> recentWarnings = sensorDataRepository.findRecentWarningSamplesToday(startTime, endTime);

        long radarCount = 0;
        long safetyCount = 0;
        long securityCount = 0;

        for (Object[] row : counts) {
            String type = String.valueOf(row[0]);
            long count = ((Number) row[1]).longValue();

            switch (type) {
                case "radar" -> radarCount = count;
                case "safety" -> safetyCount = count;
                case "security" -> securityCount = count;
            }
        }

        String dhtText = parseDht22(latestDht22);
        String warningText = buildRecentWarningText(recentWarnings);

        String rawReport = """
                Dữ liệu hệ thống nhà thông minh hôm nay:

                Số cảnh báo theo nhóm:
                - Radar: %d cảnh báo
                - Safety/PCCC: %d cảnh báo
                - Security/An ninh: %d cảnh báo

                Dữ liệu nhiệt độ/độ ẩm mới nhất từ DHT22:
                %s

                Một số cảnh báo gần đây:
                %s
                """.formatted(radarCount, safetyCount, securityCount, dhtText, warningText);

        String prompt = """
                Bạn là trợ lý AI của hệ thống nhà thông minh TSmartHome.
                Hãy tóm tắt dữ liệu sau thành báo cáo ngắn gọn, tự nhiên bằng tiếng Việt.
                Nêu tình hình tổng quan, nhóm nào có nhiều cảnh báo, nhiệt độ/độ ẩm hiện tại nếu có.
                Không bịa thêm dữ liệu ngoài phần được cung cấp.

                %s
                """.formatted(rawReport);

        String geminiReply = geminiService.askGemini(prompt);

        return AssistantChatResponse.builder()
                .reply(geminiReply)
                .actionExecuted(false)
                .actionType("HOME_SUMMARY")
                .build();
    }

    private String parseDht22(String jsonText) {
        if (jsonText == null || jsonText.isBlank()) {
            return "Chưa có dữ liệu DHT22 trong hôm nay.";
        }

        try {
            JsonNode node = objectMapper.readTree(jsonText);

            String temperature = getFirstAvailable(node, "temperature", "temp", "t");
            String humidity = getFirstAvailable(node, "humidity", "hum", "h");
            String value = getFirstAvailable(node, "value");

            if (!temperature.isBlank() || !humidity.isBlank()) {
                return "Nhiệt độ: " + temperature + "°C, độ ẩm: " + humidity + "%";
            }

            if (!value.isBlank()) {
                return value;
            }

            return jsonText;

        } catch (Exception e) {
            return jsonText;
        }
    }

    private String getFirstAvailable(JsonNode node, String... keys) {
        for (String key : keys) {
            JsonNode value = node.get(key);
            if (value != null && !value.asText().isBlank()) {
                return value.asText();
            }
        }
        return "";
    }

    private String buildRecentWarningText(List<Object[]> rows) {
        if (rows == null || rows.isEmpty()) {
            return "Không có cảnh báo gần đây.";
        }

        StringBuilder sb = new StringBuilder();

        for (Object[] row : rows) {
            String label = row[0] != null ? String.valueOf(row[0]) : String.valueOf(row[1]);
            String type = String.valueOf(row[2]);
            String data = String.valueOf(row[3]);
            String createdAt = String.valueOf(row[4]);

            sb.append("- ")
                    .append(label)
                    .append(" [")
                    .append(type)
                    .append("] lúc ")
                    .append(createdAt)
                    .append(": ")
                    .append(data)
                    .append("\n");
        }

        return sb.toString();
    }
}
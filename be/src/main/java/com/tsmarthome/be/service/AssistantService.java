package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssistantService {

    private final GeminiService geminiService;
    private final DeviceRepository deviceRepository;
    private final DeviceManagementService deviceManagementService;

    public AssistantChatResponse chat(String message) {
        if (message == null || message.isBlank()) {
            return AssistantChatResponse.builder()
                    .reply("Bạn muốn tôi hỗ trợ gì cho ngôi nhà?")
                    .actionExecuted(false)
                    .actionType("EMPTY")
                    .build();
        }

        String normalized = normalize(message);

        Boolean action = detectControlAction(normalized);

        if (action != null) {
            Device matchedDevice = findDeviceFromMessage(normalized);

            if (matchedDevice == null) {
                return AssistantChatResponse.builder()
                        .reply("Tôi hiểu bạn muốn " + (action ? "bật" : "tắt") + " thiết bị, nhưng chưa xác định được thiết bị nào.")
                        .actionExecuted(false)
                        .actionType("CONTROL_DEVICE_NOT_FOUND")
                        .build();
            }

            try {
                deviceManagementService.controlDevice(matchedDevice.getId(), action);

                return AssistantChatResponse.builder()
                        .reply("Đã gửi lệnh " + (action ? "bật " : "tắt ") + getDisplayName(matchedDevice) + ".")
                        .actionExecuted(true)
                        .actionType("CONTROL_DEVICE")
                        .build();

            } catch (Exception e) {
                return AssistantChatResponse.builder()
                        .reply("Tôi chưa điều khiển được thiết bị này: " + e.getMessage())
                        .actionExecuted(false)
                        .actionType("CONTROL_DEVICE_ERROR")
                        .build();
            }
        }

        String geminiReply = geminiService.askGemini(message);

        return AssistantChatResponse.builder()
                .reply(geminiReply)
                .actionExecuted(false)
                .actionType("GEMINI_CHAT")
                .build();
    }

    private Boolean detectControlAction(String normalizedMessage) {
        if (
                normalizedMessage.contains("bat ") ||
                        normalizedMessage.startsWith("bat") ||
                        normalizedMessage.contains("mo ") ||
                        normalizedMessage.startsWith("mo")
        ) {
            return true;
        }

        if (
                normalizedMessage.contains("tat ") ||
                        normalizedMessage.startsWith("tat") ||
                        normalizedMessage.contains("dong ") ||
                        normalizedMessage.startsWith("dong")
        ) {
            return false;
        }

        return null;
    }

    private Device findDeviceFromMessage(String normalizedMessage) {
        List<Device> devices = deviceRepository.findAll();

        Device bestMatch = null;
        int bestScore = 0;

        for (Device device : devices) {
            int score = 0;

            String name = normalize(device.getName());
            String label = normalize(device.getLabel());
            String type = normalize(device.getDeviceType());

            if (!label.isBlank() && normalizedMessage.contains(label)) score += 100;
            if (!name.isBlank() && normalizedMessage.contains(name)) score += 80;

            if (type.equals("appliance") && containsAny(normalizedMessage, "den", "rem", "quat", "cua")) score += 20;
            if (type.equals("radar") && normalizedMessage.contains("radar")) score += 20;
            if (type.equals("security") && containsAny(normalizedMessage, "camera", "pir", "chuyen dong")) score += 20;

            if (label.contains("phong khach") && normalizedMessage.contains("phong khach")) score += 25;
            if (label.contains("bep") && normalizedMessage.contains("bep")) score += 25;
            if (label.contains("hanh lang") && normalizedMessage.contains("hanh lang")) score += 25;
            if (label.contains("ban cong") && normalizedMessage.contains("ban cong")) score += 25;
            if (label.contains("cua") && normalizedMessage.contains("cua")) score += 25;

            if (label.contains("den") && normalizedMessage.contains("den")) score += 30;
            if (label.contains("rem") && normalizedMessage.contains("rem")) score += 30;
            if (label.contains("radar") && normalizedMessage.contains("radar")) score += 30;
            if (label.contains("camera") && normalizedMessage.contains("camera")) score += 30;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = device;
            }
        }

        return bestScore >= 30 ? bestMatch : null;
    }

    private String getDisplayName(Device device) {
        if (device.getLabel() != null && !device.getLabel().isBlank()) {
            return device.getLabel();
        }
        return device.getName();
    }

    private boolean containsAny(String source, String... keywords) {
        for (String keyword : keywords) {
            if (source.contains(keyword)) return true;
        }
        return false;
    }

    private String normalize(String input) {
        if (input == null) return "";

        String text = input.toLowerCase(Locale.ROOT).trim();

        text = Normalizer.normalize(text, Normalizer.Form.NFD);
        text = text.replaceAll("\\p{M}", "");

        text = text.replace("đ", "d");

        text = text.replaceAll("[^a-z0-9_\\s]", " ");
        text = text.replaceAll("\\s+", " ");

        return text.trim();
    }
}
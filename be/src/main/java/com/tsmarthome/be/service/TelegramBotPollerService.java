package com.tsmarthome.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsmarthome.be.entity.TelegramLinkCode;
import com.tsmarthome.be.entity.UserProfile;
import com.tsmarthome.be.repository.TelegramLinkCodeRepository;
import com.tsmarthome.be.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelegramBotPollerService {

    @Value("${telegram.bot.token:8849083231:AAGayZO4N5MJmXwLuKEqkoZqUuoeFBk5R3I}")
    private String botToken;

    private final TelegramLinkCodeRepository linkCodeRepository;
    private final UserProfileRepository userProfileRepository;
    private final TelegramService telegramService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    private long lastUpdateId = 0;

    @PostConstruct
    public void init() {
        // Run a one-time request on startup to find the latest update_id and skip past updates
        try {
            if (botToken == null || botToken.isBlank() || botToken.contains("botToken")) {
                return;
            }
            String url = "https://api.telegram.org/bot" + botToken + "/getUpdates?limit=1&offset=-1";
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("ok") && root.get("ok").asBoolean()) {
                    JsonNode result = root.get("result");
                    if (result.isArray() && result.size() > 0) {
                        lastUpdateId = result.get(0).get("update_id").asLong();
                        log.info("Telegram Bot Poller initialized. Skipping past updates. Next offset: {}", lastUpdateId + 1);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to initialize Telegram Bot Poller offset: {}. Starting from 0.", e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 2000)
    public void pollUpdates() {
        if (botToken == null || botToken.isBlank() || botToken.contains("botToken")) {
            return;
        }

        try {
            long offset = lastUpdateId + 1;
            String url = "https://api.telegram.org/bot" + botToken + "/getUpdates?offset=" + offset + "&timeout=5";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("ok") && root.get("ok").asBoolean()) {
                    JsonNode result = root.get("result");
                    if (result.isArray()) {
                        for (JsonNode update : result) {
                            long updateId = update.get("update_id").asLong();
                            if (updateId > lastUpdateId) {
                                lastUpdateId = updateId;
                            }
                            processUpdate(update);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error polling Telegram updates: {}", e.getMessage());
        }
    }

    private void processUpdate(JsonNode update) {
        if (!update.has("message")) {
            return;
        }

        JsonNode message = update.get("message");
        if (!message.has("text") || !message.has("chat")) {
            return;
        }

        String text = message.get("text").asText().trim();
        long chatId = message.get("chat").get("id").asLong();
        String chatIdStr = String.valueOf(chatId);

        String username = "";
        if (message.has("from")) {
            JsonNode from = message.get("from");
            if (from.has("username") && !from.get("username").isNull() && !from.get("username").asText().isBlank()) {
                username = from.get("username").asText();
            } else {
                String first = from.has("first_name") && !from.get("first_name").isNull() ? from.get("first_name").asText() : "";
                String last = from.has("last_name") && !from.get("last_name").isNull() ? from.get("last_name").asText() : "";
                username = (first + " " + last).trim();
            }
        }

        // Support both "/link TSM-XXXXXX" and "/start TSM-XXXXXX"
        if (text.startsWith("/link ") || text.startsWith("/start ")) {
            String[] parts = text.split("\\s+");
            if (parts.length < 2) {
                telegramService.sendMessage(chatIdStr, "❌ Vui lòng cung cấp mã liên kết. Ví dụ: <code>/link TSM-8F4K2P</code>");
                return;
            }

            String codeStr = parts[1].trim();
            Optional<TelegramLinkCode> codeOpt = linkCodeRepository.findByCode(codeStr);

            if (codeOpt.isEmpty()) {
                telegramService.sendMessage(chatIdStr, "❌ Mã liên kết <b>" + codeStr + "</b> không hợp lệ hoặc không tồn tại.");
                return;
            }

            TelegramLinkCode linkCode = codeOpt.get();

            if (linkCode.getIsUsed()) {
                telegramService.sendMessage(chatIdStr, "❌ Mã liên kết <b>" + codeStr + "</b> đã được sử dụng trước đó.");
                return;
            }

            if (linkCode.getExpiresAt().isBefore(LocalDateTime.now())) {
                telegramService.sendMessage(chatIdStr, "❌ Mã liên kết <b>" + codeStr + "</b> đã hết hạn.");
                return;
            }

            // Check if this Telegram Chat ID is already linked to another user
            Optional<UserProfile> existingProfileOpt = userProfileRepository.findByTelegramChatId(chatIdStr);
            if (existingProfileOpt.isPresent() && !existingProfileOpt.get().getUserId().equals(linkCode.getUserId())) {
                telegramService.sendMessage(chatIdStr, "⚠️ Tài khoản Telegram này đã được liên kết với một tài khoản TSmartHome khác.");
                return;
            }

            // Perform link
            UserProfile profile = userProfileRepository.findById(linkCode.getUserId()).orElse(null);
            if (profile == null) {
                telegramService.sendMessage(chatIdStr, "❌ Không tìm thấy hồ sơ người dùng trong hệ thống để liên kết.");
                return;
            }

            profile.setTelegramChatId(chatIdStr);
            profile.setTelegramUsername(username);
            userProfileRepository.save(profile);

            linkCode.setIsUsed(true);
            linkCodeRepository.save(linkCode);

            telegramService.sendMessage(chatIdStr, "✅ <b>Liên kết thành công!</b>\nTài khoản Telegram của bạn đã được kết nối với hệ thống TSmartHome.\nTừ bây giờ bạn sẽ nhận được thông báo từ nhà thông minh.");
            log.info("Linked Telegram chat ID {} (username {}) to user ID {}", chatIdStr, username, linkCode.getUserId());
        } else if (text.equals("/start") || text.equals("/help")) {
            telegramService.sendMessage(chatIdStr, "👋 Chào mừng bạn đến với <b>TSmartHome Bot</b>!\n\nĐể liên kết tài khoản và nhận các cảnh báo từ hệ thống Smart Home, vui lòng nhập lệnh:\n<code>/link [MÃ_LIÊN_KẾT]</code>\n\nVí dụ: <code>/link TSM-8F4K2P</code>\nHoặc bạn có thể truy cập trang cá nhân của mình trên TSmartHome để tạo mã.");
        }
    }
}

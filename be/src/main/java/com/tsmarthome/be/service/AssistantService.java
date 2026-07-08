package com.tsmarthome.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.dto.assistant.response.ChatHistoryResponse;
import com.tsmarthome.be.entity.AssistantChat;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.repository.AssistantChatRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import com.tsmarthome.be.repository.UserHomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssistantService {

    private final GeminiService geminiService;
    private final DeviceRepository deviceRepository;
    private final DeviceManagementService deviceManagementService;
    private final HomeSummaryService homeSummaryService;
    private final AssistantChatRepository assistantChatRepository;
    private final UserHomeRepository userHomeRepository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private boolean isHomeSummaryCommand(String msg) {
        return containsAny(msg,
                "tom tat hom nay",
                "bao cao hom nay",
                "tong hop hom nay",
                "nha hom nay the nao",
                "hom nay co canh bao gi",
                "bao cao tinh hinh nha",
                "tong hop tinh hinh nha",
                "nhiet do hom nay",
                "dht22 hom nay",
                "radar hom nay",
                "security hom nay",
                "safety hom nay"
        );
    }

    private AssistantChatResponse executeChatLogic(UUID userId, String message) {
        log.info("ASSISTANT RAW MESSAGE FROM FE: {}", message);

        if (message == null || message.isBlank()) {
            return AssistantChatResponse.builder()
                    .reply("Bạn muốn tôi hỗ trợ gì cho ngôi nhà?")
                    .actionExecuted(false)
                    .actionType("EMPTY")
                    .build();
        }

        String normalized = normalize(message);

        if (isHomeSummaryCommand(normalized)) {
            return homeSummaryService.summarizeToday();
        }

        try {
            // 1. Get user's homes & devices belonging to user's homes only
            List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(userId);
            List<Device> devices;
            if (homeIds.isEmpty()) {
                devices = List.of();
            } else {
                devices = deviceRepository.findAllByHomeIds(homeIds).stream()
                        .filter(d -> Boolean.FALSE.equals(d.getIsFake()))
                        .toList();
            }

            // 2. Build device list context
            StringBuilder deviceContext = new StringBuilder();
            for (Device d : devices) {
                deviceContext.append("- Name: ").append(d.getName())
                        .append(" | Label: ").append(d.getLabel() != null ? d.getLabel() : d.getName())
                        .append(" | Type: ").append(d.getDeviceType())
                        .append(" | Current State: ").append(d.getState() == null ? "None" : (d.getState() ? "ON" : "OFF"))
                        .append(" | Status: ").append(d.getStatus() != null ? d.getStatus() : "Unknown")
                        .append("\n");
            }

            // 3. Get recent chat history (last 5 messages)
            List<AssistantChat> recentChats = assistantChatRepository.findByUserIdPageable(userId, PageRequest.of(0, 5));
            List<AssistantChat> recentChatsCopy = new ArrayList<>(recentChats);
            Collections.reverse(recentChatsCopy);
            StringBuilder chatHistory = new StringBuilder();
            for (AssistantChat chat : recentChatsCopy) {
                if (Boolean.TRUE.equals(chat.getIsAssistant())) {
                    chatHistory.append("Trợ lý: ").append(chat.getMessage()).append("\n");
                } else {
                    chatHistory.append("Người dùng: ").append(chat.getMessage()).append("\n");
                }
            }

            // 4. Construct System Prompt
            String systemPrompt = """
                Bạn là trợ lý AI điều khiển nhà thông minh TSmartHome bằng tiếng Việt.
                Hãy phân tích yêu cầu của người dùng và trạng thái thiết bị để trả về một đối tượng JSON duy nhất theo cấu trúc sau:
                {
                  "isControl": boolean,
                  "isCheckActivity": boolean,
                  "checkDeviceName": string hoặc null,
                  "actions": [
                    { "deviceName": "tên_thiết_bị_trong_db", "state": boolean }
                  ],
                  "reply": "Câu trả lời của trợ lý bằng tiếng Việt"
                }

                Quy tắc xử lý:
                1. Nếu người dùng muốn điều khiển bật/tắt/mở/đóng thiết bị (hoặc kịch bản/scene):
                   - Đặt "isControl" = true.
                   - Xác định chính xác thiết bị cần điều khiển trong danh sách thiết bị. Trạng thái: true (bật/mở), false (tắt/đóng).
                   - Điền vào mảng "actions". Ví dụ: [{"deviceName": "bedroom1_light_main", "state": false}].
                   - Kịch bản đặc biệt:
                     * Kịch bản buổi sáng (Morning): Mở rèm ban công (balcony1_curtain_main = true) và tắt các đèn phòng ngủ (bedroom1_light_main = false, bedroom2_light_main = false, bedroom3_light_main = false).
                     * Kịch bản rời nhà / đi ngủ / chúc ngủ ngon / Good night: Tắt toàn bộ các đèn (state = false) và đóng rèm ban công (balcony1_curtain_main = false).
                     * Kịch bản về nhà / trời tối / chào mừng về nhà / nhà tối quá: Bật các đèn trong phòng khách/hành lang/bếp (livingroom_light_ceiling = true, kitchen_light_main = true, hallway_light_main = true, ...) và mở rèm ban công (balcony1_curtain_main = true).
                   - Trong "reply", hãy viết câu phản hồi tự nhiên, tóm tắt các hành động điều khiển sẽ được thực hiện. KHÔNG ĐƯỢC tự bịa ra thiết bị không có trong danh sách thiết bị hiện có (không nói về nhạc, tivi, bình nóng lạnh nếu không có trong danh sách).

                2. Nếu người dùng muốn kiểm tra xem thiết bị có còn hoạt động tốt không (connectivity/activity test):
                   - Đặt "isCheckActivity" = true.
                   - Đặt "checkDeviceName" = tên thiết bị chính xác từ danh sách bên dưới (ví dụ: "kitchen_light_main").
                   - Điền câu trả lời chờ vào "reply" (ví dụ: "Đang tiến hành kiểm tra hoạt động của Đèn bếp...").

                3. Nếu người dùng hỏi về trạng thái (ví dụ: "đèn nào đang bật?") hoặc câu hỏi thông thường:
                   - Đặt "isControl" = false, "isCheckActivity" = false.
                   - Sử dụng thông tin trạng thái các thiết bị để trả lời chi tiết và thân thiện trong trường "reply".
                   - Nếu người dùng nói chuyện phiếm, trả lời trò chuyện bình thường.

                Danh sách thiết bị hiện có trong TSmartHome:
                %s

                Lịch sử trò chuyện gần đây:
                %s
                """.formatted(deviceContext.toString(), chatHistory.toString());

            log.info("Sending smart intent request to local AI (Qwen)...");
            String rawJson = geminiService.askGeminiRaw(systemPrompt, message, true);
            log.info("Local AI (Qwen) raw response: {}", rawJson);

            JsonNode root = objectMapper.readTree(rawJson);

            if (root.has("error")) {
                String errorMsg = root.path("error").asText("AI is busy");
                return AssistantChatResponse.builder()
                        .reply("Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: " + errorMsg + "). Bạn vui lòng thử lại sau vài giây nhé!")
                        .actionExecuted(false)
                        .actionType("GEMINI_BUSY")
                        .build();
            }

            boolean isControl = root.has("isControl") && root.path("isControl").asBoolean(false);
            boolean isCheckActivity = root.has("isCheckActivity") && root.path("isCheckActivity").asBoolean(false);
            
            String checkDeviceName = null;
            if (root.has("checkDeviceName") && !root.path("checkDeviceName").isNull()) {
                checkDeviceName = root.path("checkDeviceName").asText();
            }
            
            String reply = "Tôi đã tiếp nhận yêu cầu.";
            if (root.has("reply") && !root.path("reply").isNull()) {
                reply = root.path("reply").asText();
            }

            if (isCheckActivity && checkDeviceName != null && !checkDeviceName.isBlank()) {
                List<Device> matchingDevices = deviceRepository.findAllByName(checkDeviceName);
                if (!matchingDevices.isEmpty()) {
                    Device device = null;
                    for (Device d : matchingDevices) {
                        UUID deviceHomeId = (d.getRoom() != null && d.getRoom().getHome() != null)
                                ? d.getRoom().getHome().getId() : null;
                        if (deviceHomeId != null && homeIds.contains(deviceHomeId)) {
                            device = d;
                            break;
                        }
                    }
                    if (device == null) {
                        device = matchingDevices.get(0);
                    }

                    if (Boolean.TRUE.equals(device.getIsFake())) {
                        return AssistantChatResponse.builder()
                                .reply("Thiết bị " + (device.getLabel() != null ? device.getLabel() : device.getName()) + " là thiết bị ảo (isFake = true), không thể kiểm tra kết nối phần cứng thực tế.")
                                .actionExecuted(false)
                                .actionType("CHECK_DEVICE_FAKE")
                                .build();
                    }
                    return checkDeviceActivity(device);
                } else {
                    return AssistantChatResponse.builder()
                            .reply("Không tìm thấy thiết bị " + checkDeviceName + " để thực hiện kiểm tra hoạt động.")
                            .actionExecuted(false)
                            .actionType("CHECK_DEVICE_NOT_FOUND")
                            .build();
                }
            }

            if (isControl) {
                JsonNode actionsNode = root.path("actions");
                if (actionsNode.isArray() && actionsNode.size() > 0) {
                    int success = 0;
                    int failed = 0;
                    List<String> controlledList = new ArrayList<>();

                    for (JsonNode actionNode : actionsNode) {
                        String devName = actionNode.path("deviceName").asText("");
                        boolean targetState = actionNode.path("state").asBoolean(false);

                        if (!devName.isBlank()) {
                            List<Device> matchingDevices = deviceRepository.findAllByName(devName);
                            if (!matchingDevices.isEmpty()) {
                                Device device = null;
                                for (Device d : matchingDevices) {
                                    UUID deviceHomeId = (d.getRoom() != null && d.getRoom().getHome() != null)
                                            ? d.getRoom().getHome().getId() : null;
                                    if (deviceHomeId != null && homeIds.contains(deviceHomeId)) {
                                        device = d;
                                        break;
                                    }
                                }
                                if (device == null) {
                                    device = matchingDevices.get(0);
                                }

                                if (!Boolean.TRUE.equals(device.getIsFake()) && !"temperature".equals(device.getDeviceType()) && !"air_quality".equals(device.getDeviceType())) {
                                    try {
                                        deviceManagementService.controlDevice(device.getId(), targetState);
                                        success++;
                                        controlledList.add(device.getLabel() != null ? device.getLabel() : device.getName());
                                        Thread.sleep(100);
                                    } catch (Exception ex) {
                                        failed++;
                                        log.warn("Failed to control device {} to state {}: {}", devName, targetState, ex.getMessage());
                                    }
                                } else {
                                    failed++;
                                }
                            } else {
                                failed++;
                            }
                        }
                    }

                    if (success > 0) {
                        String finalReply = reply;
                        if (failed > 0) {
                            finalReply += " (Một số thiết bị gặp lỗi hoặc không thể kết nối).";
                        }
                        return AssistantChatResponse.builder()
                                .reply(finalReply)
                                .actionExecuted(true)
                                .actionType("CONTROL_DEVICE")
                                .build();
                    } else {
                        return AssistantChatResponse.builder()
                                .reply("Không thực hiện được lệnh điều khiển thiết bị nào. Vui lòng kiểm tra lại trạng thái kết nối phần cứng.")
                                .actionExecuted(false)
                                .actionType("CONTROL_DEVICE_FAILED")
                                .build();
                    }
                }
            }

            // Normal response
            return AssistantChatResponse.builder()
                    .reply(reply)
                    .actionExecuted(false)
                    .actionType("GEMINI_CHAT")
                    .build();

        } catch (Exception e) {
            log.error("Error in executeChatLogic: Exception class=" + e.getClass().getName() + ", message=" + e.getMessage(), e);
            // Fallback to basic gemini call
            try {
                String fallbackReply = geminiService.askGemini(message);
                return AssistantChatResponse.builder()
                        .reply(fallbackReply)
                        .actionExecuted(false)
                        .actionType("GEMINI_CHAT")
                        .build();
            } catch (Exception ex) {
                return AssistantChatResponse.builder()
                        .reply("Hệ thống TSmartHome đang bận, xin lỗi vì sự bất tiện này.")
                        .actionExecuted(false)
                        .actionType("CHAT_ERROR")
                        .build();
            }
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public AssistantChatResponse chat(UUID userId, String message) {
        log.info("BẮT ĐẦU LƯU ĐỐI THOẠI CHO USER [{}]: {}", userId, message);

        // 1. Tự động lưu câu lệnh của Người dùng gửi lên vào DB
        assistantChatRepository.save(AssistantChat.builder()
                .userId(userId)
                .message(message)
                .isAssistant(false)
                .actionType("USER_REQUEST")
                .build());

        // 2. Gọi lại CHÍNH XÁC cục logic cũ của bạn (nay đã đổi tên thành executeChatLogic)
        AssistantChatResponse response = executeChatLogic(userId, message);

        // 3. Tự động lưu câu trả lời của AI (Gemini hoặc hệ thống) vào DB
        assistantChatRepository.save(AssistantChat.builder()
                .userId(userId)
                .message(response.getReply())
                .isAssistant(true)
                .actionType(response.getActionType())
                .build());

        // 4. Trả kết quả về cho Controller hệt như cũ
        return response;
    }

    private AssistantChatResponse checkDeviceActivity(Device device) {
        String displayName = getDisplayName(device);
        Boolean originalState = device.getState();
        if (originalState == null) {
            return AssistantChatResponse.builder()
                    .reply("Thiết bị " + displayName + " không hỗ trợ lưu trạng thái Bật/Tắt (state = null) nên không thể kiểm tra hoạt động.")
                    .actionExecuted(false)
                    .actionType("CHECK_DEVICE_NO_STATE")
                    .build();
        }

        try {
            boolean firstCommand = !originalState;
            log.info("[Assistant] Đang kiểm tra hoạt động của {}. State hiện tại: {}, Gửi lệnh 1: {}", 
                    device.getName(), originalState, firstCommand);

            // Gửi lệnh đổi trạng thái
            deviceManagementService.controlDevice(device.getId(), firstCommand);

            boolean responded = false;
            // Chờ phản hồi trong tối đa 1.5 giây
            for (int i = 0; i < 15; i++) {
                Thread.sleep(100);
                entityManager.clear(); // Clear L1 cache to reload from DB
                Device updated = deviceRepository.findById(device.getId()).orElse(null);
                if (updated != null && updated.getState() != null && updated.getState() == firstCommand) {
                    responded = true;
                    break;
                }
            }

            if (responded) {
                log.info("[Assistant] {} đã phản hồi! Đang khôi phục lại trạng thái ban đầu: {}", 
                        device.getName(), originalState);
                
                // Khôi phục lại trạng thái ban đầu
                deviceManagementService.controlDevice(device.getId(), originalState);

                // Chờ khôi phục
                for (int i = 0; i < 10; i++) {
                    Thread.sleep(100);
                    entityManager.clear();
                    Device updated = deviceRepository.findById(device.getId()).orElse(null);
                    if (updated != null && updated.getState() != null && updated.getState() == originalState) {
                        break;
                    }
                }

                return AssistantChatResponse.builder()
                        .reply("Thiết bị " + displayName + " vẫn hoạt động tốt! Trạng thái của thiết bị đã tự động phản hồi và khôi phục về trạng thái " + (originalState ? "Bật" : "Tắt") + ".")
                        .actionExecuted(true)
                        .actionType("CHECK_DEVICE_ACTIVE")
                        .build();
            } else {
                log.warn("[Assistant] {} không phản hồi trong 1.5 giây!", device.getName());
                
                // Khôi phục hiển thị trạng thái ban đầu trên DB
                entityManager.clear();
                Device updated = deviceRepository.findById(device.getId()).orElse(null);
                if (updated != null) {
                    if (updated.getState() != originalState) {
                        updated.setState(originalState);
                        deviceRepository.save(updated);
                    }
                }

                return AssistantChatResponse.builder()
                        .reply("Thiết bị " + displayName + " không phản hồi tín hiệu điều khiển. Có thể thiết bị đang mất kết nối hoặc bị hỏng.")
                        .actionExecuted(false)
                        .actionType("CHECK_DEVICE_INACTIVE")
                        .build();
            }

        } catch (Exception e) {
            log.error("[Assistant] Lỗi khi kiểm tra hoạt động thiết bị: {}", device.getName(), e);
            return AssistantChatResponse.builder()
                    .reply("Gặp lỗi khi kiểm tra thiết bị " + displayName + ": " + e.getMessage())
                    .actionExecuted(false)
                    .actionType("CHECK_DEVICE_ERROR")
                    .build();
        }
    }

    private String getDisplayName(Device device) {
        if (device.getLabel() != null && !device.getLabel().isBlank()) {
            return device.getLabel();
        }
        return device.getName();
    }

    private boolean containsAny(String source, String... keywords) {
        for (String keyword : keywords) {
            if (source.contains(normalize(keyword))) {
                return true;
            }
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

    public List<ChatHistoryResponse> getUserChatHistoryLazy(UUID userId, int page) {
        // Mỗi trang lấy đúng 20 tin nhắn
        Pageable pageable = PageRequest.of(page, 20);

        // Kéo dữ liệu từ DB (tin nhắn mới nhất sẽ nằm đầu danh sách)
        List<AssistantChat> chats = assistantChatRepository.findByUserIdPageable(userId, pageable);

        // Convert sang DTO
        List<ChatHistoryResponse> responseList = chats.stream().map(c -> ChatHistoryResponse.builder()
                .id(c.getId())
                .message(c.getMessage())
                .isAssistant(c.getIsAssistant())
                .actionType(c.getActionType())
                .createdAt(c.getCreatedAt())
                .build()
        ).collect(Collectors.toList());

        // ĐẢO NGƯỢC LẠI danh sách để tin nhắn cũ lên đầu, tin nhắn mới xuống cuối (chuẩn UI chat)
        Collections.reverse(responseList);

        return responseList;
    }
}
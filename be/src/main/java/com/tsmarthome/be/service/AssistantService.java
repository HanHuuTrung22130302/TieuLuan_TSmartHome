package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.assistant.response.AssistantChatResponse;
import com.tsmarthome.be.dto.assistant.response.ChatHistoryResponse;
import com.tsmarthome.be.entity.AssistantChat;
import com.tsmarthome.be.entity.Device;
import com.tsmarthome.be.repository.AssistantChatRepository;
import com.tsmarthome.be.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;

import java.util.Optional;
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

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;


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
    private AssistantChatResponse executeChatLogic(String message) {
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

        if (isDeviceStateQuery(normalized)) {
            return summarizeDeviceStatesWithGemini(message);
        }

        if (isDeviceActivityCheckQuery(normalized)) {
            return checkDeviceActivity(normalized);
        }

        log.info("ASSISTANT NORMALIZED MESSAGE: {}", normalized);

        Boolean action = detectControlAction(normalized);
        log.info("ASSISTANT DETECTED ACTION: {}", action);
        AssistantChatResponse sceneResponse = handleSceneCommand(normalized);
        if (sceneResponse != null) {
            return sceneResponse;
        }

        // Nếu là lệnh bật/tắt/mở/đóng
        if (action != null) {

            // Lệnh hàng loạt: tắt hết đèn, bật tất cả thiết bị điện...
            if (isBulkCommand(normalized)) {
                return handleBulkCommand(normalized, action);
            }

            // Lệnh nhiều thiết bị: bật đèn phòng khách và phòng ăn
            AssistantChatResponse multiResponse = handleMultiDeviceCommand(normalized, action);
            if (multiResponse != null) {
                return multiResponse;
            }


            MatchResult matchResult = findTargetDevice(normalized);

            if (matchResult.status == MatchStatus.NOT_FOUND) {
                return AssistantChatResponse.builder()
                        .reply("Tôi chưa xác định được thiết bị cần điều khiển. Bạn hãy nói rõ hơn, ví dụ: bật đèn hành lang, tắt đèn bếp, mở rèm ban công 1.")
                        .actionExecuted(false)
                        .actionType("CONTROL_DEVICE_NOT_FOUND")
                        .build();
            }

            if (matchResult.status == MatchStatus.AMBIGUOUS) {
                return AssistantChatResponse.builder()
                        .reply("Tôi thấy có nhiều thiết bị phù hợp. Bạn hãy nói rõ hơn: " + String.join(", ", matchResult.suggestions) + ".")
                        .actionExecuted(false)
                        .actionType("CONTROL_DEVICE_AMBIGUOUS")
                        .build();
            }

            Device matchedDevice = matchResult.device;

            try {
                if (matchedDevice.getState() == null) {
                    return AssistantChatResponse.builder()
                            .reply(getDisplayName(matchedDevice) + " hiện không hỗ trợ bật/tắt.")
                            .actionExecuted(false)
                            .actionType("CONTROL_DEVICE_NOT_SUPPORTED")
                            .build();
                }

                deviceManagementService.controlDevice(matchedDevice.getId(), action);

                return AssistantChatResponse.builder()
                        .reply("Đã gửi lệnh " + getActionText(action, normalized) + " " + getDisplayName(matchedDevice) + ".")
                        .actionExecuted(true)
                        .actionType("CONTROL_DEVICE")
                        .build();

            } catch (Exception e) {
                log.error("ASSISTANT CONTROL DEVICE ERROR", e);

                return AssistantChatResponse.builder()
                        .reply("Tôi chưa điều khiển được thiết bị này: " + e.getMessage())
                        .actionExecuted(false)
                        .actionType("CONTROL_DEVICE_ERROR")
                        .build();
            }
        }

        // Không phải lệnh điều khiển thì gửi Gemini
        String geminiReply = geminiService.askGemini(message);

        return AssistantChatResponse.builder()
                .reply(geminiReply)
                .actionExecuted(false)
                .actionType("GEMINI_CHAT")
                .build();
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
        AssistantChatResponse response = executeChatLogic(message);

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

    // ==========================
    // DETECT ACTION
    // ==========================

    private Boolean detectControlAction(String msg) {
        if (
                msg.startsWith("bat ") ||
                        msg.equals("bat") ||
                        msg.contains(" bat ") ||
                        msg.startsWith("mo ") ||
                        msg.equals("mo") ||
                        msg.contains(" mo ")
        ) {
            return true;
        }

        if (
                msg.startsWith("tat ") ||
                        msg.equals("tat") ||
                        msg.contains(" tat ") ||
                        msg.startsWith("dong ") ||
                        msg.equals("dong") ||
                        msg.contains(" dong ")
        ) {
            return false;
        }

        return null;
    }

    private String getActionText(Boolean action, String msg) {
        if (action == null) return "điều khiển";

        if (action) {
            if (msg.contains("mo")) return "mở";
            return "bật";
        }

        if (msg.contains("dong")) return "đóng";
        return "tắt";
    }

    // ==========================
    // BULK COMMAND
    // ==========================

    private boolean isBulkCommand(String msg) {
        return containsAny(msg,
                "tat tat ca", "tat het", "tat toan bo",
                "bat tat ca", "bat het", "bat toan bo",
                "mo tat ca", "mo het",
                "dong tat ca", "dong het"
        );
    }

    private AssistantChatResponse handleBulkCommand(String msg, boolean action) {
        List<Device> targetDevices = new ArrayList<>();

        List<Device> allDevices = deviceRepository.findAll();

        // Tất cả thiết bị điện / đồ điện
        if (containsAny(msg, "thiet bi dien", "do dien", "thiet bi", "appliance")) {
            targetDevices = allDevices.stream()
                    .filter(d -> d.getState() != null)
                    .filter(d -> normalize(d.getDeviceType()).equals("appliance"))
                    .toList();
        }
        // Tất cả đèn
        else if (containsAny(msg, "den", "bong den", "light")) {
            targetDevices = allDevices.stream()
                    .filter(d -> d.getState() != null)
                    .filter(d -> {
                        String name = normalize(d.getName());
                        String label = normalize(d.getLabel());
                        return name.contains("light") || label.contains("den");
                    })
                    .toList();
        }
        // Tất cả rèm
        else if (containsAny(msg, "rem", "curtain")) {
            targetDevices = allDevices.stream()
                    .filter(d -> d.getState() != null)
                    .filter(d -> {
                        String name = normalize(d.getName());
                        String label = normalize(d.getLabel());
                        return name.contains("curtain") || label.contains("rem");
                    })
                    .toList();
        }

        if (targetDevices.isEmpty()) {
            return AssistantChatResponse.builder()
                    .reply("Tôi hiểu bạn muốn điều khiển nhiều thiết bị, nhưng chưa rõ nhóm nào. Bạn có thể nói: tắt hết đèn, bật tất cả thiết bị điện, mở hết rèm.")
                    .actionExecuted(false)
                    .actionType("BULK_CONTROL_GROUP_NOT_FOUND")
                    .build();
        }

        int success = 0;
        int failed = 0;

        for (Device device : targetDevices) {
            try {
                deviceManagementService.controlDevice(device.getId(), action);
                success++;

                // Delay nhẹ để MQTT/ESP32 đỡ bị dồn lệnh quá nhanh
                Thread.sleep(100);
            } catch (Exception e) {
                failed++;
                log.warn("ASSISTANT BULK CONTROL FAILED: device={}, error={}", device.getName(), e.getMessage());
            }
        }

        return AssistantChatResponse.builder()
                .reply("Đã gửi lệnh " + getActionText(action, msg) + " " + success + " thiết bị. " +
                        (failed > 0 ? "Có " + failed + " thiết bị chưa điều khiển được." : ""))
                .actionExecuted(success > 0)
                .actionType("BULK_CONTROL")
                .build();
    }

    private AssistantChatResponse handleMultiDeviceCommand(String msg, boolean action) {
        // Chỉ xử lý multi khi câu có dấu hiệu liệt kê
        if (!containsAny(msg, " va ", " voi ", " cung ", ",")) {
            return null;
        }

        List<DeviceTarget> targets = buildDeviceTargets();
        List<DeviceTarget> matchedTargets = new ArrayList<>();

        for (DeviceTarget target : targets) {
            for (String alias : target.aliases) {
                String normalizedAlias = normalize(alias);

                if (!normalizedAlias.isBlank() && msg.contains(normalizedAlias)) {
                    matchedTargets.add(target);
                    break;
                }
            }
        }

        // Không đủ 2 thiết bị thì để logic single device xử lý tiếp
        if (matchedTargets.size() < 2) {
            return null;
        }

        // Loại trùng deviceName
        List<DeviceTarget> uniqueTargets = matchedTargets.stream()
                .collect(java.util.stream.Collectors.toMap(
                        t -> t.deviceName,
                        t -> t,
                        (a, b) -> a
                ))
                .values()
                .stream()
                .toList();

        int success = 0;
        int failed = 0;
        List<String> controlledNames = new ArrayList<>();

        for (DeviceTarget target : uniqueTargets) {
            Optional<Device> optionalDevice = deviceRepository.findByName(target.deviceName);

            if (optionalDevice.isEmpty()) {
                failed++;
                continue;
            }

            Device device = optionalDevice.get();

            if (device.getState() == null) {
                failed++;
                continue;
            }

            try {
                deviceManagementService.controlDevice(device.getId(), action);
                success++;
                controlledNames.add(getDisplayName(device));

                Thread.sleep(100);
            } catch (Exception e) {
                failed++;
                log.warn("ASSISTANT MULTI CONTROL FAILED: device={}, error={}", device.getName(), e.getMessage());
            }
        }

        if (success == 0) {
            return AssistantChatResponse.builder()
                    .reply("Tôi nhận ra nhiều thiết bị, nhưng chưa điều khiển được thiết bị nào.")
                    .actionExecuted(false)
                    .actionType("MULTI_CONTROL_FAILED")
                    .build();
        }

        return AssistantChatResponse.builder()
                .reply("Đã gửi lệnh " + getActionText(action, msg) + " cho: " + String.join(", ", controlledNames) + ". " +
                        (failed > 0 ? "Có " + failed + " thiết bị chưa điều khiển được." : ""))
                .actionExecuted(true)
                .actionType("MULTI_CONTROL")
                .build();
    }

    // ==========================
    // DEVICE MATCHING
    // ==========================

    // ==========================
// SCENE COMMANDS
// ==========================

    private AssistantChatResponse handleSceneCommand(String msg) {
        // Bỏ wake word để câu dễ match hơn
        msg = removeWakeWord(msg);

        if (isHomeArrivalScene(msg) || isDarkScene(msg)) {
            return executeHomeArrivalScene();
        }

        if (isLeavingScene(msg)) {
            return executeLeavingScene();
        }

        if (isMorningScene(msg)) {
            return executeMorningScene();
        }

        return null;
    }

    private String removeWakeWord(String msg) {
        return msg
                .replace("hey tsmart", "")
                .replace("hey smart", "")
                .replace("tsmart", "")
                .replace("t smart", "")
                .trim();
    }

    private boolean isHomeArrivalScene(String msg) {
        return containsAny(msg,
                "toi da ve nha",
                "toi ve nha roi",
                "minh ve nha roi",
                "ve nha roi",
                "toi ve roi",
                "da ve nha",
                "kich ban ve nha",
                "kich ban chao mung",
                "chao mung ve nha"
        );
    }

    private boolean isDarkScene(String msg) {
        return containsAny(msg,
                "troi toi roi",
                "toi roi",
                "troi dang toi",
                "den gio bat den",
                "nha toi qua"
        );
    }

    private boolean isLeavingScene(String msg) {
        return containsAny(msg,
                "toi di day",
                "toi di day nha",
                "toi di lam",
                "toi ra ngoai",
                "toi ra khoi nha",
                "di lam day",
                "di day",
                "vang nha",
                "kich ban di lam",
                "kich ban ra ngoai",
                "di ngu",
                "kich ban di ngu",
                "chuc ngu ngon",
                "good night"
        );
    }

    private boolean isMorningScene(String msg) {
        return containsAny(msg,
                "troi sang roi",
                "sang roi",
                "troi da sang",
                "den sang roi",
                "tat den di",
                "buoi sang",
                "kich ban buoi sang",
                "chao buoi sang",
                "morning"
        );
    }

    private AssistantChatResponse executeHomeArrivalScene() {
        int success = 0;
        int failed = 0;
        List<String> lightDeviceNames = getLightDeviceNames();
        for (String name : lightDeviceNames) {
            Optional<Device> dOpt = deviceRepository.findByName(name);
            if (dOpt.isPresent() && dOpt.get().getState() != null) {
                try {
                    deviceManagementService.controlDevice(dOpt.get().getId(), true);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
        }

        boolean curtainSuccess = false;
        Optional<Device> curtainOpt = deviceRepository.findByName("balcony1_curtain_main");
        if (curtainOpt.isPresent() && curtainOpt.get().getState() != null) {
            try {
                deviceManagementService.controlDevice(curtainOpt.get().getId(), true);
                curtainSuccess = true;
            } catch (Exception e) {
                log.warn("Lỗi mở rèm trong kịch bản: {}", e.getMessage());
            }
        }

        String reply = "Dạ, TSmartHome đã kích hoạt kịch bản Về nhà: Đã bật " + success + " đèn" 
                + (curtainSuccess ? " và mở rèm cửa ban công" : "") + " để chào đón bạn.";
        if (failed > 0) {
            reply += " (Có " + failed + " đèn không kết nối được).";
        }

        return AssistantChatResponse.builder()
                .reply(reply)
                .actionExecuted(success > 0 || curtainSuccess)
                .actionType("SCENE_HOME_ARRIVAL")
                .build();
    }

    private AssistantChatResponse executeLeavingScene() {
        int success = 0;
        int failed = 0;
        List<String> lightDeviceNames = getLightDeviceNames();
        for (String name : lightDeviceNames) {
            Optional<Device> dOpt = deviceRepository.findByName(name);
            if (dOpt.isPresent() && dOpt.get().getState() != null) {
                try {
                    deviceManagementService.controlDevice(dOpt.get().getId(), false);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
        }

        boolean curtainSuccess = false;
        Optional<Device> curtainOpt = deviceRepository.findByName("balcony1_curtain_main");
        if (curtainOpt.isPresent() && curtainOpt.get().getState() != null) {
            try {
                deviceManagementService.controlDevice(curtainOpt.get().getId(), false);
                curtainSuccess = true;
            } catch (Exception e) {
                log.warn("Lỗi đóng rèm trong kịch bản: {}", e.getMessage());
            }
        }

        String reply = "Dạ, TSmartHome đã kích hoạt kịch bản Rời nhà / Đi ngủ: Đã tắt " + success + " đèn" 
                + (curtainSuccess ? " và đóng rèm cửa ban công." : ".");
        if (failed > 0) {
            reply += " (Có " + failed + " đèn không phản hồi).";
        }

        return AssistantChatResponse.builder()
                .reply(reply)
                .actionExecuted(success > 0 || curtainSuccess)
                .actionType("SCENE_LEAVING")
                .build();
    }

    private AssistantChatResponse executeMorningScene() {
        List<String> bedroomLights = List.of(
                "bedroom1_light_main",
                "bedroom2_light_main",
                "bedroom3_light_main"
        );
        int success = 0;
        int failed = 0;
        for (String name : bedroomLights) {
            Optional<Device> dOpt = deviceRepository.findByName(name);
            if (dOpt.isPresent() && dOpt.get().getState() != null) {
                try {
                    deviceManagementService.controlDevice(dOpt.get().getId(), false);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
        }

        boolean curtainSuccess = false;
        Optional<Device> curtainOpt = deviceRepository.findByName("balcony1_curtain_main");
        if (curtainOpt.isPresent() && curtainOpt.get().getState() != null) {
            try {
                deviceManagementService.controlDevice(curtainOpt.get().getId(), true);
                curtainSuccess = true;
            } catch (Exception e) {
                log.warn("Lỗi mở rèm trong kịch bản buổi sáng: {}", e.getMessage());
            }
        }

        String reply = "Dạ, TSmartHome đã kích hoạt kịch bản Buổi sáng: Đã mở rèm ban công" 
                + (success > 0 ? " và tắt " + success + " đèn phòng ngủ." : ".");
        if (failed > 0) {
            reply += " (Có " + failed + " đèn ngủ chưa tắt được).";
        }

        return AssistantChatResponse.builder()
                .reply(reply)
                .actionExecuted(success > 0 || curtainSuccess)
                .actionType("SCENE_MORNING")
                .build();
    }

    private List<String> getLightDeviceNames() {
        return List.of(
                "livingroom_light_front",
                "livingroom_light_back",
                "livingroom_light_ceiling",
                "livingroom_light_dining",
                "kitchen_light_main",
                "hallway_light_main",
                "balcony1_light_main",
                "balcony2_light_main",
                "bedroom1_light_main",
                "bedroom2_light_main",
                "bedroom3_light_main",
                "wc1_light_main",
                "wc2_light_main",
                "wc3_light_main"
        );
    }

    private MatchResult findTargetDevice(String msg) {
        List<DeviceTarget> targets = buildDeviceTargets();

        List<DeviceTarget> matches = new ArrayList<>();

        for (DeviceTarget target : targets) {
            for (String alias : target.aliases) {
                if (msg.contains(normalize(alias))) {
                    matches.add(target);
                    break;
                }
            }
        }

        log.info("ASSISTANT MATCH COUNT: {}", matches.size());

        for (DeviceTarget target : matches) {
            log.info("ASSISTANT MATCH TARGET: deviceName={}, displayName={}", target.deviceName, target.displayName);
        }

        if (matches.isEmpty()) {
            return MatchResult.notFound();
        }

        // Nếu match đúng 1 thiết bị
        if (matches.size() == 1) {
            Optional<Device> optionalDevice = deviceRepository.findByName(matches.get(0).deviceName);

            if (optionalDevice.isEmpty()) {
                return MatchResult.notFound();
            }

            return MatchResult.found(optionalDevice.get());
        }

        // Nếu nhiều match, thử ưu tiên alias dài hơn / cụ thể hơn
        DeviceTarget best = chooseMostSpecificTarget(msg, matches);

        if (best != null) {
            Optional<Device> optionalDevice = deviceRepository.findByName(best.deviceName);

            if (optionalDevice.isPresent()) {
                return MatchResult.found(optionalDevice.get());
            }
        }

        List<String> suggestions = matches.stream()
                .map(t -> t.displayName)
                .distinct()
                .limit(5)
                .toList();

        return MatchResult.ambiguous(suggestions);
    }

    private DeviceTarget chooseMostSpecificTarget(String msg, List<DeviceTarget> matches) {
        DeviceTarget best = null;
        int bestScore = 0;
        boolean tied = false;

        for (DeviceTarget target : matches) {
            int score = 0;

            for (String alias : target.aliases) {
                String normalizedAlias = normalize(alias);
                if (msg.contains(normalizedAlias)) {
                    score = Math.max(score, normalizedAlias.length());
                }
            }

            if (score > bestScore) {
                bestScore = score;
                best = target;
                tied = false;
            } else if (score == bestScore) {
                tied = true;
            }
        }

        if (tied) return null;
        return best;
    }

    private List<DeviceTarget> buildDeviceTargets() {
        List<DeviceTarget> list = new ArrayList<>();

        // ================= ĐÈN PHÒNG KHÁCH / BẾP =================
        list.add(new DeviceTarget("livingroom_light_front", "Đèn trần trước",
                "den tran truoc", "den truoc", "den phong khach truoc", "den khach truoc", "den livingroom front"));

        list.add(new DeviceTarget("livingroom_light_ceiling", "Đèn trần phòng khách",
                "den tran phong khach", "den tran p khach", "den phong khach", "den p khach", "den khach",
                "phong khach", "p khach", "khach", "den ceiling"));

        list.add(new DeviceTarget("livingroom_light_dining", "Đèn phòng ăn",
                "den phong an", "den ban an", "den khu an", "den dining",
                "phong an", "ban an", "khu an"));
        list.add(new DeviceTarget("livingroom_light_dining", "Đèn phòng ăn",
                "den phong an", "den ban an", "den khu an", "den dining"));

        list.add(new DeviceTarget("kitchen_light_main", "Đèn bếp",
                "den bep", "den phong bep", "den kitchen"));

        // ================= HÀNH LANG =================
        list.add(new DeviceTarget("hallway_light_main", "Đèn hành lang",
                "den hanh lang", "den hallway"));

        // ================= BAN CÔNG =================
        list.add(new DeviceTarget("balcony1_light_main", "Đèn ban công 1",
                "den ban cong 1", "den balcony 1", "den balcony1", "den ban cong mot"));

        list.add(new DeviceTarget("balcony2_light_main", "Đèn ban công 2",
                "den ban cong 2", "den balcony 2", "den balcony2", "den ban cong hai"));

        list.add(new DeviceTarget("balcony1_curtain_main", "Rèm ban công 1",
                "rem ban cong 1", "rem balcony 1", "rem balcony1", "rem ban cong mot", "rem cua ban cong 1"));

        // ================= PHÒNG NGỦ =================
        list.add(new DeviceTarget("bedroom1_light_main", "Đèn phòng ngủ 1",
                "den phong ngu 1", "den pn1", "den phong 1", "den bedroom 1", "den bedroom1"));

        list.add(new DeviceTarget("bedroom2_light_main", "Đèn phòng ngủ 2",
                "den phong ngu 2", "den pn2", "den phong 2", "den bedroom 2", "den bedroom2"));

        list.add(new DeviceTarget("bedroom3_light_main", "Đèn phòng ngủ 3",
                "den phong ngu 3", "den pn3", "den phong 3", "den bedroom 3", "den bedroom3"));

        // ================= WC =================
        list.add(new DeviceTarget("wc1_light_main", "Đèn WC 1",
                "den wc 1", "den nha ve sinh 1", "den ve sinh 1", "den toilet 1", "den wc1"));

        list.add(new DeviceTarget("wc2_light_main", "Đèn WC 2",
                "den wc 2", "den nha ve sinh 2", "den ve sinh 2", "den toilet 2", "den wc2"));

        list.add(new DeviceTarget("wc3_light_main", "Đèn WC 3",
                "den wc 3", "den nha ve sinh 3", "den ve sinh 3", "den toilet 3", "den wc3"));

        // ================= THIẾT BỊ KHÁC =================
        list.add(new DeviceTarget("global_safety_buzzer", "Còi Buzzer",
                "coi", "coi bao dong", "buzzer", "chuong bao dong"));

        list.add(new DeviceTarget("global_appliance_tv", "TV",
                "tv", "ti vi", "tivi"));

        // Radar nếu bạn vẫn muốn cho điều khiển bật/tắt
        list.add(new DeviceTarget("livingroom_sensor_radar", "Radar phòng khách hàng 1",
                "radar phong khach 1", "radar hang 1", "radar khach 1"));

        list.add(new DeviceTarget("livingroom_sensor_radar2", "Radar phòng khách hàng 2",
                "radar phong khach 2", "radar hang 2", "radar khach 2"));

        list.add(new DeviceTarget("livingroom_sensor_radar3", "Radar phòng khách hàng 3",
                "radar phong khach 3", "radar hang 3", "radar khach 3"));

        list.add(new DeviceTarget("hallway_sensor_radar", "Radar hành lang",
                "radar hanh lang", "radar hallway"));

        return list;
    }

    // ==========================
    // UTILS
    // ==========================

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

    private static class DeviceTarget {
        private final String deviceName;
        private final String displayName;
        private final List<String> aliases;

        public DeviceTarget(String deviceName, String displayName, String... aliases) {
            this.deviceName = deviceName;
            this.displayName = displayName;
            this.aliases = List.of(aliases);
        }
    }

    private enum MatchStatus {
        FOUND,
        NOT_FOUND,
        AMBIGUOUS
    }

    private static class MatchResult {
        private final MatchStatus status;
        private final Device device;
        private final List<String> suggestions;

        private MatchResult(MatchStatus status, Device device, List<String> suggestions) {
            this.status = status;
            this.device = device;
            this.suggestions = suggestions;
        }

        static MatchResult found(Device device) {
            return new MatchResult(MatchStatus.FOUND, device, List.of());
        }

        static MatchResult notFound() {
            return new MatchResult(MatchStatus.NOT_FOUND, null, List.of());
        }

        static MatchResult ambiguous(List<String> suggestions) {
            return new MatchResult(MatchStatus.AMBIGUOUS, null, suggestions);
        }
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

    private boolean isDeviceStateQuery(String msg) {
        return containsAny(msg,
                "trang thai thiet bi",
                "trang thai cac thiet bi",
                "thiet bi nao dang bat",
                "thiet bi nao dang tat",
                "nha co thiet bi nao dang bat",
                "nha co thiet bi nao dang tat",
                "kiem tra thiet bi",
                "kiem tra trang thai",
                "bao cao trang thai thiet bi",
                "danh sach thiet bi dang bat",
                "danh sach thiet bi dang tat",
                "state thiet bi"
        );
    }

    private AssistantChatResponse summarizeDeviceStatesWithGemini(String userMessage) {
        List<Device> devices = deviceRepository.findAll().stream()
                .filter(d -> Boolean.FALSE.equals(d.getIsFake()))
                .filter(d -> d.getState() != null)
                .toList();

        if (devices.isEmpty()) {
            return AssistantChatResponse.builder()
                    .reply("Hiện chưa có thiết bị thật nào có trạng thái bật/tắt để báo cáo.")
                    .actionExecuted(false)
                    .actionType("DEVICE_STATE_SUMMARY")
                    .build();
        }

        long onCount = devices.stream().filter(d -> Boolean.TRUE.equals(d.getState())).count();
        long offCount = devices.stream().filter(d -> Boolean.FALSE.equals(d.getState())).count();

        StringBuilder deviceList = new StringBuilder();

        for (Device d : devices) {
            deviceList.append("- ")
                    .append(getDisplayName(d))
                    .append(" | name: ")
                    .append(d.getName())
                    .append(" | type: ")
                    .append(d.getDeviceType())
                    .append(" | state: ")
                    .append(Boolean.TRUE.equals(d.getState()) ? "Bật" : "Tắt")
                    .append(" | status: ")
                    .append(d.getStatus())
                    .append("\n");
        }

        String prompt = """
            Bạn là trợ lý AI của hệ thống nhà thông minh TSmartHome.
            Dưới đây là dữ liệu thật từ bảng devices, chỉ gồm các thiết bị isFake = false và có state bật/tắt.

            Người dùng hỏi:
            %s

            Tổng quan:
            - Tổng số thiết bị có thể bật/tắt: %d
            - Đang bật: %d
            - Đang tắt: %d

            Danh sách thiết bị:
            %s

            Hãy trả lời ngắn gọn bằng tiếng Việt.
            Nếu người dùng hỏi thiết bị nào đang bật thì liệt kê thiết bị đang bật.
            Nếu người dùng hỏi thiết bị nào đang tắt thì liệt kê thiết bị đang tắt.
            Nếu người dùng hỏi tổng quan thì tóm tắt số lượng bật/tắt và nêu vài thiết bị nổi bật.
            Không bịa thêm thiết bị ngoài danh sách.
            """.formatted(userMessage, devices.size(), onCount, offCount, deviceList);

        String geminiReply = geminiService.askGemini(prompt);

        // Fallback nếu Gemini lỗi 503 hoặc lỗi API
        if (geminiReply == null
                || geminiReply.contains("Gemini đang tạm thời")
                || geminiReply.contains("Lỗi khi gọi Gemini")
                || geminiReply.contains("Gemini phản hồi lỗi")) {

            String onDevices = devices.stream()
                    .filter(d -> Boolean.TRUE.equals(d.getState()))
                    .map(this::getDisplayName)
                    .collect(Collectors.joining(", "));

            String offDevices = devices.stream()
                    .filter(d -> Boolean.FALSE.equals(d.getState()))
                    .map(this::getDisplayName)
                    .collect(Collectors.joining(", "));

            geminiReply = "Hiện có " + devices.size() + " thiết bị thật có trạng thái bật/tắt. "
                    + "Đang bật: " + onCount + " thiết bị"
                    + (onDevices.isBlank() ? "" : " gồm " + onDevices)
                    + ". Đang tắt: " + offCount + " thiết bị"
                    + (offDevices.isBlank() ? "" : " gồm " + offDevices)
                    + ".";
        }

        return AssistantChatResponse.builder()
                .reply(geminiReply)
                .actionExecuted(false)
                .actionType("DEVICE_STATE_SUMMARY")
                .build();
    }

    private boolean isDeviceActivityCheckQuery(String msg) {
        return containsAny(msg,
                "hoat dong khong",
                "hoat dong duoc khong",
                "con hoat dong",
                "con chay khong",
                "kiem tra hoat dong",
                "con chay duoc",
                "co hong khong",
                "co hu khong",
                "bi hong khong",
                "bi hu khong",
                "check hoat dong",
                "kiem tra ket noi"
        );
    }

    private AssistantChatResponse checkDeviceActivity(String normalized) {
        MatchResult matchResult = findTargetDevice(normalized);

        if (matchResult.status == MatchStatus.NOT_FOUND) {
            return AssistantChatResponse.builder()
                    .reply("Tôi không tìm thấy thiết bị bạn muốn kiểm tra. Vui lòng nói rõ hơn, ví dụ: 'đèn phòng khách còn hoạt động không?'")
                    .actionExecuted(false)
                    .actionType("CHECK_DEVICE_NOT_FOUND")
                    .build();
        }

        if (matchResult.status == MatchStatus.AMBIGUOUS) {
            return AssistantChatResponse.builder()
                    .reply("Tôi thấy có nhiều thiết bị phù hợp. Bạn muốn kiểm tra thiết bị nào: " + String.join(", ", matchResult.suggestions) + "?")
                    .actionExecuted(false)
                    .actionType("CHECK_DEVICE_AMBIGUOUS")
                    .build();
        }

        Device device = matchResult.device;
        String displayName = getDisplayName(device);

        if (Boolean.TRUE.equals(device.getIsFake())) {
            return AssistantChatResponse.builder()
                    .reply("Thiết bị " + displayName + " là thiết bị ảo (isFake = true), không thể kiểm tra kết nối phần cứng thực tế.")
                    .actionExecuted(false)
                    .actionType("CHECK_DEVICE_FAKE")
                    .build();
        }

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
                if (updated != null && updated.getState() == firstCommand) {
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
                    if (updated != null && updated.getState() == originalState) {
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
                if (updated != null && updated.getState() != originalState) {
                    updated.setState(originalState);
                    deviceRepository.save(updated);
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

}
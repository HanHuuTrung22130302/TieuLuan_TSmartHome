package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.admin.*;
import com.tsmarthome.be.entity.*;
import com.tsmarthome.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final HomeRepository homeRepository;
    private final UserHomeRepository userHomeRepository;
    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;
    private final CameraStreamRepository cameraStreamRepository;
    private final PasswordEncoder passwordEncoder;
    private final MqttService mqttService;
    private final AuditLogService auditLogService;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<AdminUserResponse> responses = new ArrayList<>();
        for (User u : users) {
            UserProfile profile = userProfileRepository.findById(u.getId()).orElse(null);
            responses.add(AdminUserResponse.builder()
                    .id(u.getId())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .email(u.getEmail())
                    .phone(profile != null ? profile.getPhoneNumber() : "")
                    .region(profile != null ? profile.getRegion() : "")
                    .role(u.getSystemRole())
                    .status(Boolean.TRUE.equals(u.getIsLocked()) ? "Bị khóa" : "Hoạt động")
                    .build());
        }
        return responses;
    }

    @Transactional
    public String toggleLock(UUID userId, String currentUserEmail) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
            if (user.getEmail().equalsIgnoreCase(currentUserEmail)) {
                throw new RuntimeException("Bạn không thể tự khóa tài khoản của chính mình!");
            }
            
            user.setIsLocked(!Boolean.TRUE.equals(user.getIsLocked()));
            userRepository.save(user);
            
            String action = Boolean.TRUE.equals(user.getIsLocked()) ? "Khóa tài khoản" : "Mở khóa tài khoản";
            auditLogService.log(currentUserEmail, action, "Người dùng: " + user.getEmail(), "WARNING", true);
            
            return Boolean.TRUE.equals(user.getIsLocked()) ? "Khóa tài khoản thành công" : "Mở khóa tài khoản thành công";
        } catch (RuntimeException e) {
            auditLogService.log(currentUserEmail, "Khóa/Mở khóa tài khoản", "Thất bại: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @Transactional
    public void changeRole(UUID userId, String role) {
        try {
            String cleanRole = role.replace("\"", "").trim().toUpperCase();
            if (!cleanRole.equals("ADMIN") && !cleanRole.equals("USER")) {
                throw new RuntimeException("Vai trò không hợp lệ!");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
            user.setSystemRole(cleanRole);
            userRepository.save(user);
            
            auditLogService.log(null, "Cập nhật phân quyền", "Người dùng: " + user.getEmail() + " -> " + cleanRole, "SUCCESS", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Cập nhật phân quyền", "Thất bại: ID " + userId + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @Transactional
    public void createUser(CreateUserRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại!");
            }

            String role = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
            if (!role.equals("ADMIN") && !role.equals("USER")) {
                throw new RuntimeException("Vai trò không hợp lệ!");
            }

            User user = User.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .systemRole(role)
                    .isVerified(true)
                    .isLocked(false)
                    .build();

            User savedUser = userRepository.save(user);

            UserProfile profile = UserProfile.builder()
                    .user(savedUser)
                    .phoneNumber(request.getPhone())
                    .region(request.getRegion())
                    .build();
            userProfileRepository.save(profile);

            auditLogService.log(null, "Thêm người dùng mới", "Họ tên: " + request.getFirstName() + " " + request.getLastName() + " (" + request.getEmail() + ")", "INFO", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Thêm người dùng mới", "Thất bại: " + request.getEmail() + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @Transactional
    public void updateUser(UUID userId, UpdateUserRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại!");
            }

            String role = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
            if (!role.equals("ADMIN") && !role.equals("USER")) {
                throw new RuntimeException("Vai trò không hợp lệ!");
            }

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setSystemRole(role);

            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }

            userRepository.save(user);

            UserProfile profile = userProfileRepository.findById(userId).orElse(null);
            if (profile == null) {
                profile = UserProfile.builder()
                        .user(user)
                        .phoneNumber(request.getPhone())
                        .region(request.getRegion())
                        .build();
            } else {
                profile.setPhoneNumber(request.getPhone());
                profile.setRegion(request.getRegion());
            }
            userProfileRepository.save(profile);

            auditLogService.log(null, "Cập nhật thông tin người dùng", "Người dùng: " + request.getEmail(), "INFO", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Cập nhật thông tin người dùng", "Thất bại: " + request.getEmail() + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    public List<AdminHomeResponse> getAllHomes() {
        List<Home> homes = homeRepository.findAllByOrderByCreatedAtDesc();
        List<AdminHomeResponse> responses = new ArrayList<>();

        for (Home home : homes) {
            List<UserHome> userHomes = userHomeRepository.findByHomeId(home.getId());
            UserHome ownerLink = userHomes.stream()
                    .filter(uh -> "owner".equalsIgnoreCase(uh.getRole()))
                    .findFirst()
                    .orElse(userHomes.isEmpty() ? null : userHomes.get(0));

            String ownerName = "Hệ thống";
            String ownerEmail = "";
            String ownerPhone = "";
            String address = "Việt Nam";

            if (ownerLink != null && ownerLink.getUser() != null) {
                User owner = ownerLink.getUser();
                ownerName = owner.getFirstName() + " " + owner.getLastName();
                ownerEmail = owner.getEmail();
                
                UserProfile ownerProfile = userProfileRepository.findById(owner.getId()).orElse(null);
                if (ownerProfile != null) {
                    if (ownerProfile.getRegion() != null && !ownerProfile.getRegion().trim().isEmpty()) {
                        address = ownerProfile.getRegion();
                    }
                    if (ownerProfile.getPhoneNumber() != null) {
                        ownerPhone = ownerProfile.getPhoneNumber();
                    }
                }
            }

            long deviceCount = deviceRepository.countRealDevicesByHomeId(home.getId());
            boolean isLinked = !userHomes.isEmpty();

            List<Device> homeDevices = deviceRepository.findByHomeId(home.getId());
            String connStatus = "Chưa cấu hình";
            if (!homeDevices.isEmpty()) {
                boolean hasConnected = homeDevices.stream().anyMatch(d -> "CONNECTED".equalsIgnoreCase(d.getStatus()));
                boolean allDisconnected = homeDevices.stream().allMatch(d -> "DISCONNECTED".equalsIgnoreCase(d.getStatus()));
                if (hasConnected) {
                    connStatus = "Đã kết nối";
                } else if (allDisconnected) {
                    connStatus = "Mất kết nối";
                } else {
                    connStatus = "Chờ đồng bộ";
                }
            }

            responses.add(AdminHomeResponse.builder()
                    .id(home.getId())
                    .name(home.getName())
                    .address(address)
                    .owner(ownerName)
                    .ownerEmail(ownerEmail)
                    .ownerPhone(ownerPhone)
                    .linked(isLinked)
                    .devices(deviceCount)
                    .connectionStatus(connStatus)
                    .build());
        }

        return responses;
    }

    @Transactional
    public void deleteHome(UUID homeId) {
        try {
            Home home = homeRepository.findById(homeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy ngôi nhà"));

            List<Room> rooms = roomRepository.findByHomeId(homeId);
            for (Room room : rooms) {
                List<Device> devices = deviceRepository.findByRoomId(room.getId());
                deviceRepository.deleteAll(devices);
            }
            roomRepository.deleteAll(rooms);

            List<UserHome> userHomes = userHomeRepository.findByHomeId(homeId);
            userHomeRepository.deleteAll(userHomes);

            homeRepository.delete(home);
            auditLogService.log(null, "Xóa ngôi nhà", "Tên nhà: " + home.getName() + " (ID: " + homeId + ")", "DANGER", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Xóa ngôi nhà", "Thất bại: ID " + homeId + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    public AdminHomeDetailResponse getHomeDetail(UUID homeId) {
        Home home = homeRepository.findById(homeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngôi nhà"));

        List<UserHome> userHomes = userHomeRepository.findByHomeId(homeId);
        UserHome ownerLink = userHomes.stream()
                .filter(uh -> "owner".equalsIgnoreCase(uh.getRole()))
                .findFirst()
                .orElse(userHomes.isEmpty() ? null : userHomes.get(0));

        String ownerName = null;
        String ownerPhone = null;
        String ownerEmail = null;

        if (ownerLink != null && ownerLink.getUser() != null) {
            User owner = ownerLink.getUser();
            ownerName = owner.getFirstName() + " " + owner.getLastName();
            ownerEmail = owner.getEmail();
            UserProfile ownerProfile = userProfileRepository.findById(owner.getId()).orElse(null);
            if (ownerProfile != null && ownerProfile.getPhoneNumber() != null) {
                ownerPhone = ownerProfile.getPhoneNumber();
            }
        }

        List<Room> rooms = roomRepository.findByHomeId(homeId);
        List<AdminHomeDetailResponse.RoomDetail> roomDetails = new ArrayList<>();

        for (Room r : rooms) {
            List<Device> devices = deviceRepository.findByRoomId(r.getId());
            List<AdminHomeDetailResponse.DeviceDetail> deviceDetails = new ArrayList<>();
            for (Device device : devices) {
                deviceDetails.add(AdminHomeDetailResponse.DeviceDetail.builder()
                        .id(device.getId())
                        .name(device.getName())
                        .deviceType(device.getDeviceType())
                        .mqttTopic(device.getMqttTopic())
                        .status(device.getStatus())
                        .state(device.getState())
                        .label(device.getLabel())
                        .icon(device.getIcon())
                        .pos2dX(device.getPos2dX())
                        .pos2dY(device.getPos2dY())
                        .pos3dX(device.getPos3dX())
                        .pos3dY(device.getPos3dY())
                        .pos3dZ(device.getPos3dZ())
                        .isFake(device.getIsFake())
                        .createdAt(device.getCreatedAt())
                        .updatedAt(device.getUpdatedAt())
                        .build());
            }

            roomDetails.add(AdminHomeDetailResponse.RoomDetail.builder()
                    .id(r.getId())
                    .name(r.getName())
                    .createdAt(r.getCreatedAt())
                    .updatedAt(r.getUpdatedAt())
                    .devices(deviceDetails)
                    .build());
        }

        return AdminHomeDetailResponse.builder()
                .id(home.getId())
                .name(home.getName())
                .createdAt(home.getCreatedAt())
                .updatedAt(home.getUpdatedAt())
                .ownerName(ownerName)
                .ownerPhone(ownerPhone)
                .ownerEmail(ownerEmail)
                .rooms(roomDetails)
                .build();
    }
    public List<AdminUserResponse> getUnlinkedUsers() {
        List<User> users = userRepository.findUnlinkedUsers();
        List<AdminUserResponse> responses = new ArrayList<>();
        for (User u : users) {
            UserProfile profile = userProfileRepository.findById(u.getId()).orElse(null);
            responses.add(AdminUserResponse.builder()
                    .id(u.getId())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .email(u.getEmail())
                    .phone(profile != null ? profile.getPhoneNumber() : "")
                    .region(profile != null ? profile.getRegion() : "")
                    .role(u.getSystemRole())
                    .status(Boolean.TRUE.equals(u.getIsLocked()) ? "Bị khóa" : "Hoạt động")
                    .build());
        }
        return responses;
    }

    @Transactional
    public void linkOwner(UUID homeId, UUID userId) {
        try {
            Home home = homeRepository.findById(homeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy ngôi nhà"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Delete any existing linkages for this home to allow re-assignment/change owner
            List<UserHome> userHomes = userHomeRepository.findByHomeId(homeId);
            userHomeRepository.deleteAll(userHomes);

            // Link the new owner
            UserHome link = UserHome.builder()
                    .id(new UserHomeId(userId, homeId))
                    .user(user)
                    .home(home)
                    .role("owner")
                    .build();
            userHomeRepository.save(link);
            auditLogService.log(null, "Liên kết chủ sở hữu", "Ngôi nhà: " + home.getName() + " -> Chủ sở hữu: " + user.getEmail(), "SUCCESS", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Liên kết chủ sở hữu", "Thất bại: Home ID " + homeId + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @Transactional
    public void updateDevice(UUID deviceId, UpdateDeviceRequest request) {
        try {
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị"));

            if (request.getLabel() != null) {
                device.setLabel(request.getLabel());
            }
            if (request.getIsFake() != null) {
                device.setIsFake(request.getIsFake());
            }

            deviceRepository.save(device);
            auditLogService.log(null, "Cập nhật thiết bị", "Thiết bị: " + device.getLabel() + " (isFake: " + request.getIsFake() + ")", "INFO", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Cập nhật thiết bị", "Thất bại: ID " + deviceId + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @Transactional
    public void createHome(CreateHomeRequest request) {
        try {
            Home home = Home.builder()
                    .name(request.getName())
                    .build();
            homeRepository.save(home);

            createSeededRoomsAndDevices(home);
            auditLogService.log(null, "Tạo ngôi nhà mới", "Tên nhà: " + request.getName(), "SUCCESS", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Tạo ngôi nhà mới", "Thất bại: " + request.getName() + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    private void createSeededRoomsAndDevices(Home home) {
        String[] roomNames = {
            "Cửa chính", "Phòng Khách", "Bếp", "Hành Lang", 
            "Phòng Ngủ 1", "Phòng Ngủ 2", "Phòng Ngủ 3", 
            "Ban Công 1", "Ban Công 2", "WC 1", "WC 2", "WC 3", "Toàn hệ thống"
        };
        
        List<Room> rooms = new ArrayList<>();
        for (String roomName : roomNames) {
            Room r = Room.builder()
                    .name(roomName)
                    .home(home)
                    .build();
            roomRepository.save(r);
            rooms.add(r);
        }
        
        Device cameraS3 = null;
        Device cameraAi = null;
        
        // Seeding Devices
        // 1. Cửa chính
        cameraS3 = addDeviceHelper(rooms.get(0), "entrance_camera_s3", "security", "home/tsmarthome/entrance/camera/entrance_camera_s3", "Phát hiện", true, "Camera ESP32-S3", "Camera", 26.81, 69.49, false, -4.67, 2.2, 2.84);
        addDeviceHelper(rooms.get(0), "entrance_sensor_pir", "security", "home/tsmarthome/entrance/motion/entrance_sensor_pir", "Cảnh báo", true, "PIR Cửa chính", "Activity", 22.11, 74.91, false, -4.67, 2.2, 3.84);
        addDeviceHelper(rooms.get(0), "entrance_door_smartlock", "security", "home/tsmarthome/entrance/smartlock/entrance_door_smartlock", "Tắt", null, "Cửa chính & Smart Lock", "DoorClosed", 29.29, 74.86, true, -4.67, 1.2, 2.84);

        // 2. Phòng Khách
        addDeviceHelper(rooms.get(1), "livingroom_light_front", "appliance", "home/tsmarthome/livingroom/light/livingroom_light_front", "Tắt", true, "Đèn trần trước", "Lightbulb", 25.04, 75.16, false, -5.67, 1.2, 2.84);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_pir", "security", "home/tsmarthome/livingroom/motion/livingroom_sensor_pir", "Cảnh báo", true, "PIR Khách/Bếp", "Activity", 49.84, 75.88, false, -0.15, 1.2, 3.18);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_audio", "environment", "home/tsmarthome/livingroom/sound/livingroom_sensor_audio", "Yên tĩnh", true, "Cảm biến Âm thanh & Mic", "Mic", 33.67, 67.66, false, 0.06, 1.2, 4.79);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_dht22", "environment", "home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22", "Bình thường", null, "DHT22 (Nhiệt/Ẩm)", "Thermometer", 50.52, 46.05, false, 0.03, 1.2, -0.06);
        addDeviceHelper(rooms.get(1), "livingroom_light_back", "appliance", "home/tsmarthome/livingroom/light/livingroom_light_back", "Tắt", true, "Đèn trần sau", "Lightbulb", 34.11, 73.7, false, -3.67, 1.2, 2.84);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_radar3", "radar", "home/tsmarthome/livingroom/radar/livingroom_sensor_radar3", "Cảnh báo", true, "Radar 3", "Radar", null, null, false, null, null, null);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_radar2", "radar", "home/tsmarthome/livingroom/radar/livingroom_sensor_radar2", "Cảnh báo", true, "Radar Hàng 2", "Radar", 0.0, 0.0, false, null, null, null);
        addDeviceHelper(rooms.get(1), "livingroom_light_ceiling", "appliance", "home/tsmarthome/livingroom/light/livingroom_light_ceiling", "Tắt", true, "Đèn trần P.Khách", "Lightbulb", 42.08, 75.39, false, -1.79, 1.2, 3.19);
        addDeviceHelper(rooms.get(1), "livingroom_light_dining", "appliance", "home/tsmarthome/livingroom/light/livingroom_light_dining", "Tắt", true, "Đèn phòng ăn", "Lightbulb", 57.78, 74.92, false, 1.77, 1.2, 3.08);
        addDeviceHelper(rooms.get(1), "livingroom_sensor_radar", "radar", "home/tsmarthome/livingroom/radar/livingroom_sensor_radar", "Cảnh báo", true, null, null, null, null, false, null, null, null);

        // 3. Bếp
        addDeviceHelper(rooms.get(2), "kitchen_sensor_flame", "safety", "home/tsmarthome/kitchen/flame/kitchen_sensor_flame", "An toàn", true, "Cảm biến Lửa", "Flame", 61.8, 62.02, false, 1.69, 1.2, 1.53);
        addDeviceHelper(rooms.get(2), "kitchen_sensor_mq135", "environment", "home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135", "Nguy hiểm", true, "Khí MQ-135", "Wind", 54.34, 61.87, false, -0.77, 1.2, 1.14);
        addDeviceHelper(rooms.get(2), "kitchen_light_main", "appliance", "home/tsmarthome/kitchen/light/kitchen_light_main", "Tắt", true, "Đèn bếp", "Lightbulb", 58.44, 54.42, false, 1.86, 1.2, 0.13);

        // 4. Hành Lang
        addDeviceHelper(rooms.get(3), "hallway_sensor_pir", "security", "home/tsmarthome/hallway/motion/hallway_sensor_pir", "Bật", true, "PIR Hành lang", "Activity", 48.02, 35.03, true, 0.14, 1.2, -2.28);
        addDeviceHelper(rooms.get(3), "hallway_sensor_radar", "radar", "home/tsmarthome/hallway/radar/hallway_sensor_radar", "Cảnh báo", true, "radar hành lang", null, null, null, false, null, null, null);
        addDeviceHelper(rooms.get(3), "hallway_light_main", "appliance", "home/tsmarthome/hallway/light/hallway_light_main", "Tắt", true, "Đèn hành lang", "Lightbulb", 47.45, 50.66, false, 0.06, 1.2, -1.45);

        // 5. Phòng Ngủ 1
        addDeviceHelper(rooms.get(4), "bedroom1_window_main", "security", "home/tsmarthome/bedroom1/window/bedroom1_window_main", "Tắt", true, "Cửa sổ PN1", "AppWindow", 32.47, 34.25, true, -3.89, 1.2, -1.94);
        addDeviceHelper(rooms.get(4), "bedroom1_light_main", "appliance", "home/tsmarthome/bedroom1/light/bedroom1_light_main", "Tắt", true, "Đèn PN1", "Lightbulb", 36.34, 46.68, true, -2.81, 1.2, -0.42);
        addDeviceHelper(rooms.get(4), "bedroom1_sensor_flame", "safety", "home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame", "Tắt", true, "Lửa PN1", "Flame", 43.6, 44.65, true, -3.28, 1.2, 1.02);

        // 6. Phòng Ngủ 2
        addDeviceHelper(rooms.get(5), "bedroom2_window_main", "security", "home/tsmarthome/bedroom2/window/bedroom2_window_main", "Tắt", true, "Cửa sổ PN2", "AppWindow", 42.23, 4.93, true, -1.7, 1.2, -5.52);
        addDeviceHelper(rooms.get(5), "bedroom2_sensor_flame", "safety", "home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame", "Tắt", true, "Lửa PN2", "Flame", 48.43, 30.49, true, -2.96, 1.2, -3.06);
        addDeviceHelper(rooms.get(5), "bedroom2_light_main", "appliance", "home/tsmarthome/bedroom2/light/bedroom2_light_main", "Bật", true, "Đèn PN2", "Lightbulb", 42.5, 17.98, true, -1.85, 1.2, -4.11);

        // 7. Phòng Ngủ 3
        addDeviceHelper(rooms.get(6), "bedroom3_window_main", "appliance", "home/tsmarthome/bedroom3/window/bedroom3_window_main", "Tắt", null, "Cửa sổ PN3", "AppWindow", 71.04, 19.17, true, 4.65, 1.2, -3.58);
        addDeviceHelper(rooms.get(6), "bedroom3_light_main", "appliance", "home/tsmarthome/bedroom3/light/bedroom3_light_main", "Tắt", true, "Đèn PN3", "Lightbulb", 63.83, 18.19, true, 3.06, 1.2, -4.0);
        addDeviceHelper(rooms.get(6), "bedroom3_sensor_flame", "safety", "home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame", "Bật", true, "Lửa PN3", "Flame", 57.78, 22.49, true, 1.84, 1.2, -3.96);

        // 8. Ban Công 1
        addDeviceHelper(rooms.get(7), "balcony1_door_main", "appliance", "home/tsmarthome/balcony1/door/balcony1_door_main", "Tắt", null, "Cửa Ban công 1", "DoorClosed", 65.93, 71.7, true, 3.56, 1.2, 2.9);
        addDeviceHelper(rooms.get(7), "balcony1_curtain_main", "appliance", "home/tsmarthome/balcony1/curtain/balcony1_curtain_main", "Tắt", true, "Rèm Ban công 1", "Blinds", 65.93, 80.59, false, 3.56, 1.2, 3.64);
        addDeviceHelper(rooms.get(7), "balcony1_light_main", "appliance", "home/tsmarthome/balcony1/light/balcony1_light_main", "Tắt", true, "Đèn Ban công 1", "Lightbulb", 70.65, 74.27, false, 4.61, 1.2, 3.44);

        // 9. Ban Công 2
        addDeviceHelper(rooms.get(8), "balcony2_door_main", "appliance", "home/tsmarthome/balcony2/door/balcony2_door_main", "Tắt", null, "Cửa Ban công 2", "DoorClosed", 73.26, 46.39, true, 4.54, 1.2, -0.4);
        addDeviceHelper(rooms.get(8), "balcony2_light_main", "appliance", "home/tsmarthome/balcony2/light/balcony2_light_main", "Bật", true, "Đèn Ban công 2", "Lightbulb", 70.41, 37.59, true, 4.21, 1.2, -0.96);

        // 10. WC 1
        addDeviceHelper(rooms.get(9), "wc1_light_main", "appliance", "home/tsmarthome/wc1/light/wc1_light_main", "Tắt", true, "Đèn WC 1", "Lightbulb", 70.93, 56.14, true, 4.74, 1.2, 0.41);

        // 11. WC 2
        addDeviceHelper(rooms.get(10), "wc2_light_main", "appliance", "home/tsmarthome/wc2/light/wc2_light_main", "Tắt", true, "Đèn WC 2", "Lightbulb", 57.21, 38.64, true, 2.13, 1.2, -1.6);

        // 12. WC 3
        addDeviceHelper(rooms.get(11), "wc3_light_main", "appliance", "home/tsmarthome/wc3/light/wc3_light_main", "Bật", true, "Đèn WC 3", "Lightbulb", 54.03, 16.42, true, 0.64, 1.2, -4.46);

        // 13. Toàn hệ thống
        addDeviceHelper(rooms.get(12), "global_safety_buzzer", "safety", "home/tsmarthome/global/buzzer/global_safety_buzzer", "Tắt", true, "Còi Buzzer", "Bell", 35.64, 81.42, true, -3.13, 1.2, 3.92);
        addDeviceHelper(rooms.get(12), "global_environment_light", "environment", "home/tsmarthome/global/light_sensor/global_environment_light", "Tối", true, "Cảm biến Ánh sáng", "Sun", 55.37, 89.82, true, 1.16, 1.2, 4.79);
        addDeviceHelper(rooms.get(12), "global_appliance_tv", "appliance", "home/tsmarthome/global/tv/global_appliance_tv", "Tắt", true, "Cảm biến TV", "Tv", 39.66, 88.92, true, -1.7, 1.2, 4.74);
        cameraAi = addDeviceHelper(rooms.get(12), "global_camera_ai", "security", "home/tsmarthome/global/camera/global_camera_ai", "Bật", true, "Camera AI Toàn Cảnh", "Camera", 65.25, 89.4, false, 3.32, 2.2, 4.75);

        // Seeding Camera Streams
        if (cameraS3 != null) {
            cameraStreamRepository.save(CameraStream.builder()
                    .device(cameraS3)
                    .streamUrl("/camera-s3/stream")
                    .build());
        }
        if (cameraAi != null) {
            cameraStreamRepository.save(CameraStream.builder()
                    .device(cameraAi)
                    .streamUrl("/camera-thinker/stream")
                    .build());
        }
    }

    private Device addDeviceHelper(Room room, String name, String deviceType, String mqttTopic, String status,
                                   Boolean state, String label, String icon, Double pos2dX, Double pos2dY,
                                   Boolean isFake, Double pos3dX, Double pos3dY, Double pos3dZ) {
        Device device = Device.builder()
                .room(room)
                .name(name)
                .deviceType(deviceType)
                .mqttTopic(mqttTopic)
                .status(status)
                .state(state)
                .label(label)
                .icon(icon)
                .pos2dX(pos2dX)
                .pos2dY(pos2dY)
                .isFake(isFake)
                .pos3dX(pos3dX)
                .pos3dY(pos3dY)
                .pos3dZ(pos3dZ)
                .build();
        return deviceRepository.save(device);
    }

    public GenerateFirmwareResponse generateFirmware(GenerateFirmwareRequest request) {
        try {
            String homeIdStr = request.getHomeId().toString();
            String node = request.getNode() != null ? request.getNode() : "node1";
            String ssid = request.getWifiSsid() != null ? request.getWifiSsid() : "Thu Ha";
            String pass = request.getWifiPassword() != null ? request.getWifiPassword() : "11081980";
            String broker = request.getMqttBroker() != null ? request.getMqttBroker() : "broker.emqx.io";
            int port = request.getMqttPort() != null ? request.getMqttPort() : 1883;
            String clientId = request.getMqttClientId() != null ? request.getMqttClientId() : "ESP32_TSmartHome_" + ("node1".equals(node) ? "Node1" : "Node2");

            String configContent = "#ifndef CONFIG_H\n" +
                    "#define CONFIG_H\n\n" +
                    "#include <Arduino.h>\n\n" +
                    "static const char* WIFI_SSID      = \"" + ssid + "\";\n" +
                    "static const char* WIFI_PASSWORD  = \"" + pass + "\";\n" +
                    "static const char* MQTT_BROKER    = \"" + broker + "\";\n" +
                    "static const int   MQTT_PORT      = " + port + ";\n" +
                    "static const char* MQTT_CLIENT_ID = \"" + clientId + "\";\n\n" +
                    "// --- PIN MAPPING ---\n" +
                    ("node1".equals(node) ?
                    "// Node 1 (Cảm biến & Rèm cửa)\n" +
                    "#define PIN_DHT           4\n" +
                    "#define PIN_MQ135         34  // ADC1\n" +
                    "#define PIN_MIC           35  // ADC1\n" +
                    "#define PIN_VOICE_DIG     14\n\n" +
                    "#define PIN_PIR_DOOR      32\n" +
                    "#define PIN_PIR_LIVING    33\n" +
                    "#define PIN_FLAME_KITCHEN 13\n" +
                    "#define PIN_RELAY         22\n\n" +
                    "// --- RADAR 1 (Phòng Khách) ---\n" +
                    "#define PIN_SERVO_1       5\n" +
                    "#define PIN_TRIG_1        25\n" +
                    "#define PIN_ECHO_1        26\n\n" +
                    "// --- RADAR 2 (Hành Lang) ---\n" +
                    "#define PIN_TRIG_2        19\n" +
                    "#define PIN_ECHO_2        21\n" :
                    "// Node 2 (Điều khiển 6 kênh Đèn & Radar phụ)\n" +
                    "#define PIN_RELAY_FRONT_LIGHT   13\n" +
                    "#define PIN_RELAY_BACK_LIGHT    14\n" +
                    "#define PIN_RELAY_CEILING_LIGHT 25\n" +
                    "#define PIN_RELAY_DINING_LIGHT  26\n" +
                    "#define PIN_RELAY_BALCONY_LIGHT 27\n" +
                    "#define PIN_RELAY_HALLWAY_LIGHT 33\n\n" +
                    "// --- 2 RADAR TĨNH (HC-SR04) ---\n" +
                    "#define PIN_TRIG_RADAR2         19\n" +
                    "#define PIN_ECHO_RADAR2         21\n" +
                    "#define PIN_TRIG_RADAR3         22\n" +
                    "#define PIN_ECHO_RADAR3         23\n") + "\n" +
                    "// --- TOPICS CONFIG ---\n" +
                    "const char* TOPIC_CMD_WILDCARD = \"" + homeIdStr + "/home/tsmarthome/+/+/+/command\";\n" +
                    "const char* TOPIC_PREFIX       = \"" + homeIdStr + "/home/tsmarthome/\";\n\n" +
                    "#endif";

            String mainContent = "node1".equals(node) ?
                    "// Entry point: hw1 main.cpp\n" +
                    "#include <Arduino.h>\n" +
                    "#include <WiFi.h>\n" +
                    "#include <PubSubClient.h>\n" +
                    "#include <ArduinoJson.h>\n" +
                    "#include <DHT.h>\n" +
                    "#include <ESP32Servo.h>\n" +
                    "#include \"time.h\"\n" +
                    "#include \"config.h\"\n\n" +
                    "WiFiClient espClient;\n" +
                    "PubSubClient mqttClient(espClient);\n" +
                    "DHT dht(PIN_DHT, DHT22);\n" +
                    "Servo curtainServo;\n\n" +
                    "// --- Thread intervals and setup logic ---\n" +
                    "void setup() {\n" +
                    "  Serial.begin(115200);\n" +
                    "  dht.begin();\n" +
                    "  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);\n" +
                    "  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);\n" +
                    "  Serial.println(\"ESP32 Node 1 initialized successfully.\");\n" +
                    "}\n\n" +
                    "void loop() {\n" +
                    "  mqttClient.loop();\n" +
                    "  // Non-blocking reads of sensors & servo\n" +
                    "}" :
                    "// Entry point: hw2 main.cpp\n" +
                    "#include <Arduino.h>\n" +
                    "#include <WiFi.h>\n" +
                    "#include <PubSubClient.h>\n" +
                    "#include <ArduinoJson.h>\n" +
                    "#include \"time.h\"\n" +
                    "#include \"config.h\"\n\n" +
                    "WiFiClient espClient;\n" +
                    "PubSubClient mqttClient(espClient);\n\n" +
                    "void setup() {\n" +
                    "  Serial.begin(115200);\n" +
                    "  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);\n" +
                    "  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);\n" +
                    "  Serial.println(\"ESP32 Node 2 initialized successfully.\");\n" +
                    "}\n\n" +
                    "void loop() {\n" +
                    "  mqttClient.loop();\n" +
                    "}";

            GenerateFirmwareResponse res = GenerateFirmwareResponse.builder()
                    .configContent(configContent)
                    .mainContent(mainContent)
                    .build();

            auditLogService.log(null, "Tạo cấu hình mã nguồn", "Home ID: " + request.getHomeId() + " (" + node + ")", "SUCCESS", true);
            return res;
        } catch (RuntimeException e) {
            auditLogService.log(null, "Tạo cấu hình mã nguồn", "Thất bại: Home ID " + request.getHomeId() + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    @jakarta.annotation.PostConstruct
    public void resetRealDeviceStatusesOnStartup() {
        try {
            List<Device> devices = deviceRepository.findAll();
            for (Device d : devices) {
                if (d != null && !Boolean.TRUE.equals(d.getIsFake())) {
                    d.setStatus(null);
                    deviceRepository.save(d);
                }
            }
        } catch (Exception e) {
            // Ignore
        }
    }

    public List<AdminHomeDetailResponse.DeviceDetail> getHomeDevices(UUID homeId) {
        List<Device> devices = deviceRepository.findByHomeId(homeId);
        List<AdminHomeDetailResponse.DeviceDetail> responses = new ArrayList<>();
        for (Device device : devices) {
            if (Boolean.TRUE.equals(device.getIsFake())) {
                // Skip fake devices, only show real IoT devices
                continue;
            }
            responses.add(AdminHomeDetailResponse.DeviceDetail.builder()
                    .id(device.getId())
                    .name(device.getName())
                    .deviceType(device.getDeviceType())
                    .status(device.getStatus())
                    .state(device.getState())
                    .label(device.getLabel())
                    .icon(device.getIcon())
                    .pos2dX(device.getPos2dX())
                    .pos2dY(device.getPos2dY())
                    .pos3dX(device.getPos3dX())
                    .pos3dY(device.getPos3dY())
                    .pos3dZ(device.getPos3dZ())
                    .mqttTopic(device.getMqttTopic())
                    .isFake(device.getIsFake())
                    .createdAt(device.getCreatedAt())
                    .updatedAt(device.getUpdatedAt())
                    .build());
        }
        return responses;
    }

    public boolean pingDevice(UUID deviceId) {
        try {
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị"));

            // Environmental sensors do not support toggle state command
            if ("temperature".equals(device.getDeviceType()) || "air_quality".equals(device.getDeviceType())) {
                if (Boolean.TRUE.equals(device.getIsFake())) {
                    device.setStatus("CONNECTED");
                    deviceRepository.save(device);
                    auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Cảm biến (ảo): " + device.getLabel() + " -> Online", "SUCCESS", true);
                    return true;
                } else {
                    boolean active = "CONNECTED".equalsIgnoreCase(device.getStatus());
                    auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Cảm biến (thật): " + device.getLabel() + " -> " + (active ? "Online" : "Mất kết nối"), active ? "SUCCESS" : "WARNING", active);
                    return active;
                }
            }

            UUID homeId = (device.getRoom() != null && device.getRoom().getHome() != null)
                    ? device.getRoom().getHome().getId()
                    : null;
            if (homeId == null) {
                auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Thất bại: Thiết bị " + device.getLabel() + " chưa được liên kết nhà", "DANGER", false);
                return false;
            }

            boolean currentState = Boolean.TRUE.equals(device.getState());

            // Change status to PINGING before publishing to enforce a dirty update when MQTT receiver thread updates it back to CONNECTED!
            device.setStatus("PINGING");
            deviceRepository.saveAndFlush(device);

            // Step 1: Send command to the device with the SAME current state (Keep-state ping test)
            String commandTopic = homeId.toString() + "/" + device.getMqttTopic() + "/command";
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("deviceId", device.getName());
            payload.put("state", currentState);

            try {
                mqttService.publishCommand(commandTopic, payload);
            } catch (Exception e) {
                // Ignore MQTT publish errors
            }

            // Step 2: Poll database for status change to CONNECTED (up to 5 seconds, checking every 250ms)
            boolean hasResponded = false;
            Device reloadedDevice = null;
            for (int i = 0; i < 20; i++) {
                try {
                    Thread.sleep(250);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
                if (entityManager != null) {
                    entityManager.clear(); // Clear Hibernate L1 cache to reload from DB
                }
                reloadedDevice = deviceRepository.findById(deviceId).orElse(device);
                if ("CONNECTED".equalsIgnoreCase(reloadedDevice.getStatus())) {
                    hasResponded = true;
                    break;
                }
            }

            if (reloadedDevice == null) {
                reloadedDevice = device;
            }

            boolean isFake = Boolean.TRUE.equals(reloadedDevice.getIsFake());

            if (isFake) {
                // Simulate success for fake devices
                reloadedDevice.setStatus("CONNECTED");
                deviceRepository.save(reloadedDevice);
                auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Thiết bị (ảo): " + reloadedDevice.getLabel() + " -> Online", "SUCCESS", true);
                return true;
            } else {
                // Real device: check if database status transitioned back to CONNECTED
                if (hasResponded) {
                    auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Thiết bị (thật): " + reloadedDevice.getLabel() + " -> Online", "SUCCESS", true);
                    return true;
                } else {
                    // Failed: no response from real IoT device
                    reloadedDevice.setStatus("DISCONNECTED");
                    deviceRepository.save(reloadedDevice);
                    auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Thiết bị (thật): " + reloadedDevice.getLabel() + " -> Mất kết nối", "WARNING", false);
                    return false;
                }
            }
        } catch (RuntimeException e) {
            auditLogService.log(null, "Kiểm tra kết nối thiết bị", "Thất bại: ID " + deviceId + " - Lỗi: " + e.getMessage(), "DANGER", false);
            throw e;
        }
    }

    public List<AdminHomeDetailResponse.DeviceDetail> pingAllDevices(UUID homeId) {
        try {
            List<Device> devices = deviceRepository.findByHomeId(homeId);
            for (Device device : devices) {
                try {
                    pingDevice(device.getId());
                } catch (Exception e) {
                    // Ignore errors to ping other devices
                }
            }
            auditLogService.log(null, "Test kết nối toàn bộ", "Nhà ID: " + homeId, "INFO", true);
        } catch (RuntimeException e) {
            auditLogService.log(null, "Test kết nối toàn bộ", "Thất bại: Nhà ID " + homeId + " - Lỗi: " + e.getMessage(), "DANGER", false);
        }
        return getHomeDevices(homeId);
    }
}

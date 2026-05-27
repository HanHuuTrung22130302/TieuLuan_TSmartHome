export const DEVICE_DICTIONARY = {
  // ===== Entrance =====
  entrance_door_smartlock: {
    name: "Cửa chính & Smart Lock",
    type: "door",
    category: "security",
    icon: "DoorClosed",
  },
  entrance_sensor_pir: {
    name: "PIR Cửa chính",
    type: "pir",
    category: "security",
    icon: "Activity",
  },
  entrance_camera_s3: {
    name: "Camera ESP32-S3",
    type: "camera",
    category: "security",
    icon: "Camera",
  },

  // ===== Living room =====
  livingroom_sensor_pir: {
    name: "PIR Khách/Bếp",
    type: "pir",
    category: "security",
    icon: "Activity",
  },
  livingroom_sensor_dht22: {
    name: "DHT22 (Nhiệt/Ẩm)",
    type: "temp",
    category: "environment",
    icon: "Thermometer",
  },
  livingroom_sensor_audio: {
    name: "Cảm biến Âm thanh & Mic",
    type: "audio",
    category: "environment",
    icon: "Mic",
  },

  // Radar cũ
  livingroom_sensor_radar: {
    name: "Radar P.Khách",
    type: "radar",
    category: "radar",
    icon: "Radar",
  },

  // Radar mới
  livingroom_sensor_radar2: {
    name: "Radar Hàng 2",
    type: "radar",
    category: "radar",
    icon: "Radar",
  },
  livingroom_sensor_radar3: {
    name: "Radar Hàng 3",
    type: "radar",
    category: "radar",
    icon: "Radar",
  },

  livingroom_light_front: {
    name: "Đèn trần trước",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },
  livingroom_light_back: {
    name: "Đèn trần sau",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },
  livingroom_light_ceiling: {
    name: "Đèn trần P.Khách",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },
  livingroom_light_dining: {
    name: "Đèn phòng ăn",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Kitchen =====
  kitchen_sensor_flame: {
    name: "Cảm biến Lửa",
    type: "flame",
    category: "safety",
    icon: "Flame",
  },
  kitchen_sensor_mq135: {
    name: "Khí MQ-135",
    type: "gas",
    category: "environment",
    icon: "Wind",
  },
  kitchen_light_main: {
    name: "Đèn bếp",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Hallway =====
  hallway_sensor_pir: {
    name: "PIR Hành lang",
    type: "pir",
    category: "security",
    icon: "Activity",
  },
  hallway_sensor_radar: {
    name: "Radar hành lang",
    type: "radar",
    category: "radar",
    icon: "Radar",
  },
  hallway_light_main: {
    name: "Đèn hành lang",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Bedroom 1 =====
  bedroom1_sensor_flame: {
    name: "Lửa PN1",
    type: "flame",
    category: "safety",
    icon: "Flame",
  },
  bedroom1_window_main: {
    name: "Cửa sổ PN1",
    type: "window",
    category: "security",
    icon: "AppWindow",
  },
  bedroom1_light_main: {
    name: "Đèn PN1",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Bedroom 2 =====
  bedroom2_sensor_flame: {
    name: "Lửa PN2",
    type: "flame",
    category: "safety",
    icon: "Flame",
  },
  bedroom2_window_main: {
    name: "Cửa sổ PN2",
    type: "window",
    category: "security",
    icon: "AppWindow",
  },
  bedroom2_light_main: {
    name: "Đèn PN2",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Bedroom 3 =====
  bedroom3_sensor_flame: {
    name: "Lửa PN3",
    type: "flame",
    category: "safety",
    icon: "Flame",
  },
  bedroom3_window_main: {
    name: "Cửa sổ PN3",
    type: "window",
    category: "security",
    icon: "AppWindow",
  },
  bedroom3_light_main: {
    name: "Đèn PN3",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Balcony 1 =====
  balcony1_door_main: {
    name: "Cửa Ban công 1",
    type: "door",
    category: "security",
    icon: "DoorClosed",
  },
  balcony1_curtain_main: {
    name: "Rèm Ban công 1",
    type: "curtain",
    category: "appliance",
    icon: "Blinds",
  },
  balcony1_light_main: {
    name: "Đèn Ban công 1",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Balcony 2 =====
  balcony2_door_main: {
    name: "Cửa Ban công 2",
    type: "door",
    category: "security",
    icon: "DoorClosed",
  },
  balcony2_light_main: {
    name: "Đèn Ban công 2",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== WC =====
  wc1_light_main: {
    name: "Đèn WC 1",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },
  wc2_light_main: {
    name: "Đèn WC 2",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },
  wc3_light_main: {
    name: "Đèn WC 3",
    type: "light",
    category: "appliance",
    icon: "Lightbulb",
  },

  // ===== Global =====
  global_appliance_tv: {
    name: "Cảm biến TV",
    type: "tv",
    category: "appliance",
    icon: "Tv",
  },
  global_safety_buzzer: {
    name: "Còi Buzzer",
    type: "buzzer",
    category: "safety",
    icon: "Bell",
  },
  global_environment_light: {
    name: "Cảm biến Ánh sáng",
    type: "light_sensor",
    category: "environment",
    icon: "Sun",
  },
  global_camera_ai: {
    name: "Camera AI Toàn Cảnh",
    type: "camera",
    category: "security",
    icon: "Camera",
  },
};

export const getDeviceInfo = (deviceId) => {
  return (
    DEVICE_DICTIONARY[deviceId] || {
      name: deviceId || "Thiết bị không xác định",
      type: "unknown",
      category: "unknown",
      icon: "CircleHelp",
    }
  );
};

export const getDeviceName = (deviceId) => {
  return getDeviceInfo(deviceId).name;
};

export const getDeviceType = (deviceId) => {
  return getDeviceInfo(deviceId).type;
};

export const getDeviceCategory = (deviceId) => {
  return getDeviceInfo(deviceId).category;
};

export const getDeviceIcon = (deviceId) => {
  return getDeviceInfo(deviceId).icon;
};
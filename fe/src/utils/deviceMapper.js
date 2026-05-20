export const getDeviceInfo = (deviceId) => {
  const dictionary = {
    "kitchen_sensor_flame": { name: "Cảm biến Lửa Bếp", type: "flame" },
    "livingroom_sensor_audio": { name: "Âm thanh P.Khách", type: "audio" },
    "entrance_sensor_pir": { name: "PIR Cửa chính", type: "pir" },
    "livingroom_sensor_dht22": { name: "Nhiệt/Ẩm P.Khách", type: "temp" },
    "kitchen_sensor_mq135": { name: "Khí MQ-135 Bếp", type: "gas" },
    "hallway_sensor_radar": { name: "Radar Hành lang", type: "radar" },
    "livingroom_sensor_radar": { name: "Radar P.Khách", type: "radar" },
    "global_camera_ai": { name: "Camera AI", type: "security" },
    "entrance_camera_s3": { name: "Camera Cửa chính", type: "security" }
  };

  return dictionary[deviceId] || { name: deviceId, type: "unknown" };
};
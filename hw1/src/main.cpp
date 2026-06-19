#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include "time.h"
#include "config.h"

WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(PIN_DHT, DHT22);

// Servo cho Rèm Ban Công
Servo curtainServo;

// --- Tracking Thời gian & Trạng thái ---
unsigned long lastAudioRead = 0;
unsigned long lastAirTempRead = 0;
unsigned long lastRadarMove = 0;

unsigned long audioCheckInterval = 300000; 
unsigned long airCheckInterval = 300000;   

// --- Biến Quản lý Rèm cửa (Chạy chậm) ---
int currentCurtainAngle = 0; // Góc thực tế hiện tại của Servo
int targetCurtainAngle = 0;  // Góc mục tiêu muốn quay tới
unsigned long lastCurtainMoveTime = 0;
const int CURTAIN_SPEED_MS = 45; // 45ms/độ -> Quay 180 độ mất ~8.1 giây

// ==========================================
// CỜ BẬT/TẮT MODULE
// ==========================================
bool enablePirDoor   = true;  
bool enablePirLiving = true;  
bool enableMic       = true;  
bool enableRadar1    = true;  
bool enableRadar2    = true;  

// ==========================================
// BIẾN NGẮT
// ==========================================
volatile bool motionDoor = false;
volatile bool motionLiving = false;
volatile bool suddenNoise = false;

void IRAM_ATTR isrDoor() { if(enablePirDoor) motionDoor = true; }
void IRAM_ATTR isrLiving() { if(enablePirLiving) motionLiving = true; }
void IRAM_ATTR isrVoice() { if(enableMic) suddenNoise = true; }

// --- Khai báo hàm ---
void setupWiFi();
void syncTime();
void reconnectMQTT();
void publishJson(const char* topic, JsonDocument& doc);
void processRealSensors();
void processDualRadar();
void processCurtain(); // Khai báo hàm xử lý rèm
float getDistance(int trigPin, int echoPin);
void mqttCallback(char* topic, byte* payload, unsigned int length);

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_RELAY, OUTPUT); digitalWrite(PIN_RELAY, LOW); 
  pinMode(PIN_MIC, INPUT); 
  pinMode(PIN_FLAME_KITCHEN, INPUT);
  
  pinMode(PIN_PIR_DOOR, INPUT_PULLDOWN); attachInterrupt(digitalPinToInterrupt(PIN_PIR_DOOR), isrDoor, RISING);
  pinMode(PIN_PIR_LIVING, INPUT_PULLDOWN); attachInterrupt(digitalPinToInterrupt(PIN_PIR_LIVING), isrLiving, RISING);
  pinMode(PIN_VOICE_DIG, INPUT_PULLUP); attachInterrupt(digitalPinToInterrupt(PIN_VOICE_DIG), isrVoice, FALLING); 

  pinMode(PIN_TRIG_1, OUTPUT); pinMode(PIN_ECHO_1, INPUT);
  pinMode(PIN_TRIG_2, OUTPUT); pinMode(PIN_ECHO_2, INPUT);
  
  // Khởi tạo Rèm Ban Công 1
  ESP32PWM::allocateTimer(0);
  curtainServo.setPeriodHertz(50);
  curtainServo.attach(PIN_SERVO_1, 500, 2400); 
  curtainServo.write(currentCurtainAngle); // Cố định ở 0 độ lúc khởi động
  
  dht.begin();
  setupWiFi();
  syncTime();
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setBufferSize(1024);
  mqttClient.setCallback(mqttCallback);
}

void loop() {
  if (!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();

  processRealSensors();
  processDualRadar();
  processCurtain(); // Gọi hàm mô phỏng rèm cuốn chậm
}

// ================= XỬ LÝ RÈM CỬA CHẬM (NON-BLOCKING) =================
void processCurtain() {
  // Nếu góc hiện tại chưa bằng góc mục tiêu thì cho nhích từng độ một
  if (currentCurtainAngle != targetCurtainAngle) {
    if (millis() - lastCurtainMoveTime >= CURTAIN_SPEED_MS) {
      lastCurtainMoveTime = millis();
      
      if (currentCurtainAngle < targetCurtainAngle) {
        currentCurtainAngle++; // Đang mở rèm từ từ
      } else {
        currentCurtainAngle--; // Đang đóng rèm từ từ
      }
      
      curtainServo.write(currentCurtainAngle);
    }
  }
}

// ================= XỬ LÝ RADAR TĨNH =================
void processDualRadar() {
  if (millis() - lastRadarMove > 150) { 
    lastRadarMove = millis();
    
    // 1. RADAR HÀNH LANG
    if (enableRadar2) { 
      float distHL = getDistance(PIN_TRIG_2, PIN_ECHO_2);
      if (distHL > 0.1 && distHL < 8.4) {
        String blockName = (distHL > 5.0) ? "Block 1" : "Block 2";
        JsonDocument doc; doc["deviceId"] = "hallway_sensor_radar"; doc["distance"] = round(distHL * 10) / 10.0; doc["zone"] = blockName; doc["value"] = "Có vật thể tại " + blockName; doc["status"] = "Cảnh báo";
        publishJson((String(TOPIC_PREFIX) + "hallway/radar/hallway_sensor_radar/data").c_str(), doc);
      }
    }

    delay(20); 

    // 2. RADAR PHÒNG KHÁCH / BẾP
    if (enableRadar1) {
      float distPK = getDistance(PIN_TRIG_1, PIN_ECHO_1);
      if (distPK > 0.1 && distPK <= 15.5) {
        String roomName = (distPK > 10.0) ? "Phòng Khách (Block 1)" : "Bếp (Block 2)";
        JsonDocument doc; doc["deviceId"] = "livingroom_sensor_radar"; doc["distance"] = round(distPK * 10) / 10.0; doc["zone"] = roomName; doc["value"] = "Phát hiện ở " + roomName; doc["status"] = "Cảnh báo";
        publishJson((String(TOPIC_PREFIX) + "livingroom/radar/livingroom_sensor_radar/data").c_str(), doc);
      }
    }
  }
}

float getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10); digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 15000); 
  if (duration == 0) return -1.0;
  return duration * 0.034 / 2;
}

// ================= CẢM BIẾN THỰC TẾ =================
void processRealSensors() {
  unsigned long currentMillis = millis();

  // 1. NGẮT ÂM THANH SỐ
  if (suddenNoise) {
    JsonDocument doc; doc["deviceId"] = "livingroom_sensor_audio"; doc["value"] = "ỒN ÀO đột ngột!"; doc["status"] = "Cảnh báo";
    publishJson((String(TOPIC_PREFIX) + "livingroom/sound/livingroom_sensor_audio/data").c_str(), doc);
    audioCheckInterval = 60000; suddenNoise = false;
  }

  // 2. NGẮT PIR 
  if (motionDoor || motionLiving) {
    String triggerId = motionDoor ? "entrance_sensor_pir" : "livingroom_sensor_pir";
    String topic = motionDoor ? (String(TOPIC_PREFIX) + "entrance/motion/entrance_sensor_pir/data") : (String(TOPIC_PREFIX) + "livingroom/motion/livingroom_sensor_pir/data");
    JsonDocument doc; doc["deviceId"] = triggerId; doc["motion"] = true; doc["value"] = "Có người"; doc["status"] = "Cảnh báo";
    publishJson(topic.c_str(), doc);
    motionDoor = false; motionLiving = false;
  }

  // 3. ĐỌC ÂM THANH
  if (currentMillis - lastAudioRead > audioCheckInterval || lastAudioRead == 0) {
    lastAudioRead = currentMillis; if (lastAudioRead == 0) lastAudioRead = 1; 
    if (enableMic) {
      int maxAmp = 0, minAmp = 4095;
      for (int i = 0; i < 20; i++) { 
        int adc = analogRead(PIN_MIC); if (adc > maxAmp) maxAmp = adc; if (adc < minAmp) minAmp = adc; delay(1);
      }
      int amplitude = maxAmp - minAmp; int dbValue = constrain(map(amplitude, 0, 4000, 30, 100), 30, 100);
      audioCheckInterval = (dbValue > 70) ? 60000 : 300000;  
      JsonDocument micDoc; micDoc["deviceId"] = "livingroom_sensor_audio"; micDoc["value"] = String(dbValue) + " dB"; micDoc["status"] = dbValue > 70 ? "Hơi ồn" : "Yên tĩnh";
      publishJson((String(TOPIC_PREFIX) + "livingroom/sound/livingroom_sensor_audio/data").c_str(), micDoc);
    }
  }

  // 4. ĐỌC NHIỆT ĐỘ & KHÍ
  if (currentMillis - lastAirTempRead > airCheckInterval || lastAirTempRead == 0) {
    lastAirTempRead = currentMillis; if (lastAirTempRead == 0) lastAirTempRead = 1; 
    float t = dht.readTemperature(); float h = dht.readHumidity();
    if (!isnan(t)) {
      JsonDocument doc; doc["deviceId"] = "livingroom_sensor_dht22"; doc["value"] = String(t, 1) + "°C / " + String(h, 1) + "%"; doc["status"] = "Bình thường";
      publishJson((String(TOPIC_PREFIX) + "livingroom/temperature/livingroom_sensor_dht22/data").c_str(), doc);
    }
    int gasLevel = analogRead(PIN_MQ135);
    airCheckInterval = (gasLevel > 2000) ? 60000 : 300000;  
    JsonDocument gasDoc; gasDoc["deviceId"] = "kitchen_sensor_mq135"; gasDoc["value"] = gasLevel > 2000 ? "Khí độc" : "Sạch"; gasDoc["status"] = gasLevel > 2000 ? "Nguy hiểm" : "An toàn";
    publishJson((String(TOPIC_PREFIX) + "kitchen/air_quality/kitchen_sensor_mq135/data").c_str(), gasDoc);
  }

  // 5. FLAME SENSOR 
  static int lastFlameState = HIGH;
  int currentFlame = digitalRead(PIN_FLAME_KITCHEN);
  if (currentFlame != lastFlameState) {
    bool isFire = (currentFlame == LOW);
    JsonDocument doc; doc["deviceId"] = "kitchen_sensor_flame"; doc["detected"] = isFire; doc["value"] = isFire ? "CÓ LỬA" : "Không có lửa"; doc["status"] = isFire ? "Nguy hiểm" : "An toàn";
    publishJson((String(TOPIC_PREFIX) + "kitchen/flame/kitchen_sensor_flame/data").c_str(), doc);
    lastFlameState = currentFlame;
  }
}

// ================= NHẬN LỆNH TỪ FE / BE =================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg, tpc = String(topic);
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  
  Serial.println("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  Serial.printf("⬇️ RECEIVED FROM    : %s\n", topic);
  Serial.printf("📨 COMMAND PAYLOAD  : %s\n", msg.c_str());
  Serial.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  JsonDocument doc;
  if (deserializeJson(doc, msg)) return;
  String deviceId = doc["deviceId"] | "unknown";

  if (doc.containsKey("state")) {
    bool state = doc["state"];
    String statusValue = state ? "Đang hoạt động" : "Đã tắt"; 
    bool isHandled = true;

    // --- PHÂN LOẠI LỆNH ĐIỀU KHIỂN ---
    if (deviceId == "kitchen_light_main") {
      digitalWrite(PIN_RELAY, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    // Lệnh cho Rèm Ban Công 1
    else if (deviceId == "balcony1_curtain_main") {
      targetCurtainAngle = state ? 180 : 0; // Cập nhật mục tiêu, hàm processCurtain() sẽ lo việc quay từ từ
      statusValue = state ? "Mở" : "Đóng";
    }
    // Lệnh tắt/mở các Cảm biến 
    else if (deviceId == "entrance_sensor_pir") enablePirDoor = state;
    else if (deviceId == "livingroom_sensor_pir") enablePirLiving = state;
    else if (deviceId == "livingroom_sensor_audio") enableMic = state;
    else if (deviceId == "livingroom_sensor_radar") enableRadar1 = state;
    else if (deviceId == "hallway_sensor_radar") enableRadar2 = state;
    else {
      isHandled = false; 
    }

    // --- TRẢ VỀ STATUS CHUNG ---
    if (isHandled) {
      JsonDocument res; res["deviceId"] = deviceId; res["state"] = state; res["value"] = statusValue;
      String statusTopic = tpc; statusTopic.replace("command", "status");
      publishJson(statusTopic.c_str(), res);
    }
  }
}

// ================= TIỆN ÍCH =================
void publishJson(const char* topic, JsonDocument& doc) {
  doc["timestamp"] = time(nullptr);
  doc["homeId"] = "11111111-1111-1111-1111-111111111111";
  char buffer[512]; serializeJson(doc, buffer);
  mqttClient.publish(topic, buffer);
  Serial.println("================================================");
  Serial.printf("⬆️ PUBLISH: %s\n📦 %s\n", topic, buffer);
  Serial.println("================================================");
}

void setupWiFi() { WiFi.begin(WIFI_SSID, WIFI_PASSWORD); while (WiFi.status() != WL_CONNECTED) delay(500); }
void syncTime() { configTime(7 * 3600, 0, "pool.ntp.org"); while (time(nullptr) < 100000) delay(500); }
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Đang kết nối MQTT Broker... ");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println("THÀNH CÔNG!");
      mqttClient.subscribe(TOPIC_CMD_WILDCARD); 
    } else {
      delay(5000);
    }
  }
}
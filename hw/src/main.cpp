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

Servo radarServo;

// --- Tracking Thời gian ---
unsigned long lastAudioRead = 0;
unsigned long lastAirTempRead = 0;
unsigned long lastRadarMove = 0;

// ==========================================
// CỜ BẬT/TẮT MODULE (ĐIỀU KHIỂN QUA MQTT)
// ==========================================
bool enablePirDoor   = true;  
bool enablePirLiving = true;  
bool enableMic       = true;  
bool enableFlame     = true;  
bool enableRadar1    = true;  // Phòng khách/Bếp (Chân 19/21)
bool enableRadar2    = true;  // Hành lang (Chân 25/26)

// --- Radar State ---
int radarAngle = 0;
bool radarDirection = true;

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

  // Theo config.h: TRIG_1(19), ECHO_1(21) | TRIG_2(25), ECHO_2(26)
  pinMode(PIN_TRIG_1, OUTPUT); pinMode(PIN_ECHO_1, INPUT);
  pinMode(PIN_TRIG_2, OUTPUT); pinMode(PIN_ECHO_2, INPUT);
  
  ESP32PWM::allocateTimer(0);
  radarServo.setPeriodHertz(50);
  radarServo.attach(PIN_SERVO_1, 500, 2400); // Servo chân 5
  
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
}

// ================= XỬ LÝ RADAR THEO LOGIC MỚI =================
void processDualRadar() {
  if (millis() - lastRadarMove > 150) { // Chu kỳ quét chậm mỗi 150ms
    lastRadarMove = millis();
    
    // -----------------------------------------------
    // 1. RADAR HÀNH LANG (Tĩnh - PIN_TRIG_2/PIN_ECHO_2)
    // -----------------------------------------------
    if (enableRadar2) { 
      float distHL = getDistance(PIN_TRIG_2, PIN_ECHO_2);
      
      if (distHL > 0.1 && distHL < 8.4) {
        String blockName = (distHL > 5.0) ? "Block 1" : "Block 2";
        
        JsonDocument doc;
        doc["deviceId"] = "hallway_sensor_radar";
        doc["distance"] = round(distHL * 10) / 10.0;
        doc["zone"] = blockName;
        doc["value"] = "Có vật thể tại " + blockName;
        doc["status"] = "Cảnh báo";
        publishJson("home/tsmarthome/hallway/radar/hallway_sensor_radar/data", doc);
      }
    }

    delay(20); // Dừng 20ms để sóng siêu âm của hành lang tan hết, tránh nhiễu chéo

    // -----------------------------------------------
    // 2. RADAR PHÒNG KHÁCH / BẾP (Xoay Servo - PIN_TRIG_1/PIN_ECHO_1)
    // -----------------------------------------------
    if (enableRadar1) {
      radarServo.write(radarAngle);
      
      // Kiểm tra tại các góc: 70, 75, 80, 85, 90
      if (radarAngle >= 70 && radarAngle <= 90) {
        delay(30); // Đợi servo nhích tới điểm đó và ổn định
        float distPK = getDistance(PIN_TRIG_1, PIN_ECHO_1);
        
        if (distPK > 0.1 && distPK <= 15.5) {
          String roomName = (distPK > 10.0) ? "Phòng Khách (Block 1)" : "Bếp (Block 2)";
          
          JsonDocument doc;
          doc["deviceId"] = "livingroom_sensor_radar";
          doc["distance"] = round(distPK * 10) / 10.0;
          doc["angle"] = radarAngle;
          doc["zone"] = roomName;
          doc["value"] = "Phát hiện ở " + roomName;
          doc["status"] = "Cảnh báo";
          publishJson("home/tsmarthome/livingroom/radar/livingroom_sensor_radar/data", doc);
        }
      }

      // Cập nhật góc quay Servo (0 - 90 độ)
      if (radarDirection) radarAngle += 5; else radarAngle -= 5;
      if (radarAngle >= 90 || radarAngle <= 0) radarDirection = !radarDirection;
    }
  }
}

float getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 15000); 
  if (duration == 0) return -1.0;
  return duration * 0.034 / 2;
}

// ================= CẢM BIẾN THỰC TẾ =================
void processRealSensors() {
  unsigned long currentMillis = millis();

  // 1. NGẮT ÂM THANH
  if (suddenNoise) {
    JsonDocument doc; doc["deviceId"] = "livingroom_sensor_audio"; doc["value"] = "ỒN ÀO đột ngột!"; doc["status"] = "Cảnh báo";
    publishJson("home/tsmarthome/livingroom/sound/livingroom_sensor_audio/data", doc);
    suddenNoise = false;
  }

  // 2. NGẮT PIR 
  if (motionDoor || motionLiving) {
    String triggerId = motionDoor ? "entrance_sensor_pir" : "livingroom_sensor_pir";
    String topic = motionDoor ? "home/tsmarthome/entrance/motion/entrance_sensor_pir/data" : "home/tsmarthome/livingroom/motion/livingroom_sensor_pir/data";
    JsonDocument doc; doc["deviceId"] = triggerId; doc["motion"] = true; doc["value"] = "Có người"; doc["status"] = "Cảnh báo";
    publishJson(topic.c_str(), doc);
    motionDoor = false; motionLiving = false;
  }

  // 3. ĐỌC ÂM THANH (Mỗi 5 giây)
  if (currentMillis - lastAudioRead > 5000) {
    lastAudioRead = currentMillis;
    if (enableMic) {
      int maxAmp = 0, minAmp = 4095;
      for (int i = 0; i < 20; i++) { 
        int adc = analogRead(PIN_MIC);
        if (adc > maxAmp) maxAmp = adc;
        if (adc < minAmp) minAmp = adc; delay(1);
      }
      int amplitude = maxAmp - minAmp;
      int dbValue = constrain(map(amplitude, 0, 4000, 30, 100), 30, 100);
      JsonDocument micDoc; micDoc["deviceId"] = "livingroom_sensor_audio"; micDoc["value"] = String(dbValue) + " dB"; micDoc["status"] = dbValue > 70 ? "Hơi ồn" : "Yên tĩnh";
      publishJson("home/tsmarthome/livingroom/sound/livingroom_sensor_audio/data", micDoc);
    }
  }

  // 4. ĐỌC NHIỆT ĐỘ & KHÍ (Mỗi 5 phút)
  if (currentMillis - lastAirTempRead > 300000 || lastAirTempRead == 0) {
    lastAirTempRead = currentMillis;
    if (lastAirTempRead == 0) lastAirTempRead = 1; 
    
    float t = dht.readTemperature(); float h = dht.readHumidity();
    if (!isnan(t)) {
      JsonDocument doc; doc["deviceId"] = "livingroom_sensor_dht22"; doc["value"] = String(t, 1) + "°C / " + String(h, 1) + "%"; doc["status"] = "Bình thường";
      publishJson("home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22/data", doc);
    }

    int gasLevel = analogRead(PIN_MQ135);
    JsonDocument gasDoc; gasDoc["deviceId"] = "kitchen_sensor_mq135"; gasDoc["value"] = gasLevel > 2000 ? "Khí độc" : "Sạch"; gasDoc["status"] = gasLevel > 2000 ? "Nguy hiểm" : "An toàn";
    publishJson("home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135/data", gasDoc);
  }

  // 5. FLAME SENSOR 
  static int lastFlameState = HIGH;
  if (enableFlame) {
    int currentFlame = digitalRead(PIN_FLAME_KITCHEN);
    if (currentFlame != lastFlameState) {
      bool isFire = (currentFlame == LOW);
      JsonDocument doc; doc["deviceId"] = "kitchen_sensor_flame"; doc["detected"] = isFire; doc["value"] = isFire ? "CÓ LỬA" : "Không có lửa"; doc["status"] = isFire ? "Nguy hiểm" : "An toàn";
      publishJson("home/tsmarthome/kitchen/flame/kitchen_sensor_flame/data", doc);
      lastFlameState = currentFlame;
    }
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

  // 1. TÍNH NĂNG BẬT/TẮT CÁC MODULE 
  if (doc.containsKey("enable")) {
    bool state = doc["enable"];
    
    if (deviceId == "entrance_sensor_pir") enablePirDoor = state;
    else if (deviceId == "livingroom_sensor_pir") enablePirLiving = state;
    else if (deviceId == "livingroom_sensor_audio") enableMic = state;
    else if (deviceId == "kitchen_sensor_flame") enableFlame = state;
    else if (deviceId == "livingroom_sensor_radar") enableRadar1 = state;
    else if (deviceId == "hallway_sensor_radar") enableRadar2 = state;

    JsonDocument res; res["deviceId"] = deviceId; res["enable"] = state; res["value"] = state ? "Đang hoạt động" : "Đã tắt";
    String statusTopic = tpc; statusTopic.replace("command", "status");
    publishJson(statusTopic.c_str(), res);
    return;
  }

  // 2. LỆNH ĐIỀU KHIỂN ĐÈN
  if (deviceId == "kitchen_light_main" && doc.containsKey("state")) {
    bool state = doc["state"];
    digitalWrite(PIN_RELAY, state ? HIGH : LOW);
    JsonDocument res; res["deviceId"] = deviceId; res["state"] = state; res["value"] = state ? "Bật" : "Tắt";
    String statusTopic = tpc; statusTopic.replace("command", "status");
    publishJson(statusTopic.c_str(), res);
  }
}

// ================= TIỆN ÍCH =================
void publishJson(const char* topic, JsonDocument& doc) {
  doc["timestamp"] = time(nullptr);
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
      mqttClient.subscribe("home/tsmarthome/+/+/+/command"); 
    } else {
      delay(5000);
    }
  }
}
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "time.h"
#include "config.h"

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// --- Tracking Thời gian Radar ---
unsigned long lastRadarMove = 0;

// ==========================================
// CỜ BẬT/TẮT MODULE RADAR (ĐIỀU KHIỂN QUA MQTT)
// ==========================================
bool enableRadar2 = true;  // livingroom_sensor_radar2
bool enableRadar3 = true;  // livingroom_sensor_radar3

// Ngưỡng đo cảnh báo (cm)
const float THRESHOLD_DISTANCE = 15.5; 

// --- Khai báo hàm ---
void setupWiFi();
void syncTime();
void reconnectMQTT();
void publishJson(const char* topic, JsonDocument& doc);
void processRadars();
float getDistance(int trigPin, int echoPin);
void mqttCallback(char* topic, byte* payload, unsigned int length);

void setup() {
  Serial.begin(115200);
  
  // Khởi tạo 6 Relay (Mặc định tắt - LOW)
  int relayPins[] = {PIN_RELAY_FRONT_LIGHT, PIN_RELAY_BACK_LIGHT, PIN_RELAY_CEILING_LIGHT, PIN_RELAY_DINING_LIGHT, PIN_RELAY_BALCONY_LIGHT, PIN_RELAY_HALLWAY_LIGHT};
  for(int i=0; i<6; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW);
  }

  // Khởi tạo 2 Radar
  pinMode(PIN_TRIG_RADAR2, OUTPUT); pinMode(PIN_ECHO_RADAR2, INPUT);
  pinMode(PIN_TRIG_RADAR3, OUTPUT); pinMode(PIN_ECHO_RADAR3, INPUT);
  
  setupWiFi();
  syncTime();
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setBufferSize(1024);
  mqttClient.setCallback(mqttCallback);
}

void loop() {
  if (!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();

  processRadars();
}

// ================= XỬ LÝ 2 RADAR TĨNH =================
void processRadars() {
  if (millis() - lastRadarMove > 1000) { // Quét mỗi 200ms
    lastRadarMove = millis();
    
    // -----------------------------------------------
    // RADAR 2 (Hàng 2)
    // -----------------------------------------------
    if (enableRadar2) { 
      float distR2 = getDistance(PIN_TRIG_RADAR2, PIN_ECHO_RADAR2);
      
      if (distR2 > 0.1 && distR2 <= THRESHOLD_DISTANCE) {
        JsonDocument doc;
        doc["deviceId"] = "livingroom_sensor_radar2";
        doc["distance"] = round(distR2 * 10) / 10.0;
        doc["zone"] = "Hàng 2";
        doc["value"] = "Phát hiện ở Hàng 2";
        doc["status"] = "Cảnh báo";
        publishJson("home/tsmarthome/livingroom/radar/livingroom_sensor_radar2/data", doc);
      }
    }

    delay(30); // Dừng 30ms để sóng của Radar 2 tan hết, tránh nhiễu sang Radar 3

    // -----------------------------------------------
    // RADAR 3 (Hàng 3)
    // -----------------------------------------------
    if (enableRadar3) { 
      float distR3 = getDistance(PIN_TRIG_RADAR3, PIN_ECHO_RADAR3);
      
      if (distR3 > 0.1 && distR3 <= THRESHOLD_DISTANCE) {
        JsonDocument doc;
        doc["deviceId"] = "livingroom_sensor_radar3";
        doc["distance"] = round(distR3 * 10) / 10.0;
        doc["zone"] = "Hàng 3";
        doc["value"] = "Phát hiện ở Hàng 3";
        doc["status"] = "Cảnh báo";
        publishJson("home/tsmarthome/livingroom/radar/livingroom_sensor_radar3/data", doc);
      }
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

// ================= NHẬN LỆNH TỪ FE / BE =================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg, tpc = String(topic);
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  
  Serial.println("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  Serial.printf("⬇️ NODE 2 RECEIVED : %s\n", topic);
  Serial.printf("📨 PAYLOAD         : %s\n", msg.c_str());
  Serial.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  JsonDocument doc;
  if (deserializeJson(doc, msg)) return;
  String deviceId = doc["deviceId"] | "unknown";

  if (doc.containsKey("state")) {
    bool state = doc["state"];
    String statusValue = state ? "Đang hoạt động" : "Đã tắt"; 
    bool isHandled = true;

    // --- 1. PHÂN LOẠI LỆNH CHO 6 RELAY (ĐÈN) ---
    if (deviceId == "livingroom_light_front") {
      digitalWrite(PIN_RELAY_FRONT_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    else if (deviceId == "livingroom_light_back") {
      digitalWrite(PIN_RELAY_BACK_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    else if (deviceId == "livingroom_light_ceiling") {
      digitalWrite(PIN_RELAY_CEILING_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    else if (deviceId == "livingroom_light_dining") {
      digitalWrite(PIN_RELAY_DINING_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    else if (deviceId == "balcony1_light_main") {
      digitalWrite(PIN_RELAY_BALCONY_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    else if (deviceId == "hallway_light_main") {
      digitalWrite(PIN_RELAY_HALLWAY_LIGHT, state ? HIGH : LOW);
      statusValue = state ? "Bật" : "Tắt"; 
    }
    
    // --- 2. LỆNH BẬT/TẮT 2 RADAR MỚI ---
    else if (deviceId == "livingroom_sensor_radar2") {
      enableRadar2 = state;
    }
    else if (deviceId == "livingroom_sensor_radar3") {
      enableRadar3 = state;
    }
    else {
      isHandled = false; // Bỏ qua nếu lệnh không thuộc Node 2
    }

    // --- TRẢ VỀ STATUS CHUNG NẾU LỆNH HỢP LỆ ---
    if (isHandled) {
      JsonDocument res; 
      res["deviceId"] = deviceId; 
      res["state"] = state; 
      res["value"] = statusValue;
      
      String statusTopic = tpc; statusTopic.replace("command", "status");
      publishJson(statusTopic.c_str(), res);
    }
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
    Serial.print("Đang kết nối MQTT Broker (Node 2)... ");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println("THÀNH CÔNG!");
      mqttClient.subscribe(TOPIC_CMD_WILDCARD); 
    } else {
      delay(5000);
    }
  }
}
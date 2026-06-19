#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

const char* WIFI_SSID     = "Thu Ha";
const char* WIFI_PASSWORD = "11081980";
const char* MQTT_BROKER   = "broker.emqx.io";
const int   MQTT_PORT     = 1883;
const char* MQTT_CLIENT_ID = "ESP32_TSmartHome_Node2"; // Đổi tên để không bị đá văng Node 1

// ==========================================
// PIN MAPPING - NODE 2 (Dùng các chân an toàn)
// ==========================================

// --- 6 MODULE RELAY (ĐÈN) ---
#define PIN_RELAY_FRONT_LIGHT   13 // Đèn trần trước
#define PIN_RELAY_BACK_LIGHT    14 // Đèn trần sau
#define PIN_RELAY_CEILING_LIGHT 25 // Đèn trần P.Khách
#define PIN_RELAY_DINING_LIGHT  26 // Đèn phòng ăn
#define PIN_RELAY_BALCONY_LIGHT 27 // Đèn Ban công 1
#define PIN_RELAY_HALLWAY_LIGHT 33 // Đèn hành lang

// --- 2 RADAR TĨNH (HC-SR04) ---
#define PIN_TRIG_RADAR2  19
#define PIN_ECHO_RADAR2  21

#define PIN_TRIG_RADAR3  22
#define PIN_ECHO_RADAR3  23

// --- TOPICS ---
const char* TOPIC_CMD_WILDCARD = "11111111-1111-1111-1111-111111111111/home/tsmarthome/+/+/+/command";
const char* TOPIC_PREFIX = "11111111-1111-1111-1111-111111111111/home/tsmarthome/";

#endif
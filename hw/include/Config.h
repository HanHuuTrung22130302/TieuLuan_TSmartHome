#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

static const char* WIFI_SSID     = "Thu Ha";
static const char* WIFI_PASSWORD = "11081980";
static const char* MQTT_BROKER   = "broker.emqx.io";
static const int   MQTT_PORT     = 1883;
static const char* MQTT_CLIENT_ID = "ESP32_TSmartHome_Node1";

// --- PIN MAPPING ---
#define PIN_DHT     4
#define PIN_MQ135   34  // ADC1
#define PIN_MIC     35  // ADC1 (Cho MAX9814)
#define PIN_VOICE_DIG 14

#define PIN_PIR_DOOR 32
#define PIN_PIR_LIVING 33
#define PIN_FLAME_KITCHEN 13 // Chỉ giữ 1 Flame ở Bếp
// #define PIN_REED_DOOR 27
// #define PIN_REED_PN1 16
// #define PIN_REED_PN2 17
#define PIN_RELAY   22

// --- RADAR 1 (Phòng Khách) ---
#define PIN_SERVO_1 5
#define PIN_TRIG_1 25
#define PIN_ECHO_1 26

// --- RADAR 2 (Hành Lang) ---
// #define PIN_SERVO_2 5
#define PIN_TRIG_2 19
#define PIN_ECHO_2 21

// --- TOPICS ---
const char* TOPIC_CMD_WILDCARD = "home/tsmarthome/+/+/+/command";

#endif
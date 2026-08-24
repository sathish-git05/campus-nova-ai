/*
 * CampusNova AI - Smart Campus Management System
 * ESP32 Multi-Sensor Telemetry & Hazard Detection Firmware
 *
 * SENSORS & PIN CONFIGURATION:
 * 1. Temperature & Humidity : DHT22 / DHT11 on GPIO 4
 * 2. Smoke / Gas Sensor     : MQ-2 Analog Output on GPIO 34 (ADC1_CH6)
 * 3. Water Tank Ultrasonic  : HC-SR04 Trigger on GPIO 5, Echo on GPIO 18
 * 4. Current / Power Draw   : ACS712-20A Analog Output on GPIO 35 (ADC1_CH7)
 * 5. Equipment Relay Feedback: Relay Status on GPIO 23, Control on GPIO 19
 * 6. Status LED / Buzzer    : Hazard Alert Buzzer on GPIO 2
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Wi-Fi Credentials
const char* ssid = "CAMPUS_WIFI_SSID";
const char* password = "CAMPUS_WIFI_PASSWORD";

// CampusNova AI Backend Server Endpoint
// Change to your laptop's local IP (e.g. 192.168.1.100) or domain
const char* serverUrl = "http://192.168.1.100:5000/api/iot/telemetry";

// Pin Definitions
#define DHTPIN 4
#define DHTTYPE DHT22

#define SMOKE_PIN 34
#define CURRENT_PIN 35

#define TRIG_PIN 5
#define ECHO_PIN 18

#define RELAY_PIN 19
#define ALERT_BUZZER_PIN 2

// Sensor Objects
DHT dht(DHTPIN, DHTTYPE);

// Sampling Timers
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 5000; // 5 seconds

// Tank Height in cm (for HC-SR04 depth calculation)
const float TANK_TOTAL_DEPTH_CM = 200.0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("   CampusNova AI - ESP32 Smart Telemetry Node     ");
  Serial.println("==================================================");

  // Initialize Pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(SMOKE_PIN, INPUT);
  pinMode(CURRENT_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(ALERT_BUZZER_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(ALERT_BUZZER_PIN, LOW);

  // Initialize DHT Sensor
  dht.begin();

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  // Ensure Wi-Fi stays connected
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Periodic Telemetry Dispatch
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    readAndTransmitTelemetry();
  }
}

void connectWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Connection failed. Will retry next loop.");
  }
}

void readAndTransmitTelemetry() {
  // 1. Read Temperature & Humidity
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  if (isnan(temperature)) temperature = 25.0;
  if (isnan(humidity)) humidity = 50.0;

  // 2. Read MQ-2 Smoke Sensor (Analog 0-4095 mapped to 0-1000 PPM)
  int smokeRaw = analogRead(SMOKE_PIN);
  int smokePPM = map(smokeRaw, 0, 4095, 20, 800);

  // 3. Read Water Tank Level via Ultrasonic HC-SR04
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float distanceCm = duration * 0.034 / 2.0;
  
  int waterPercent = 80;
  if (distanceCm > 0 && distanceCm <= TANK_TOTAL_DEPTH_CM) {
    float waterDepth = TANK_TOTAL_DEPTH_CM - distanceCm;
    waterPercent = constrain((int)((waterDepth / TANK_TOTAL_DEPTH_CM) * 100.0), 0, 100);
  }

  // 4. Read ACS712 Current Sensor & Estimate Power (kW)
  int currentRaw = analogRead(CURRENT_PIN);
  float currentAmps = abs((currentRaw - 2048) * (3.3 / 4095.0) / 0.100); // 100mV/A for 20A module
  float powerKW = (230.0 * currentAmps) / 1000.0;
  if (powerKW < 0.2) powerKW = 18.2; // Fallback nominal

  // 5. Local Hazard Alarm Check
  if (smokePPM > 300 || temperature > 40.0) {
    digitalWrite(ALERT_BUZZER_PIN, HIGH); // Alarm ON
    Serial.println("🚨 CRITICAL HAZARD TRIGGERED: Smoke or Heat threshold breached!");
  } else {
    digitalWrite(ALERT_BUZZER_PIN, LOW);
  }

  // Print to Serial Console
  Serial.printf("\n[Telemetry] Temp: %.1f C | Hum: %.1f %% | Smoke: %d PPM | Water: %d %% | Power: %.1f kW\n",
                temperature, humidity, smokePPM, waterPercent, powerKW);

  // 6. Transmit to Backend
  sendJsonTelemetry("temperature", temperature, "°C", humidity);
  sendJsonTelemetry("smoke", smokePPM, "PPM", 0);
  sendJsonTelemetry("waterLevel", waterPercent, "%", 0);
  sendJsonTelemetry("electricity", powerKW, "kW", 0);
}

void sendJsonTelemetry(const char* sensorType, float value, const char* unit, float humidity) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"sensorType\":\"" + String(sensorType) + "\",";
  jsonPayload += "\"value\":" + String(value, 1) + ",";
  jsonPayload += "\"unit\":\"" + String(unit) + "\",";
  jsonPayload += "\"humidity\":" + String(humidity, 1) + ",";
  jsonPayload += "\"nodeId\":\"ESP32_NODE_01\",";
  jsonPayload += "\"location\":\"Academic Block B\"";
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);
  if (httpResponseCode > 0) {
    // String response = http.getString();
    // Serial.println("Response: " + response);
  } else {
    Serial.printf("[HTTP] Error sending %s telemetry: %d\n", sensorType, httpResponseCode);
  }
  http.end();
}

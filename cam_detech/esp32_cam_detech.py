from ultralytics import YOLO
import cv2
import time
import json
import requests
import paho.mqtt.client as mqtt


# Run the following command in your terminal to install the required packages:
# pip install ultralytics opencv-python paho-mqtt requests

# CONFIGURATION
STREAM_URL = "http://192.168.1.116:81/stream"
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
HOME_ID = "11111111-1111-1111-1111-111111111111"
DEVICE_ID = "entrance_camera_s3"
MQTT_TOPIC = f"{HOME_ID}/home/tsmarthome/entrance/camera/{DEVICE_ID}/data"
BACKEND_UPLOAD_URL = "http://localhost:8080/api/camera/upload"

# Setup MQTT Client
print("Đang kết nối MQTT Broker...")
try:
    # Paho MQTT v2 compatibility
    mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="ESP32_Cam_Detector")
except AttributeError:
    # Fallback to Paho MQTT v1
    mqtt_client = mqtt.Client(client_id="ESP32_Cam_Detector")

try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
    print(f"Đã kết nối MQTT Broker thành công: {MQTT_BROKER}:{MQTT_PORT}")
except Exception as e:
    print(f"Lỗi kết nối MQTT: {e}")
    exit()

# Load YOLOv8 model
print("Đang tải mô hình YOLOv8...")
model = YOLO("yolov8n.pt")

# Open camera stream
cap = cv2.VideoCapture(STREAM_URL)

if not cap.isOpened():
    print(f"Không kết nối được camera stream tại: {STREAM_URL}")
    exit()

print("Đang chạy YOLO Person Detection & MQTT Publisher...")

# Variables for rate limiting to avoid spamming the broker
last_publish_time = 0

while True:
    ret, frame = cap.read()

    if not ret:
        print("Mất kết nối stream camera, đang thử kết nối lại...")
        cap.release()
        time.sleep(2)
        cap = cv2.VideoCapture(STREAM_URL)
        continue

    # Run YOLOv8 detection only for person (class 0)
    results = model(
        frame,
        classes=[0],      # person only
        conf=0.70,        # minimum confidence threshold
        verbose=False
    )

    # Count detected people
    person_count = len(results[0].boxes)

    # Annotate frame
    annotated_frame = results[0].plot()

    # Draw count overlay
    cv2.putText(
        annotated_frame,
        f"People: {person_count}",
        (10, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0) if person_count == 0 else (0, 0, 255),
        2
    )

    # MQTT publish check (chỉ gửi khi phát hiện người và tối đa 1 lần/phút)
    current_time = time.time()
    if person_count > 0:
        if (current_time - last_publish_time) >= 60.0:
            last_publish_time = current_time

            status = "Phát hiện"
            value = f"Phát hiện {person_count} người ở cửa vào"

            payload = {
                "deviceId": DEVICE_ID,
                "homeId": HOME_ID,
                "status": status,
                "value": value,
                "personCount": person_count,
                "timestamp": int(current_time)
            }

            try:
                mqtt_client.publish(MQTT_TOPIC, json.dumps(payload))
                print(f"[{time.strftime('%H:%M:%S')}] MQTT PUBLISH -> Topic: {MQTT_TOPIC} | Payload: {payload}")
            except Exception as e:
                print(f"Lỗi gửi tin nhắn MQTT: {e}")

            # Chụp ảnh và gửi lên backend để lưu Cloudinary
            try:
                success, encoded_image = cv2.imencode('.jpg', annotated_frame)
                if success:
                    image_bytes = encoded_image.tobytes()
                    files = {
                        'file': ('capture.jpg', image_bytes, 'image/jpeg')
                    }
                    data = {
                        'homeId': HOME_ID,
                        'deviceName': DEVICE_ID
                    }
                    response = requests.post(BACKEND_UPLOAD_URL, files=files, data=data, timeout=10)
                    if response.status_code == 200:
                        img_url = response.json().get('imageUrl')
                        print(f"[{time.strftime('%H:%M:%S')}] Đã chụp và tải ảnh thành công lên Cloudinary: {img_url}")
                    else:
                        print(f"[{time.strftime('%H:%M:%S')}] Lỗi upload ảnh: Status code {response.status_code}, {response.text}")
                else:
                    print(f"[{time.strftime('%H:%M:%S')}] Lỗi encode ảnh JPEG")
            except Exception as upload_err:
                print(f"[{time.strftime('%H:%M:%S')}] Lỗi chụp/upload ảnh: {upload_err}")

    # Display video frame
    cv2.imshow("ESP32-CAM Human Detection & MQTT Alerts", annotated_frame)

    # Escape key to exit
    key = cv2.waitKey(1)
    if key == 27:
        break

# Cleanup
cap.release()
mqtt_client.loop_stop()
mqtt_client.disconnect()
cv2.destroyAllWindows()
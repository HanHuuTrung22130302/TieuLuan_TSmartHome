# TSmartHome - Smart Home Management Platform

## Giới thiệu

TSmartHome là hệ thống nhà thông minh được xây dựng nhằm hỗ trợ giám sát, điều khiển và quản lý các thiết bị IoT thông qua nền tảng Web. Hệ thống kết hợp giữa phần mềm và phần cứng IoT, sử dụng các vi điều khiển ESP32 để thu thập dữ liệu cảm biến, điều khiển thiết bị và giao tiếp với máy chủ thông qua giao thức MQTT.

Dự án được thực hiện trong khuôn khổ đề tài tốt nghiệp với mục tiêu xây dựng một mô hình Smart Home có khả năng:

* Giám sát môi trường theo thời gian thực.
* Điều khiển thiết bị từ xa.
* Cảnh báo các sự cố an ninh và môi trường.
* Quản lý thiết bị trên sơ đồ nhà trực quan.
* Tích hợp trợ lý AI hỗ trợ tương tác bằng ngôn ngữ tự nhiên.

---

## Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình Client – Server kết hợp IoT.

```text
ESP32 / Sensors
        │
        ▼
   MQTT Broker
        │
        ▼
 Spring Boot Backend
        │
 ┌──────┴──────┐
 ▼             ▼
PostgreSQL   WebSocket
                │
                ▼
          React Frontend
```

Các thiết bị ESP32 thu thập dữ liệu từ cảm biến và giao tiếp với Backend thông qua MQTT Broker. Backend xử lý dữ liệu, lưu trữ vào cơ sở dữ liệu và đồng bộ trạng thái tới giao diện Web bằng WebSocket theo thời gian thực.

---

## Công nghệ sử dụng

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* MQTT (Eclipse Paho)
* WebSocket + STOMP
* PostgreSQL

### Frontend

* ReactJS
* Vite
* TailwindCSS
* Axios
* React Router

### IoT

* ESP32
* ESP32-CAM
* MQTT Protocol
* DHT22
* MQ135
* Flame Sensor
* PIR Sensor
* Radar Sensor
* Relay Module

### AI & Notification

* Google Gemini API
* Telegram Bot API

---

## Chức năng chính

### Quản lý thiết bị

* Xem danh sách thiết bị trong nhà.
* Bật/tắt thiết bị từ xa.
* Theo dõi trạng thái hoạt động.
* Quản lý thiết bị theo từng phòng.

### Giám sát cảm biến

* Nhiệt độ và độ ẩm.
* Chất lượng không khí.
* Phát hiện lửa.
* Phát hiện chuyển động.
* Radar hiện diện.

### Dashboard thời gian thực

* Cập nhật dữ liệu bằng WebSocket.
* Hiển thị trạng thái thiết bị tức thời.
* Theo dõi cảnh báo và nhật ký hệ thống.

### Camera và an ninh

* Xem luồng camera trực tiếp.
* Theo dõi cảm biến an ninh.
* Ghi nhận và lưu trữ cảnh báo.

### Tự động hóa

* Hẹn giờ bật/tắt thiết bị.
* Thiết lập lịch hoạt động định kỳ.
* Quản lý các kịch bản tự động.

### Trợ lý AI

* Tương tác bằng ngôn ngữ tự nhiên.
* Truy vấn trạng thái hệ thống.
* Hỗ trợ điều khiển thiết bị.

### Thông báo Telegram

* Gửi cảnh báo cháy.
* Gửi cảnh báo khí gas.
* Gửi cảnh báo đột nhập.
* Thông báo thiết bị mất kết nối.

---

## Một số module IoT sử dụng

| Module       | Chức năng                |
| ------------ | ------------------------ |
| ESP32        | Bộ điều khiển trung tâm  |
| ESP32-CAM    | Camera giám sát          |
| DHT22        | Đo nhiệt độ và độ ẩm     |
| MQ135        | Đo chất lượng không khí  |
| Flame Sensor | Phát hiện lửa            |
| PIR Sensor   | Phát hiện chuyển động    |
| Radar Sensor | Phát hiện hiện diện      |
| Relay Module | Điều khiển thiết bị điện |

---

## Tính năng bảo mật

* Xác thực người dùng bằng JWT.
* Mật khẩu được mã hóa bằng BCrypt.
* Phân quyền theo vai trò người dùng.
* Bảo vệ API bằng Spring Security.

---

## Tác giả

Đề tài: **Phát triển ứng dụng Web TSmartHome kết hợp sử dụng ESP32 để xây dựng hệ thống IoT nhà thông minh**

Sinh viên thực hiện: ...

Trường: ...

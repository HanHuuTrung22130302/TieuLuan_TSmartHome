# Phát triển ứng dụng Web TSmartHome kết hợp sử dụng ESP32 để xây dựng hệ thống IoT nhà thông minh

## Giới thiệu

**TSmartHome** là nền tảng quản lý và giám sát nhà thông minh toàn diện, tích hợp chặt chẽ giữa phần cứng IoT (vi điều khiển ESP32, ESP32-CAM) và hệ thống phần mềm (Web Dashboard React, Máy chủ Spring Boot Backend). Hệ thống hỗ trợ người dùng theo dõi dữ liệu cảm biến thời gian thực, điều khiển các thiết bị điện từ xa, tự động hóa kịch bản, đàm thoại và truy vấn trạng thái qua trợ lý ảo AI, đặc biệt là cơ chế cảnh báo an ninh camera tích hợp trí tuệ nhân tạo và thông báo khẩn cấp qua Telegram Bot.

Dự án được thực hiện trong khuôn khổ đề tài tốt nghiệp với mục tiêu xây dựng một mô hình Smart Home thông minh, tối ưu, bảo mật và thân thiện với người dùng.

---

## Kiến trúc hệ thống

Hệ thống được thiết kế theo kiến trúc Client – Server – IoT đồng bộ thời gian thực qua giao thức MQTT và WebSocket.

```text
       ┌────────────────────────┐
       │ ESP32 / Sensors / CAM  │
       └───────────┬────────────┘
                   │
                   ▼ (MQTT Protocol / HTTP API)
       ┌────────────────────────┐
       │      MQTT Broker       │◄───────┐
       └───────────┬────────────┘        │
                   │                     │
                   ▼ (Eclipse Paho)      │ (Gửi lệnh điều khiển)
       ┌────────────────────────┐        │
       │  Spring Boot Backend   ├────────┘
       └─────┬────────────┬─────┘
             │            │
             ▼            ▼ (WebSocket / STOMP)
       ┌───────────┐┌───────────┐
       │PostgreSQL ││   React   │
       │ Database  ││ Frontend  │
       └───────────┘└───────────┘
```

* **Thiết bị IoT (ESP32 / ESP32-CAM)**: Thu thập dữ liệu cảm biến và đẩy lên Broker MQTT. ESP32-CAM truyền luồng video thời gian thực và kết hợp đoạn mã Python AI (YOLO) để nhận diện người, tự động chụp ảnh cảnh báo đẩy lên Cloudinary và lưu thông tin về Backend.
* **Spring Boot Backend**: Đóng vai trò trung tâm xử lý logic nghiệp vụ, lưu trữ cơ sở dữ liệu PostgreSQL, điều phối các gói tin MQTT và đồng bộ trạng thái tức thì đến giao diện web thông qua giao thức WebSocket (STOMP).
* **React Frontend**: Giao diện Dashboard hiển thị trực quan các thông số môi trường, sơ đồ nhà, điều khiển thiết bị trực tiếp và lịch sử ảnh chụp cảnh báo từ Camera AI.

---

## Công nghệ sử dụng

### 1. Backend (Spring Boot)
* **Java 21** & **Spring Boot 3**
* **Spring Security** & **JWT Authentication** (Xác thực an toàn)
* **Spring Data JPA** (Quản lý dữ liệu quan hệ)
* **Eclipse Paho MQTT Client** (Kết nối Broker MQTT)
* **Spring WebSocket + STOMP** (Đồng bộ dữ liệu thời gian thực tới Client)
* **PostgreSQL Database**
* **Cloudinary SDK** (Lưu trữ hình ảnh camera cảnh báo đám mây)
* **Telegram Bot API** (Tương tác lệnh và đẩy thông báo khẩn cấp tới điện thoại)

### 2. Frontend (ReactJS)
* **ReactJS** & **Vite** (Giao diện hiện đại, tốc độ tải tối ưu)
* **Vanilla CSS** & **TailwindCSS** (Giao diện responsive, thẩm mỹ cao)
* **Axios** (Kết nối API HTTP)
* **Lucide React** (Bộ icon trực quan)
* **WebSocket / SockJS Client**

### 3. IoT & Trí tuệ nhân tạo (Hardware & AI)
* **ESP32 & ESP32-CAM**
* **Mô hình YOLO (Python & OpenCV)**: Xử lý luồng stream camera, khoanh vùng và nhận diện người (`person`) trong khung hình.
* **Google Gemini API**: Trí tuệ nhân tạo hỗ trợ Trợ lý ảo phản hồi thông minh bằng ngôn ngữ tự nhiên.

---

## Chức năng chính hệ thống

### 1. Quản lý và Điều khiển Thiết bị
* Điều khiển bật/tắt tức thì các thiết bị điện (đèn, quạt, cửa tự động) qua giao diện Web.
* Quản lý trạng thái kết nối trực tuyến/ngoại tuyến của thiết bị.
* Phân chia thiết bị theo các phòng trực quan (Phòng khách, Phòng ngủ, Cửa ra vào...).

### 2. Dashboard Giám sát Cảm biến Thời gian thực
* Biểu đồ theo dõi chỉ số môi trường: Nhiệt độ, độ ẩm (DHT22), chất lượng không khí (MQ135).
* Đồng bộ cập nhật trạng thái thiết bị tức thời bằng kết nối song song WebSocket mà không cần reload trang.

### 3. Camera An ninh AI & Lưu trữ Cảnh báo (Cloudinary)
* Xem luồng stream trực tiếp từ ESP32-CAM trên Web Dashboard.
* **Phát hiện người thông minh**: Đoạn mã Python YOLO quét luồng video, khi có người xuất hiện sẽ vẽ hộp nhận diện (annotated frame) và gửi yêu cầu tải ảnh lên Cloudinary qua Backend.
* **Nhật ký chuyển động thông minh**:
  * Tích hợp dropdown chuyển đổi giữa "Trạng thái Cảm biến" và "Phát hiện chuyển động" ở thanh bên.
  * Hiển thị danh sách ảnh chụp cảnh báo kèm thông tin thiết bị, phòng ban và thời gian (Time/Day) chi tiết với phông chữ phóng to, dễ nhìn.
  * Tích hợp bộ lọc thời gian tiện lợi: **Tất cả, Hôm nay, 7 ngày qua, 30 ngày qua**.
  * Bộ phân trang động cho phép chọn số lượng ảnh hiển thị mỗi trang (**3 ảnh, 5 ảnh, 10 ảnh, 20 ảnh**).
  * Xem ảnh kích thước lớn bằng hộp thoại Lightbox toàn màn hình khi nhấp chuột vào ảnh.

### 4. Liên kết Telegram Bot Tự động hóa
* Người dùng không cần tìm kiếm và điền thủ công mã Chat ID phức tạp.
* **Quy trình liên kết tự động qua mã xác thực (Auto-Link)**:
  * Hệ thống tạo mã ngẫu nhiên bảo mật `TSM-XXXXXX` (hiệu lực trong 10 phút).
  * Cung cấp nút liên kết tự động chuyển hướng mở nhanh Telegram Bot `@MYTSMARTHOME_BOT` soạn sẵn lệnh khởi động (`/start TSM-XXXXXX`).
  * Backend định kỳ chạy cơ chế Polling kiểm tra và tự động xác nhận liên kết khi nhận lệnh từ Telegram người dùng.
  * Sau khi liên kết, mọi cảnh báo khẩn cấp (cháy nổ, rò rỉ khí gas, phát hiện người lạ đột nhập từ camera AI kèm link ảnh...) sẽ lập tức được gửi tới tài khoản Telegram cá nhân.
  * Cho phép hủy liên kết nhanh chóng ngay trên trang cá nhân chỉ với 1 lượt nhấn chuột.

### 5. Trợ lý ảo thông minh (AI Assistant)
* Giao tiếp tự nhiên bằng giọng nói hoặc văn bản thông qua mô hình ngôn ngữ lớn Google Gemini.
* Trợ lý ảo có khả năng đọc trạng thái thiết bị và ra lệnh bật/tắt thiết bị dựa trên khẩu lệnh của chủ nhà.

---

## Danh mục thiết bị phần cứng IoT sử dụng

| Thiết bị / Cảm biến | Loại Module | Chức năng trong hệ thống |
| :--- | :--- | :--- |
| **ESP32 DevKit V1** | Vi điều khiển | Bộ điều khiển trung tâm nhận và thực thi lệnh |
| **ESP32-CAM** | Camera SoC | Stream video và chụp ảnh gửi cảnh báo |
| **DHT22** | Cảm biến | Đo thông số nhiệt độ và độ ẩm phòng |
| **MQ135** | Cảm biến | Phát hiện nồng độ khí gas và chất lượng không khí |
| **Flame Sensor** | Cảm biến | Phát hiện sự xuất hiện của ngọn lửa (cảnh báo cháy) |
| **PIR Sensor (HC-SR501)** | Cảm biến | Phát hiện chuyển động hồng ngoại |
| **Radar RCWL-0516** | Cảm biến | Phát hiện sự hiện diện của cơ thể người |
| **Relay Module** | Thiết bị chấp hành | Đóng cắt dòng điện điều khiển thiết bị điện (đèn, quạt) |

---

## Hướng dẫn cài đặt và khởi chạy dự án

### Yêu cầu hệ thống
* Cài đặt sẵn **Java SDK 21** hoặc cao hơn.
* Cài đặt **Node.js** (phiên bản 18+).
* Cơ sở dữ liệu **PostgreSQL** đang hoạt động.
* Máy tính đã cài đặt Python 3.10+ để chạy script xử lý Camera AI.

### 1. Khởi chạy Database
1. Tạo một cơ sở dữ liệu có tên `tsmarthome_db` trong PostgreSQL của bạn.
2. Cấu hình username và password kết nối tương thích trong file cấu hình Spring Boot.

### 2. Khởi chạy Java Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd be
   ```
2. Cập nhật các cấu hình kết nối database, Broker MQTT, API Key Gemini và cấu hình Telegram trong tệp [application.properties](file:///e:/Nam4HocKy2/vibe_code_tieu_luan/TieuLuan_TSmartHome/be/src/main/resources/application.properties).
3. Chạy ứng dụng bằng Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Khởi chạy React Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd fe
   ```
2. Tiến hành cài đặt các gói thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy môi trường phát triển (Local Dev Server):
   ```bash
   npm run dev
   ```
4. Truy cập giao diện thông qua địa chỉ mặc định hiển thị trên terminal (ví dụ: `http://localhost:5173`).

### 4. Khởi chạy mã nguồn nhận diện người YOLO cho ESP32-CAM
1. Di chuyển vào thư mục camera:
   ```bash
   cd cam_detech
   ```
2. Cài đặt các thư viện Python cần thiết:
   ```bash
   pip install opencv-python requests paho-mqtt numpy ultralytics
   ```
3. Đảm bảo cấu hình luồng stream camera của ESP32-CAM khớp trong script `esp32_cam_detech.py`.
4. Thực thi chạy script nhận diện:
   ```bash
   python esp32_cam_detech.py
   ```

---

## Tác giả

Đề tài: **Phát triển ứng dụng Web TSmartHome kết hợp sử dụng ESP32 để xây dựng hệ thống IoT nhà thông minh**

* **Sinh viên thực hiện**: Hán Hữu Trung
* **Mã số sinh viên (MSSV)**: 22130302

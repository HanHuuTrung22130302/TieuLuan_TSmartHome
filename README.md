Phát triển ứng dụng web TSmartHome kết hợp sử dụng ESP32 để xây dựng hệ thống IoT nhà thông minh
📝 Giới thiệu dự án
Dự án nghiên cứu và xây dựng hệ thống nhà thông minh TSmartHome toàn diện, kết hợp giữa nền tảng ứng dụng Web quản trị hiện đại và phần cứng điều khiển ESP32 qua các giao thức IoT. Hệ thống cho phép người dùng giám sát các thông số môi trường, điều khiển các thiết bị gia dụng thời gian thực, quản lý an ninh qua camera và nhận cảnh báo khẩn cấp tức thời qua Telegram Bot, kết hợp cùng trợ lý ảo thông minh điều khiển bằng giọng nói.

🛠️ Kiến trúc công nghệ (Tech Stack)
1. Phân hệ Web quản trị (Web Application)
Backend (Java Spring Ecosystem):
Spring Boot 3.x phục vụ kiến trúc RESTful API.
Spring Security & JWT đảm bảo phân quyền và xác thực người dùng an toàn.
Spring Data JPA làm việc với cơ sở dữ liệu MySQL/PostgreSQL.
Spring WebSocket (giao thức STOMP) truyền nhận luồng dữ liệu cảm biến thời gian thực.
Spring Scheduling thực hiện quét tự động chạy các kịch bản hẹn giờ ngầm.
Frontend (Modern SPA Layout):
React.js kết hợp Vite cho tốc độ biên dịch và phản hồi tối ưu.
Tailwind CSS xây dựng giao diện hiện đại (SaaS Dashboard UI), thiết kế responsive, bo góc lớn (16-20px) và đổ bóng mịn.
Lucide Icons đồng bộ trực quan.
Web Speech API thực hiện chuyển giọng nói tiếng Việt thành văn bản (Speech-to-Text).
2. Phân hệ Phần cứng & Kết nối IoT (Hardware & IoT Gateway)
Chip điều khiển chính: ESP32 (ESP32-CAM và các board phát triển ESP32 tiêu chuẩn).
Giao thức truyền thông: MQTT (Message Queuing Telemetry Transport) qua Eclipse Paho MQTT Client kết nối trực tiếp với Broker MQTT, đảm bảo tốc độ phản hồi lệnh cực nhanh và tiết kiệm băng thông.
Cảm biến & Thiết bị ngoại vi: Camera an ninh ESP32-Cam, Cảm biến chuyển động/Radar, Cảm biến khói (Smoke), Khí Gas rò rỉ, Cảm biến Nhiệt độ, Độ ẩm, CO2 và các rơ-le kích hoạt thiết bị (Đèn, Quạt, Điều hòa, Cửa tự động).
🌟 Các tính năng chính của hệ thống
1. Bảng điều khiển thời gian thực (Real-time Dashboard)
Giám sát trực quan thông số môi trường như nhiệt độ, độ ẩm, chất lượng không khí, CO2 thông qua các biểu đồ động.
Điều khiển bật/tắt và điều chỉnh trạng thái các thiết bị điện trong nhà. Trạng thái thiết bị được đồng bộ hóa tức thì giữa thiết bị thực tế và giao diện Web qua kênh WebSocket Storm.
2. Trợ lý ảo AI điều khiển giọng nói (Gemini AI Voice Assistant)
Tích hợp mô hình ngôn ngữ lớn Google Gemini AI.
Hỗ trợ nhận diện giọng nói tiếng Việt để xử lý kịch bản điều khiển nhà thông minh rảnh tay hoặc giải đáp các thắc mắc về tình trạng ngôi nhà một cách tự nhiên.
3. Bản đồ không gian tương tác 2D & 3D (Spatial Maps)
Sơ đồ phòng và vị trí lắp đặt thiết bị được trực quan hóa trên bản đồ 2D và 3D.
Người dùng có thể nhấn trực tiếp vào thiết bị trên bản đồ ảo để điều khiển trạng thái nhanh chóng.
4. Giám sát Camera & Cảm biến an ninh chuyên sâu (Security Hub)
Truy xuất luồng hình ảnh trực tiếp (Live Stream) từ mô-đun ESP32-CAM.
Giao diện theo dõi cảm biến an ninh, radar, rò rỉ khói lửa. Các card trạng thái cảm biến tự động nhấp nháy đỏ khi phát hiện nguy hiểm.
Tích hợp popup xem chi tiết luồng log WebSocket của từng cảm biến dưới dạng đồ họa chỉ số (Meters/Gauges) trực quan và dễ hiểu đối với người dùng cuối thay vì xem dữ liệu thô.
5. Hẹn giờ & Lên kịch bản tự động hóa (Automation & Scheduler)
Hỗ trợ tạo kịch bản thiết lập thời gian thực thi lệnh tự động.
2 chế độ hẹn giờ: Hẹn giờ 1 lần (ONCE) và Hặp lại hàng ngày (DAILY). Tiến trình ngầm Backend tự động kiểm tra mỗi phút và gửi lệnh điều khiển chính xác thông qua MQTT.
6. Tích hợp cảnh báo khẩn cấp qua Telegram Bot (Telegram Integration)
Người dùng liên kết tài khoản hệ thống với Telegram Bot của TSmartHome.
Tự động gửi cảnh báo khẩn cấp bằng tiếng Việt khi phát hiện rò rỉ gas, khói lửa hoặc xâm nhập an ninh từ Radar.
Định dạng tin nhắn cảnh báo tối giản, chuyên nghiệp và đầy đủ thông tin: Tên thiết bị, Vị trí (phòng/nhà), trạng thái cảnh báo cụ thể, số liệu ghi nhận và thời điểm xảy ra sự cố.
7. Giao diện cài đặt cấu hình SaaS cao cấp (Account Settings UI)
Thiết kế hiện đại lấy cảm hứng từ các nền tảng cao cấp (Vercel, Shadcn UI).
Hỗ trợ cập nhật thông tin cá nhân, thay đổi ảnh đại diện (avatar tự sinh theo Seed), đổi mật khẩu bảo mật và kết nối/hủy kết nối Telegram Bot trực quan.

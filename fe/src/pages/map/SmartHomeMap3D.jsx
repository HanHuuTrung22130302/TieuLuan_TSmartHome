import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { 
  Thermometer, Camera, DoorClosed, Activity, Flame, 
  Lightbulb, Wind, Lock, Mic, AppWindow, Tv, Sun, Bell, 
  MousePointer2, Blinds // Thêm icon Blinds cho rèm
} from 'lucide-react';

// // DANH SÁCH CẢM BIẾN 3D
// const MOCK_SENSORS = [
//   // 🚪 CỬA CHÍNH 
//   { id: 'c1', name: 'Cửa chính & Smart Lock', type: 'security', room: 'Cửa chính', position: [-4.67, 1.2, 2.84], value: 'Đã khóa', status: 'An toàn', isSimulated: false, icon: DoorClosed },
//   //cửa này sẽ tự đông lock cửa khi cửa ở trang thái đóng,(tại vị trí này sẽ có 2 loại, smart lock là tính năng cửa tự khóa khi đóng cửa, người ở ngoài muốn vô phải dùng chìa hoặc nhập pass, chức năng thứ 2 tại vị trí này là đóng mở chức năng smart lock, nếu tắt smart lock thì dù cửa đóng cũng sẽ không lock cửa)
//   { id: 'c2', name: 'Camera ESP32-S3', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 2.84], value: 'Đang ghi', status: 'Bình thường', isSimulated: false, icon: Camera },
//   // camera quan sát người lạ trước cửa nhà, nếu có người lạ đứng trước cửa sẽ cảnh báo cho người dùng biết, đồng thời ghi lại hình ảnh và gửi thông báo về điện thoại của người dùng, nếu có người quen đứng trước cửa sẽ không cảnh báo mà chỉ ghi lại hình ảnh để người dùng xem lại sau, nếu có người lạ đứng trước cửa quá lâu sẽ tự động gọi điện cho chủ nhà hoặc cảnh sát tùy theo cài đặt của người dùng
//   { id: 'c3', name: 'PIR Cửa chính', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 3.84], value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },
//   // cảm biến này dùng để nhận diện có người đứng trước cửa và gửi thông báo 

//   // 🛋️ PHÒNG KHÁCH + BẾP
//   { id: 'pk1', name: 'Đèn trần trước', type: 'appliance', room: 'Phòng Khách', position: [-5.67, 1.2, 2.84], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
//   { id: 'pk2', name: 'Đèn trần sau', type: 'appliance', room: 'Phòng Khách', position: [-3.67, 1.2, 2.84], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'pk3', name: 'Đèn trần P.Khách', type: 'appliance', room: 'Phòng Khách', position: [-1.79, 1.2, 3.19], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'pk4', name: 'Đèn phòng ăn', type: 'appliance', room: 'Phòng Khách', position: [1.77, 1.2, 3.08], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
//   { id: 'pk5', name: 'Đèn bếp', type: 'appliance', room: 'Bếp', position: [1.86, 1.2, 0.13], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
//   //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn
//   { id: 'pk6', name: 'PIR Khách/Bếp', type: 'security', room: 'Phòng Khách', position: [-0.15, 1.2, 3.18], value: 'Có người', status: 'Cảnh báo', isSimulated: false, icon: Activity },
//   //xây dựng thuật toán giữa servo g90 và hc sr04 để làm logic phát hiện vị trí vât thể lạ(lg1)
//   { id: 'pk7', name: 'DHT22 (Nhiệt/Ẩm)', type: 'environment', room: 'Phòng Khách', position: [0.03, 1.2, -0.06], value: '25°C / 55%', status: 'Bình thường', isSimulated: false, icon: Thermometer },
//   //mô đun này dùng để lấy nhiet do độ ẩm thôi, dùng hết công năng của nó
//   { id: 'pk8', name: 'Khí MQ-135', type: 'environment', room: 'Bếp', position: [-0.77, 1.2, 1.14], value: 'Sạch', status: 'An toàn', isSimulated: false, icon: Wind },
//   //mô đun quản lí không khí, không biêt có phát hiện khí cháy hay không
//   { id: 'pk9', name: 'Cảm biến Lửa', type: 'safety', room: 'Bếp', position: [1.69, 1.2, 1.53], value: 'Không có lửa', status: 'An toàn', isSimulated: false, icon: Flame },
//   //cảm biến phát hiện lửa trong nhà
//   { id: 'pk10', name: 'Cảm biến Âm thanh & Mic', type: 'environment', room: 'Phòng Khách', position: [0.06, 1.2, 4.79], value: '45 dB', status: 'Yên tĩnh', isSimulated: false, icon: Mic },
//   //cái âm thành chắc sẽ dùng để nhận diện tiếng động lạ trong nhà, nếu có tiếng động lạ sẽ cảnh báo cho người dùng biết

//   // 🧭 HÀNH LANG
//   { id: 'hl1', name: 'PIR Hành lang', type: 'security', room: 'Hành Lang', position: [0.14, 1.2, -2.28], value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },
//   //xây dựng thuật toán giữa servo g90 và hc sr04 để làm logic phát hiện vị trí vât thể lạ(lg1)
//   { id: 'hl2', name: 'Đèn hành lang', type: 'appliance', room: 'Hành Lang', position: [0.06, 1.2, -1.45], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn

//   // 🛏️ PHÒNG NGỦ 1
//   { id: 'pn1_1', name: 'Đèn PN1', type: 'appliance', room: 'Phòng Ngủ 1', position: [-2.81, 1.2, -0.42], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'pn1_2', name: 'Lửa PN1', type: 'safety', room: 'Phòng Ngủ 1', position: [-3.28, 1.2, 1.02], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
//   { id: 'pn1_3', name: 'Cửa sổ PN1', type: 'security', room: 'Phòng Ngủ 1', position: [-3.89, 1.2, -1.94], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

//   // 🛏️ PHÒNG NGỦ 2
//   { id: 'pn2_1', name: 'Đèn PN2', type: 'appliance', room: 'Phòng Ngủ 2', position: [-1.85, 1.2, -4.11], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'pn2_2', name: 'Lửa PN2', type: 'safety', room: 'Phòng Ngủ 2', position: [-2.96, 1.2, -3.06], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
//   { id: 'pn2_3', name: 'Cửa sổ PN2', type: 'security', room: 'Phòng Ngủ 2', position: [-1.70, 1.2, -5.52], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

//   // 🛏️ PHÒNG NGỦ 3
//   { id: 'pn3_1', name: 'Đèn PN3', type: 'appliance', room: 'Phòng Ngủ 3', position: [3.06, 1.2, -4.00], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'pn3_2', name: 'Lửa PN3', type: 'safety', room: 'Phòng Ngủ 3', position: [1.84, 1.2, -3.96], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
//   { id: 'pn3_3', name: 'Cửa sổ PN3', type: 'security', room: 'Phòng Ngủ 3', position: [4.65, 1.2, -3.58], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },
//   //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn
//   //tất cả cảm biến lửa đều dùng cho phát hiện lửa, nhưng ngoài ra vẫn cho phép người dùng tắt tất cả module cảm biến lửa
//   //tất cả cửa sổ đều có 2 chức năng, hiển thị trạng thái hiện tại của cửa sổ và cho phép người dùng đóng mở từng vị trí cửa sổ

//   // 🌿 BAN CÔNG
//   { id: 'bc1_1', name: 'Cửa Ban công 1', type: 'security', room: 'Ban Công 1', position: [3.56, 1.2, 2.9], value: 'Khóa', status: 'An toàn', isSimulated: true, icon: DoorClosed },
//   { id: 'bc1_2', name: 'Đèn Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [4.61, 1.2, 3.44], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'bc1_3', name: 'Rèm Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [3.56, 1.2, 3.64], value: 'Đang mở (50%)', status: 'Hoạt động', isSimulated: true, icon: Blinds },
  
//   { id: 'bc2_1', name: 'Cửa Ban công 2', type: 'security', room: 'Ban Công 2', position: [4.54, 1.2, -0.40], value: 'Mở', status: 'Cảnh báo', isSimulated: true, icon: DoorClosed },
//   { id: 'bc2_2', name: 'Đèn Ban công 2', type: 'appliance', room: 'Ban Công 2', position: [4.21, 1.2, -0.96], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn
//   //tất cả cửa sổ đều có 2 chức năng, hiển thị trạng thái hiện tại của cửa sổ và cho phép người dùng đóng mở từng vị trí cửa sổ
//   //cửa ban công 2 cũng như đèn, đêu có hiện trị trạng thái và cho phép người dùng đón mở rèm


//   // 🚿 NHÀ VỆ SINH
//   { id: 'wc1', name: 'Đèn WC 1', type: 'appliance', room: 'WC 1', position: [4.74, 1.2, 0.41], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'wc2', name: 'Đèn WC 2', type: 'appliance', room: 'WC 2', position: [2.13, 1.2, -1.60], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   { id: 'wc3', name: 'Đèn WC 3', type: 'appliance', room: 'WC 3', position: [0.64, 1.2, -4.46], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
//   //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn

//   // ⚡ TOÀN HỆ THỐNG (GLOBAL)
//   { id: 'gl1', name: 'Cảm biến TV', type: 'appliance', room: 'Toàn hệ thống', position: [-1.70, 1.2, 4.74], value: 'TV Tắt', status: 'Bình thường', isSimulated: false, icon: Tv },
//   //nói là cảm biến tivi chứ thực ra cũng là relay để bật tắt tivi thôi
//   { id: 'gl2', name: 'Cảm biến Ánh sáng', type: 'environment', room: 'Toàn hệ thống', position: [1.16, 1.2, 4.79], value: 'Sáng', status: 'Bình thường', isSimulated: false, icon: Sun },
//   //cảm biến ánh sáng sẽ dùng để nhận diện ánh sáng trong nhà, nếu trời tối sẽ bật đèn, nếu trời sáng sẽ tắt đèn,  cho phép người dùng bật tắt cảm biến này
//   { id: 'gl3', name: 'Còi Buzzer', type: 'safety', room: 'Toàn hệ thống', position: [-3.13, 1.2, 3.92], value: 'Im lặng', status: 'Sẵn sàng', isSimulated: false, icon: Bell },
//   //chắc dùng còi thông báo khi có cháy hoặc cảm biến pir phát hiện có người
//   { id: 'gl4', name: 'Camera AI Toàn Cảnh', type: 'security', room: 'Toàn hệ thống', position: [3.32, 2.2, 4.75], value: 'Đang quét', status: 'Hoạt động', isSimulated: false, icon: Camera },
//   //thay thế vị trí camera esp32 s3, chỗ này tôi thực sự dùng esp32 s3 có cam để lấy vedeo
// ];

// DANH SÁCH CẢM BIẾN 3D
const MOCK_SENSORS = [
  // 🚪 CỬA CHÍNH 
  { id: 'entrance_door_smartlock', name: 'Cửa chính & Smart Lock', type: 'security', room: 'Cửa chính', position: [-4.67, 1.2, 2.84], value: 'Đã khóa', status: 'An toàn', isSimulated: false, icon: DoorClosed },
  //cửa này sẽ tự đông lock cửa khi cửa ở trang thái đóng,(tại vị trí này sẽ có 2 loại, smart lock là tính năng cửa tự khóa khi đóng cửa, người ở ngoài muốn vô phải dùng chìa hoặc nhập pass, chức năng thứ 2 tại vị trí này là đóng mở chức năng smart lock, nếu tắt smart lock thì dù cửa đóng cũng sẽ không lock cửa)
  { id: 'entrance_camera_s3', name: 'Camera ESP32-S3', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 2.84], value: 'Đang ghi', status: 'Bình thường', isSimulated: false, icon: Camera },
  // camera quan sát người lạ trước cửa nhà, nếu có người lạ đứng trước cửa sẽ cảnh báo cho người dùng biết, đồng thời ghi lại hình ảnh và gửi thông báo về điện thoại của người dùng...
  { id: 'entrance_sensor_pir', name: 'PIR Cửa chính', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 3.84], value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },
  // cảm biến này dùng để nhận diện có người đứng trước cửa và gửi thông báo 

  // 🛋️ PHÒNG KHÁCH + BẾP
  { id: 'livingroom_light_front', name: 'Đèn trần trước', type: 'appliance', room: 'Phòng Khách', position: [-5.67, 1.2, 2.84], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_back', name: 'Đèn trần sau', type: 'appliance', room: 'Phòng Khách', position: [-3.67, 1.2, 2.84], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_ceiling', name: 'Đèn trần P.Khách', type: 'appliance', room: 'Phòng Khách', position: [-1.79, 1.2, 3.19], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_dining', name: 'Đèn phòng ăn', type: 'appliance', room: 'Phòng Khách', position: [1.77, 1.2, 3.08], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'kitchen_light_main', name: 'Đèn bếp', type: 'appliance', room: 'Bếp', position: [1.86, 1.2, 0.13], value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  //tất cả đèn đều có 2 chức năng, hiển thị trạng thái hiện tại của đèn và cho phép người dùng bật tắt từng vị trí đèn
  { id: 'livingroom_sensor_pir', name: 'PIR Khách/Bếp', type: 'security', room: 'Phòng Khách', position: [-0.15, 1.2, 3.18], value: 'Có người', status: 'Cảnh báo', isSimulated: false, icon: Activity },
  //xây dựng thuật toán giữa servo g90 và hc sr04 để làm logic phát hiện vị trí vât thể lạ(lg1) -> Đã xử lý trong ESP32
  { id: 'livingroom_sensor_dht22', name: 'DHT22 (Nhiệt/Ẩm)', type: 'environment', room: 'Phòng Khách', position: [0.03, 1.2, -0.06], value: '25°C / 55%', status: 'Bình thường', isSimulated: false, icon: Thermometer },
  //mô đun này dùng để lấy nhiet do độ ẩm thôi, dùng hết công năng của nó
  { id: 'kitchen_sensor_mq135', name: 'Khí MQ-135', type: 'environment', room: 'Bếp', position: [-0.77, 1.2, 1.14], value: 'Sạch', status: 'An toàn', isSimulated: false, icon: Wind },
  //mô đun quản lí không khí
  { id: 'kitchen_sensor_flame', name: 'Cảm biến Lửa', type: 'safety', room: 'Bếp', position: [1.69, 1.2, 1.53], value: 'Không có lửa', status: 'An toàn', isSimulated: false, icon: Flame },
  //cảm biến phát hiện lửa trong nhà
  { id: 'livingroom_sensor_audio', name: 'Cảm biến Âm thanh & Mic', type: 'environment', room: 'Phòng Khách', position: [0.06, 1.2, 4.79], value: '45 dB', status: 'Yên tĩnh', isSimulated: false, icon: Mic },
  //cái âm thanh chắc sẽ dùng để nhận diện tiếng động lạ trong nhà...

  // 🧭 HÀNH LANG
  { id: 'hallway_sensor_pir', name: 'PIR Hành lang', type: 'security', room: 'Hành Lang', position: [0.14, 1.2, -2.28], value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },
  //xây dựng thuật toán giữa servo g90 và hc sr04 để làm logic phát hiện vị trí vât thể lạ
  { id: 'hallway_light_main', name: 'Đèn hành lang', type: 'appliance', room: 'Hành Lang', position: [0.06, 1.2, -1.45], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  //tất cả đèn đều có 2 chức năng...

  // 🛏️ PHÒNG NGỦ 1
  { id: 'bedroom1_light_main', name: 'Đèn PN1', type: 'appliance', room: 'Phòng Ngủ 1', position: [-2.81, 1.2, -0.42], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom1_sensor_flame', name: 'Lửa PN1', type: 'safety', room: 'Phòng Ngủ 1', position: [-3.28, 1.2, 1.02], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom1_window_main', name: 'Cửa sổ PN1', type: 'security', room: 'Phòng Ngủ 1', position: [-3.89, 1.2, -1.94], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

  // 🛏️ PHÒNG NGỦ 2
  { id: 'bedroom2_light_main', name: 'Đèn PN2', type: 'appliance', room: 'Phòng Ngủ 2', position: [-1.85, 1.2, -4.11], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom2_sensor_flame', name: 'Lửa PN2', type: 'safety', room: 'Phòng Ngủ 2', position: [-2.96, 1.2, -3.06], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom2_window_main', name: 'Cửa sổ PN2', type: 'security', room: 'Phòng Ngủ 2', position: [-1.70, 1.2, -5.52], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

  // 🛏️ PHÒNG NGỦ 3
  { id: 'bedroom3_light_main', name: 'Đèn PN3', type: 'appliance', room: 'Phòng Ngủ 3', position: [3.06, 1.2, -4.00], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom3_sensor_flame', name: 'Lửa PN3', type: 'safety', room: 'Phòng Ngủ 3', position: [1.84, 1.2, -3.96], value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom3_window_main', name: 'Cửa sổ PN3', type: 'security', room: 'Phòng Ngủ 3', position: [4.65, 1.2, -3.58], value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },
  //tất cả đèn đều có 2 chức năng...

  // 🌿 BAN CÔNG
  { id: 'balcony1_door_main', name: 'Cửa Ban công 1', type: 'security', room: 'Ban Công 1', position: [3.56, 1.2, 2.9], value: 'Khóa', status: 'An toàn', isSimulated: true, icon: DoorClosed },
  { id: 'balcony1_light_main', name: 'Đèn Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [4.61, 1.2, 3.44], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'balcony1_curtain_main', name: 'Rèm Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [3.56, 1.2, 3.64], value: 'Đang mở (50%)', status: 'Hoạt động', isSimulated: true, icon: Blinds },
  
  { id: 'balcony2_door_main', name: 'Cửa Ban công 2', type: 'security', room: 'Ban Công 2', position: [4.54, 1.2, -0.40], value: 'Mở', status: 'Cảnh báo', isSimulated: true, icon: DoorClosed },
  { id: 'balcony2_light_main', name: 'Đèn Ban công 2', type: 'appliance', room: 'Ban Công 2', position: [4.21, 1.2, -0.96], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  // 🚿 NHÀ VỆ SINH
  { id: 'wc1_light_main', name: 'Đèn WC 1', type: 'appliance', room: 'WC 1', position: [4.74, 1.2, 0.41], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc2_light_main', name: 'Đèn WC 2', type: 'appliance', room: 'WC 2', position: [2.13, 1.2, -1.60], value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc3_light_main', name: 'Đèn WC 3', type: 'appliance', room: 'WC 3', position: [0.64, 1.2, -4.46], value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  // ⚡ TOÀN HỆ THỐNG (GLOBAL)
  { id: 'global_appliance_tv', name: 'Cảm biến TV', type: 'appliance', room: 'Toàn hệ thống', position: [-1.70, 1.2, 4.74], value: 'TV Tắt', status: 'Bình thường', isSimulated: false, icon: Tv },
  { id: 'global_sensor_light', name: 'Cảm biến Ánh sáng', type: 'environment', room: 'Toàn hệ thống', position: [1.16, 1.2, 4.79], value: 'Sáng', status: 'Bình thường', isSimulated: false, icon: Sun },
  { id: 'global_safety_buzzer', name: 'Còi Buzzer', type: 'safety', room: 'Toàn hệ thống', position: [-3.13, 1.2, 3.92], value: 'Im lặng', status: 'Sẵn sàng', isSimulated: false, icon: Bell },
  { id: 'global_camera_ai', name: 'Camera AI Toàn Cảnh', type: 'security', room: 'Toàn hệ thống', position: [3.32, 2.2, 4.75], value: 'Đang quét', status: 'Hoạt động', isSimulated: false, icon: Camera },
];

function HouseModel({ onModelClick }) {
  const { scene } = useGLTF('/web.glb');
  return (
    <primitive 
      object={scene} 
      onPointerDown={(e) => {
        e.stopPropagation();
        onModelClick(e.point);
      }}
    />
  );
}

export default function SmartHomeMap3D() {
  const [clickCoords, setClickCoords] = useState(null);
  const [sensorHeight, setSensorHeight] = useState('1.2');

  const handleGetCoordinates = (point) => {
    setClickCoords({ x: point.x.toFixed(2), z: point.z.toFixed(2) });
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'environment': return 'bg-sky-500';
      case 'security': return 'bg-rose-500';
      case 'safety': return 'bg-amber-500';
      case 'appliance': return 'bg-violet-500'; // Thêm màu cho rèm/thiết bị
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
      <div className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-blue-500/30 text-white max-w-sm pointer-events-auto shadow-2xl">
        <h3 className="font-bold text-sm mb-3 text-blue-400 flex items-center gap-2">
          <MousePointer2 className="w-4 h-4" /> Trợ lý Tọa độ 3D
        </h3>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setSensorHeight('1.2')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${sensorHeight === '1.2' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>Y = 1.2</button>
          <button onClick={() => setSensorHeight('2.2')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${sensorHeight === '2.2' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>Y = 2.2</button>
        </div>
        <div className="bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-[15px] font-bold text-emerald-400 text-center select-all cursor-copy">
          {clickCoords ? `[${clickCoords.x}, ${sensorHeight}, ${clickCoords.z}]` : '[x, y, z]'}
        </div>
      </div>

      <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse">Đang tải...</div></Html>}>
          <HouseModel onModelClick={handleGetCoordinates} />
          {MOCK_SENSORS.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <Html key={sensor.id} position={sensor.position} center zIndexRange={[100, 0]}>
                <div className="relative group cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${getTypeColor(sensor.type)}`}></div>
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-xl border-2 border-white/80 ${getTypeColor(sensor.type)}`}>
                    <Icon className="w-4 h-4 drop-shadow-md" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900/95 backdrop-blur text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-2xl pointer-events-none">
                    {sensor.name}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-l border-slate-700 rotate-45"></div>
                  </div>
                </div>
              </Html>
            );
          })}
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </Suspense>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} maxDistance={40} />
      </Canvas>
    </div>
  );
}
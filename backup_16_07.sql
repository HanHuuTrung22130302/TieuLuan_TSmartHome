/*
 Navicat Premium Dump SQL

 Source Server         : TSmartHomeDB
 Source Server Type    : PostgreSQL
 Source Server Version : 180003 (180003)
 Source Host           : localhost:5432
 Source Catalog        : tsmarthome_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 180003 (180003)
 File Encoding         : 65001

 Date: 16/07/2026 17:00:30
*/


-- ----------------------------
-- Sequence structure for device_logs_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."device_logs_id_seq";
CREATE SEQUENCE "public"."device_logs_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for mqtt_messages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."mqtt_messages_id_seq";
CREATE SEQUENCE "public"."mqtt_messages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sensor_data_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."sensor_data_id_seq";
CREATE SEQUENCE "public"."sensor_data_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for assistant_chats
-- ----------------------------
DROP TABLE IF EXISTS "public"."assistant_chats";
CREATE TABLE "public"."assistant_chats" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_assistant" bool DEFAULT false,
  "action_type" varchar(50) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of assistant_chats
-- ----------------------------
INSERT INTO "public"."assistant_chats" VALUES ('abe32b2a-5709-4c12-8988-5dec899ade1b', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bat toan bo thbiet bi dien', 'f', 'USER_REQUEST', '2026-06-18 08:18:56.528234');
INSERT INTO "public"."assistant_chats" VALUES ('e9b96b1a-8b26-42f6-9320-f020d8535111', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: Gemini too busy). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-18 08:19:08.722852');
INSERT INTO "public"."assistant_chats" VALUES ('9d63ae2b-7144-4be0-8f8b-be2e2ffe2caa', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ thiết bị điện', 'f', 'USER_REQUEST', '2026-06-18 08:19:30.784268');
INSERT INTO "public"."assistant_chats" VALUES ('bb6da31e-606f-4262-8612-45121b9cf8c7', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: Gemini too busy). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-18 08:19:35.995829');
INSERT INTO "public"."assistant_chats" VALUES ('a54260e8-f843-4ec2-81fb-6b3615c47286', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi chuẩn bị về nhà', 'f', 'USER_REQUEST', '2026-06-19 16:59:03.805786');
INSERT INTO "public"."assistant_chats" VALUES ('700ecca6-7810-443f-92c5-0e38935c1f2e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: Gemini too busy). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-19 16:59:11.663054');
INSERT INTO "public"."assistant_chats" VALUES ('e79861b3-e7dd-4473-9e99-9101235516ca', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi chuẩn bị về tới nhà bật điện', 'f', 'USER_REQUEST', '2026-06-19 16:59:26.201313');
INSERT INTO "public"."assistant_chats" VALUES ('79e4f643-fcca-4087-a2bc-fec256d30979', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: Gemini too busy). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-19 16:59:32.323633');
INSERT INTO "public"."assistant_chats" VALUES ('9e1eb83c-0d3e-4fae-83d1-9d9db7aee567', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về bật điện giúp tôi', 'f', 'USER_REQUEST', '2026-06-19 17:33:19.869159');
INSERT INTO "public"."assistant_chats" VALUES ('b08e6ad4-1fa4-477e-a4e1-431ee9455216', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: HTTP 401). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-19 17:33:20.01177');
INSERT INTO "public"."assistant_chats" VALUES ('0ab85b82-e6a3-4182-b494-e3f7e7b59ece', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về bật điện giúp tôi', 'f', 'USER_REQUEST', '2026-06-19 17:33:30.333558');
INSERT INTO "public"."assistant_chats" VALUES ('71439542-0a0e-4b5c-abe5-462928902e01', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: HTTP 401). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-19 17:33:30.379783');
INSERT INTO "public"."assistant_chats" VALUES ('40f4f2de-213a-47f6-8a16-05bcbee82f0f', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về bật điện giúp tôi', 'f', 'USER_REQUEST', '2026-06-19 17:42:34.676848');
INSERT INTO "public"."assistant_chats" VALUES ('89f98183-46bc-485d-aeea-136b096e776e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hiện tại hệ thống AI của TSmartHome đang tạm thời quá tải hoặc hết lượt yêu cầu (Lỗi: Gemini too busy). Bạn vui lòng thử lại sau vài giây nhé!', 't', 'GEMINI_BUSY', '2026-06-19 17:43:08.765137');
INSERT INTO "public"."assistant_chats" VALUES ('b20c112a-2bda-40a5-8f6a-5c5daababde9', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bat toan bo thiet bi dien', 'f', 'USER_REQUEST', '2026-06-19 18:14:26.342534');
INSERT INTO "public"."assistant_chats" VALUES ('5d69ec74-b6fc-47c8-a6ee-1b11605b3536', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, em đang tiến hành bật toàn bộ các thiết bị điện trong nhà cho mình rồi nhé, bao gồm tất cả các bóng đèn và rèm cửa ban công.', 't', 'CONTROL_DEVICE', '2026-06-19 18:15:25.223322');
INSERT INTO "public"."assistant_chats" VALUES ('9cd6a476-cbd7-4616-81da-f13ad135fdbd', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật kịch bản chống trộm', 'f', 'USER_REQUEST', '2026-06-19 18:16:12.066333');
INSERT INTO "public"."assistant_chats" VALUES ('e1485fa1-6366-4e6d-b33f-e6832eb684b4', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, em đã kích hoạt kịch bản chống trộm. Hệ thống đã bật các camera giám sát (Camera ESP32-S3 và Camera AI Toàn Cảnh), đồng thời các cảm biến chuyển động (PIR cửa chính, PIR phòng khách) cũng đang hoạt động để sẵn sàng phát hiện đột nhập.', 't', 'CONTROL_DEVICE', '2026-06-19 18:17:00.827462');
INSERT INTO "public"."assistant_chats" VALUES ('c02d43aa-8a47-496c-8db2-7bc6394ffde7', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi đi làm đây', 'f', 'USER_REQUEST', '2026-06-20 01:04:16.646003');
INSERT INTO "public"."assistant_chats" VALUES ('ec4b3ba7-95c0-4a9a-97f8-85d3872b7f44', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tạm biệt bạn, chúc bạn một ngày làm việc hiệu quả và vui vẻ! Tôi đã tắt toàn bộ đèn và đóng rèm ban công để đảm bảo an toàn và tiết kiệm điện rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-20 01:04:23.537534');
INSERT INTO "public"."assistant_chats" VALUES ('96d49cf3-5c02-4c9a-97af-733387cff6b3', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi chuẩn bị về tới nhà rồi, bật điện đi', 'f', 'USER_REQUEST', '2026-06-20 01:05:03.483728');
INSERT INTO "public"."assistant_chats" VALUES ('a6086361-2b10-41ba-8f0f-e29f354808a2', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào mừng bạn về nhà! Tôi đã bật đèn trần phòng khách, đèn hành lang, đèn bếp và mở rèm ban công để không gian sẵn sàng đón bạn.', 't', 'CONTROL_DEVICE', '2026-06-20 01:05:56.58097');
INSERT INTO "public"."assistant_chats" VALUES ('4a6f2bcb-6d6c-4402-95d9-2d710fcc29b8', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tôi đi ngủ đây', 'f', 'USER_REQUEST', '2026-06-20 01:14:21.920315');
INSERT INTO "public"."assistant_chats" VALUES ('8cb5eafa-2e37-43ab-b2ed-4c3760d4b867', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chúc bạn ngủ ngon! Tôi đã tắt toàn bộ đèn và đóng rèm ban công lại giúp bạn rồi.', 't', 'CONTROL_DEVICE', '2026-06-20 01:14:38.181356');
INSERT INTO "public"."assistant_chats" VALUES ('4a1e3239-59c2-4ec2-8b25-36760c9b0a4c', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'chào buổi sáng', 'f', 'USER_REQUEST', '2026-06-20 01:15:48.177398');
INSERT INTO "public"."assistant_chats" VALUES ('a71c8ab8-8fe1-4033-83bf-e1083d6f214d', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào buổi sáng! Tôi đã mở rèm ban công 1 để đón ánh nắng ban mai vào nhà giúp bạn rồi.', 't', 'CONTROL_DEVICE', '2026-06-20 01:15:52.196926');
INSERT INTO "public"."assistant_chats" VALUES ('ed54912d-fe27-4ea0-87c7-3109d40ed71c', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Trời tối rồi', 'f', 'USER_REQUEST', '2026-06-20 01:24:44.029647');
INSERT INTO "public"."assistant_chats" VALUES ('27cf26f8-166e-486e-bcc5-6fb97b38f5da', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Trời đã tối rồi, tôi sẽ bật đèn trần phòng khách, đèn hành lang, đèn bếp và mở rèm ban công giúp ngôi nhà sáng sủa và ấm cúng hơn nhé!', 't', 'CONTROL_DEVICE', '2026-06-20 01:25:49.773708');
INSERT INTO "public"."assistant_chats" VALUES ('c8724c5c-7aa1-422d-8a27-7a7eabc771a2', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Mở tất cả thiết bị điện', 'f', 'USER_REQUEST', '2026-06-20 17:31:20.046736');
INSERT INTO "public"."assistant_chats" VALUES ('fa316104-d6b5-48ba-bb96-29f565b794ae', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tôi đã bật toàn bộ các thiết bị điện bao gồm Đèn trần trước, Đèn trần phòng khách, Đèn phòng ăn, Đèn trần sau, Đèn hành lang, Đèn bếp, Đèn ban công và mở rèm ban công cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-20 17:31:39.978773');
INSERT INTO "public"."assistant_chats" VALUES ('157dbaba-bc49-4c3a-887e-9860fc8c62bc', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi đi làm đây, tắt điện giúp tôi', 'f', 'USER_REQUEST', '2026-06-20 17:50:04.69383');
INSERT INTO "public"."assistant_chats" VALUES ('8c2d6d53-949c-4d18-b866-6243d94e3c8c', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chúc bạn một ngày làm việc thật hiệu quả! Tôi đã tắt toàn bộ hệ thống đèn và đóng rèm ban công lại cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-20 17:51:43.920778');
INSERT INTO "public"."assistant_chats" VALUES ('2fe90257-b00b-4c6c-b3a6-aea6fe51cb8a', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà bật điện cho tôi', 'f', 'USER_REQUEST', '2026-06-21 10:53:44.31254');
INSERT INTO "public"."assistant_chats" VALUES ('1c914036-f427-424b-b0de-525cda543fb3', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào mừng bạn về nhà! Tôi đã bật hệ thống đèn phòng khách, phòng ăn, đèn bếp, đèn hành lang và mở sẵn rèm ban công để đón bạn rồi.', 't', 'CONTROL_DEVICE', '2026-06-21 10:53:51.680476');
INSERT INTO "public"."assistant_chats" VALUES ('fdb82d08-9de1-4ae7-b649-b3214441a2fd', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tóm tắt sự kiện ở nhà trong ngày hôm nay giúp tôi', 'f', 'USER_REQUEST', '2026-06-21 12:55:12.655613');
INSERT INTO "public"."assistant_chats" VALUES ('f98956e7-a508-44aa-a689-94848eb51cbb', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hệ thống ghi nhận một số sự kiện đáng chú ý tại nhà trong ngày hôm nay:

1. Cảnh báo an ninh: Các cảm biến PIR và Radar ở cửa chính, phòng khách, hành lang và bếp liên tục phát hiện chuyển động (trạng thái Cảnh báo). Camera lối vào cũng ghi nhận có hình ảnh phát hiện.
2. Cảnh báo môi trường: Cảm biến khí ga/khí thải MQ-135 ở phòng bếp hiện đang báo mức ''Nguy hiểm''. Rất may là cảm biến lửa vẫn báo ''An toàn''. Bạn hãy kiểm tra ngay khu vực bếp để đảm bảo an toàn nhé!', 't', 'GEMINI_CHAT', '2026-06-21 12:55:18.916722');
INSERT INTO "public"."assistant_chats" VALUES ('2a05001b-d746-4845-9c97-8f1708cc01bd', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bat toan bo thiet bi dien', 'f', 'USER_REQUEST', '2026-06-21 22:32:08.592334');
INSERT INTO "public"."assistant_chats" VALUES ('bb52578f-9fa4-4908-a33e-29cdb6704f92', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tôi đã bật toàn bộ các thiết bị điện trong nhà cho bạn, bao gồm các đèn phòng khách, phòng ăn, hành lang, bếp, đèn ban công và đã mở rèm ban công.', 't', 'CONTROL_DEVICE', '2026-06-21 22:32:15.429961');
INSERT INTO "public"."assistant_chats" VALUES ('2f237ec1-65a5-4b4f-b1fc-99dd41eb754a', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ thiết bị điện trong nhà', 'f', 'USER_REQUEST', '2026-06-21 22:33:36.733087');
INSERT INTO "public"."assistant_chats" VALUES ('0684eaa7-159c-4184-846d-c7e4d5a4215d', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang bật toàn bộ thiết bị điện bao gồm các đèn (đèn trần trước, đèn phòng ăn, đèn trần sau, đèn trần phòng khách, đèn ban công, đèn hành lang, đèn bếp) và đã mở rèm ban công cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-21 22:33:43.96944');
INSERT INTO "public"."assistant_chats" VALUES ('20c378e4-5771-4529-819a-f95fa90e4cad', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ thiế bị điện', 'f', 'USER_REQUEST', '2026-06-21 22:39:47.796197');
INSERT INTO "public"."assistant_chats" VALUES ('3269ebd8-25ef-411d-a002-6aed61f14a09', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang tiến hành bật tất cả các thiết bị điện trong nhà bao gồm các đèn chiếu sáng và mở rèm ban công cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-21 22:39:55.444764');
INSERT INTO "public"."assistant_chats" VALUES ('01d475ab-83f6-4a56-ae4f-930023b80a04', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ thiết bị điện', 'f', 'USER_REQUEST', '2026-06-21 23:07:22.50793');
INSERT INTO "public"."assistant_chats" VALUES ('6d2fd6a7-6ecc-4623-ad41-cf9ff28e1526', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang tiến hành bật tất cả các thiết bị điện bao gồm các đèn chiếu sáng và mở rèm ban công cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-06-21 23:07:29.32826');
INSERT INTO "public"."assistant_chats" VALUES ('2dd2656f-1a38-4e71-9079-a6c0aaefda83', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ thiết bị điện', 'f', 'USER_REQUEST', '2026-06-22 03:54:46.882567');
INSERT INTO "public"."assistant_chats" VALUES ('7379a30e-0358-4eaa-987e-753bae9b3c19', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang tiến hành bật toàn bộ thiết bị điện bao gồm tất cả các đèn và mở rèm ban công cho bạn nhé.', 't', 'CONTROL_DEVICE', '2026-06-22 03:54:53.347008');
INSERT INTO "public"."assistant_chats" VALUES ('8e62b8c9-61b5-48b1-b314-4c81fd195995', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi đi làm đây tắt điện giúp tôi', 'f', 'USER_REQUEST', '2026-06-22 17:29:43.794961');
INSERT INTO "public"."assistant_chats" VALUES ('bc2b9764-684a-40e4-a3b7-eff57162348e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào bạn, tôi đã tắt toàn bộ hệ thống đèn và đóng rèm ban công để bạn yên tâm đi làm rồi nhé. Chúc bạn một ngày làm việc hiệu quả và vui vẻ!', 't', 'CONTROL_DEVICE', '2026-06-22 17:29:50.946316');
INSERT INTO "public"."assistant_chats" VALUES ('87fbbf0d-be1d-4bfd-975d-ac0b2cbf1806', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bật toàn bộ đèn', 'f', 'USER_REQUEST', '2026-07-01 23:29:13.497473');
INSERT INTO "public"."assistant_chats" VALUES ('58720892-94c2-4bc1-b07d-3e4a7ac1ee56', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang bật toàn bộ hệ thống đèn trong nhà cho bạn rồi nhé (Đèn trần trước, Đèn phòng ăn, Đèn trần sau, Đèn trần phòng khách, Đèn ban công, Đèn bếp và Đèn hành lang).', 't', 'CONTROL_DEVICE', '2026-07-01 23:29:21.486881');
INSERT INTO "public"."assistant_chats" VALUES ('e0870178-76a0-4c7c-a6ae-9627e0acd1c4', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'mở rèm giúp tôi luôn', 'f', 'USER_REQUEST', '2026-07-01 23:29:30.302353');
INSERT INTO "public"."assistant_chats" VALUES ('f5bf0fa2-dea6-48e3-9974-ba885b924c06', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang tiến hành mở rèm ban công cho bạn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-07-01 23:29:37.829003');
INSERT INTO "public"."assistant_chats" VALUES ('372651f3-22f9-499c-bc53-b0e91fdaaba1', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bạt toàn bo thiet bi dien cho toi', 'f', 'USER_REQUEST', '2026-07-05 02:14:58.162997');
INSERT INTO "public"."assistant_chats" VALUES ('80671513-cffa-4d94-ac08-be8efdadd5bf', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dạ, tôi đang tiến hành bật toàn bộ thiết bị điện trong nhà bao gồm rèm ban công và tất cả các hệ thống đèn rồi nhé.', 't', 'CONTROL_DEVICE', '2026-07-05 02:15:06.205144');
INSERT INTO "public"."assistant_chats" VALUES ('b4cbe52a-4062-4bd0-ad92-7d3e0e456489', 'b6ac1c1b-bfa3-4a4c-a157-343b2eb5f1ea', 'List all users', 'f', 'USER_REQUEST', '2026-07-07 16:33:13.428726');
INSERT INTO "public"."assistant_chats" VALUES ('88b41c91-58ab-4e6f-afc9-841a5e2713e5', 'b6ac1c1b-bfa3-4a4c-a157-343b2eb5f1ea', 'Xin lỗi, tôi là trợ lý ảo hỗ trợ điều khiển nhà thông minh TSmartHome. Tôi không có quyền truy cập hoặc quản lý danh sách người dùng của hệ thống. Bạn có cần tôi giúp kiểm tra hay điều khiển thiết bị nào trong nhà không?', 't', 'GEMINI_CHAT', '2026-07-07 16:33:43.149476');
INSERT INTO "public"."assistant_chats" VALUES ('f591e53b-0fa5-4807-97b3-02d1d3214004', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về bật điện cho tôi', 'f', 'USER_REQUEST', '2026-07-08 23:30:32.068654');
INSERT INTO "public"."assistant_chats" VALUES ('9ba63fd2-9449-41c3-b2fe-fc2c4bdaf217', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Bạn có thể nói rõ hơn là muốn bật thiết bị nào không? Ví dụ: "bật đèn ngủ" hoặc "kích hoạt kịch bản buổi sáng".', 't', 'GEMINI_CHAT', '2026-07-08 23:31:37.249112');
INSERT INTO "public"."assistant_chats" VALUES ('16d822d1-4bd3-4e18-b3cc-db953ae3f893', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà', 'f', 'USER_REQUEST', '2026-07-08 23:39:56.429679');
INSERT INTO "public"."assistant_chats" VALUES ('ecc3400e-3466-42be-9ceb-5c674e088764', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào bạn! Bạn đã về nhà chưa? Tôi ở đây để hỗ trợ bạn. Bạn cần gì không ạ? (Ví dụ: "bật đèn ngủ", "kích hoạt kịch bản buổi sáng")', 't', 'GEMINI_CHAT', '2026-07-08 23:41:07.607463');
INSERT INTO "public"."assistant_chats" VALUES ('a5d9072c-e860-415c-8c05-9b5c3a1ba24e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà bật điện cho tôi', 'f', 'USER_REQUEST', '2026-07-08 23:42:14.745836');
INSERT INTO "public"."assistant_chats" VALUES ('b79b7a90-0c8e-4e85-b76e-d4d92faa58f7', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào bạn! Bạn có thể nói rõ hơn là muốn bật thiết bị nào không (ví dụ: đèn, quạt,..)? Nếu bạn muốn kích hoạt kịch bản tự động hóa (như "kịch bản buổi sáng"), hãy dùng lệnh cụ thể nhé!', 't', 'GEMINI_CHAT', '2026-07-08 23:43:20.302287');
INSERT INTO "public"."assistant_chats" VALUES ('8ee56b01-8476-4641-9642-1fdf614eea57', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà, bật diện sẵn giúp tôi nha', 'f', 'USER_REQUEST', '2026-07-08 23:43:57.576719');
INSERT INTO "public"."assistant_chats" VALUES ('b386a269-941b-4ba6-814e-05fb821e1e8c', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Chào bạn! Bạn có thể thử nói "kích hoạt kịch bản buổi sáng" hoặc "bật đèn ngủ" để hệ thống tự động hóa giúp bạn. Chúc bạn về nhà an toàn!', 't', 'GEMINI_CHAT', '2026-07-08 23:44:40.38201');
INSERT INTO "public"."assistant_chats" VALUES ('32e709d7-0f92-4e84-a5a3-5688a841a370', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà, bật diện sẵn giúp tôi nha', 'f', 'USER_REQUEST', '2026-07-08 23:56:34.346637');
INSERT INTO "public"."assistant_chats" VALUES ('3ce8292f-bdb0-4d6b-bb8b-55108ce3c226', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Được rồi, đang bật đèn cho bạn. Vui lòng kiểm tra xem có cần điều chỉnh gì thêm không nhé! Nếu cần bật/tắt cụ thể, hãy dùng câu lệnh rõ ràng hơn nha. 😊', 't', 'GEMINI_CHAT', '2026-07-08 23:57:33.13923');
INSERT INTO "public"."assistant_chats" VALUES ('4c6c77dd-a402-4160-be64-4f3215467685', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà, bật diện sẵn giúp tôi nha', 'f', 'USER_REQUEST', '2026-07-08 23:58:10.425115');
INSERT INTO "public"."assistant_chats" VALUES ('7f518e7f-e6d4-4d52-b3b2-d835cd22bfa4', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Bạn có muốn bật đèn ngủ hay kích hoạt kịch bản "buổi sáng" khi về nhà không? Mình có thể giúp bạn điều chỉnh theo yêu cầu nhé! 😊', 't', 'GEMINI_CHAT', '2026-07-08 23:58:48.826621');
INSERT INTO "public"."assistant_chats" VALUES ('a7f4ba37-5ef4-4316-81cd-321f08b1b83e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà, bật diện sẵn giúp tôi nha', 'f', 'USER_REQUEST', '2026-07-08 23:59:51.11027');
INSERT INTO "public"."assistant_chats" VALUES ('893298d4-f165-45ee-90cd-e2c712efce44', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tôi không thể điều khiển trực tiếp thiết bị, bạn vui lòng sử dụng câu lệnh rõ ràng hơn như "bật đèn ngủ" hoặc kích hoạt kịch bản "buổi sáng" để hệ thống thực hiện nhé!', 't', 'GEMINI_CHAT', '2026-07-09 00:00:31.549424');
INSERT INTO "public"."assistant_chats" VALUES ('b1943300-d1ad-4cdb-a04b-5a429e051973', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà, bật diện sẵn giúp tôi nha', 'f', 'USER_REQUEST', '2026-07-09 00:08:19.469023');
INSERT INTO "public"."assistant_chats" VALUES ('d2ad6a74-f6f7-4988-b924-8197f738f3c7', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Để chào mừng bạn về nhà, mình đã bật đèn trần phòng khách, đèn bếp, đèn hành lang và mở rèm ban công. Bạn có cần điều chỉnh thêm không? 😊', 't', 'CONTROL_DEVICE', '2026-07-09 00:08:47.172752');
INSERT INTO "public"."assistant_chats" VALUES ('42aad579-62fa-4cda-bb5e-73884850fdad', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'hôm nay thời tiết thế nào vậy', 'f', 'USER_REQUEST', '2026-07-09 00:10:04.93341');
INSERT INTO "public"."assistant_chats" VALUES ('3d9feb74-69a0-4163-a0f2-6f66b2275f9d', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Theo dữ liệu từ cảm biến DHT22, hôm nay thời tiết trong nhà khá ổn định với nhiệt độ và độ ẩm ở mức bình thường. Bạn có cần mình kiểm tra thêm thông số chi tiết không?', 't', 'GEMINI_CHAT', '2026-07-09 00:10:16.551846');
INSERT INTO "public"."assistant_chats" VALUES ('08ed20fa-62b5-4478-bd83-8ac4c931a76a', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tóm tắt giúp tôi tình hình ở nhà trong hôm nay đi', 'f', 'USER_REQUEST', '2026-07-09 00:10:39.954074');
INSERT INTO "public"."assistant_chats" VALUES ('e90d0f62-7fd6-41db-9e61-c071ca7ed6d5', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Theo dõi được các thiết bị sau trong hôm nay:
- Các đèn trong nhà (trần phòng khách, bếp, hành lang, phòng ăn) đều hoạt động ổn định.
- Rèm ban công 1 được mở thường xuyên.
- Cảm biến DHT22 ghi nhận nhiệt độ và độ ẩm ở mức bình thường.
- Camera AI Toàn Cảnh và các cảm biến an ninh (PIR, Radar) đều hoạt động tốt.
- Cảm biến khí MQ-135 báo mức nguy hiểm, bạn nên kiểm tra nguồn khói hoặc khí độc trong nhà.', 't', 'GEMINI_CHAT', '2026-07-09 00:10:55.428317');
INSERT INTO "public"."assistant_chats" VALUES ('c857ae3b-e35b-4288-ac12-b5346272b0ee', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'có thể cho tôi biết khoảng thời gian phát hiện khí độc khồng', 'f', 'USER_REQUEST', '2026-07-09 00:11:55.177002');
INSERT INTO "public"."assistant_chats" VALUES ('83f9f494-c191-4543-8e82-852d47a22000', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Thời gian phát hiện khí độc từ cảm biến MQ-135 là gần đây, cụ thể là trong hôm nay. Bạn có cần mình kiểm tra lại thông số chi tiết hơn không?', 't', 'GEMINI_CHAT', '2026-07-09 00:12:03.757491');
INSERT INTO "public"."assistant_chats" VALUES ('f1d8a603-182d-4196-951e-808e50740368', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'có, tôi cần khoảng thời gian cụ thể', 'f', 'USER_REQUEST', '2026-07-09 00:12:21.182302');
INSERT INTO "public"."assistant_chats" VALUES ('3d08937e-74e3-45af-ac8e-0e497e1294b0', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Rất tiếc, hệ thống hiện tại chưa hỗ trợ hiển thị thời gian cụ thể phát hiện khí độc từ cảm biến MQ-135. Bạn có thể kiểm tra lại thông số chi tiết qua ứng dụng TSmartHome hoặc liên hệ với đội ngũ hỗ trợ để được hỗ trợ thêm.', 't', 'GEMINI_CHAT', '2026-07-09 00:12:31.495369');
INSERT INTO "public"."assistant_chats" VALUES ('a37629d1-3cee-4137-83a3-a3f8b88e289b', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'bạn có thể hỗ trợ tôi những chức năng gì', 'f', 'USER_REQUEST', '2026-07-09 01:24:52.937107');
INSERT INTO "public"."assistant_chats" VALUES ('904f2115-c803-4413-9786-e565e61e20a5', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Tôi có thể hỗ trợ bạn điều khiển các thiết bị trong nhà thông minh như: bật/tắt đèn, kiểm tra tình trạng hoạt động của thiết bị, hoặc cung cấp thông tin trạng thái hiện tại của các thiết bị. Bạn có thể hỏi tôi về các chức năng cụ thể như: ''Bật đèn phòng khách'', ''Kiểm tra hoạt động của cảm biến nhiệt độ'', hoặc ''Trạng thái của camera an ninh''. Bạn cần hỗ trợ gì cụ thể hơn không?', 't', 'GEMINI_CHAT', '2026-07-09 01:25:25.539754');
INSERT INTO "public"."assistant_chats" VALUES ('bf9f3e66-ca89-4099-bd04-4b9f35cd3908', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'kiểm tra hoạt động đèn led giúp tôi', 'f', 'USER_REQUEST', '2026-07-09 01:57:43.815373');
INSERT INTO "public"."assistant_chats" VALUES ('92fc3611-ad3b-49e2-9677-b3d573651e08', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Thiết bị Đèn bếp vẫn hoạt động tốt! Trạng thái của thiết bị đã tự động phản hồi và khôi phục về trạng thái Bật.', 't', 'CHECK_DEVICE_ACTIVE', '2026-07-09 01:58:05.453435');
INSERT INTO "public"."assistant_chats" VALUES ('1665992f-1dad-45a8-bca0-261df50c49d1', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tắt đèn bếp cho tôi', 'f', 'USER_REQUEST', '2026-07-09 03:45:41.66336');
INSERT INTO "public"."assistant_chats" VALUES ('8cb586ee-b6a6-4a9c-9593-4434c08b7d57', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Đang thực hiện tắt đèn bếp. Đèn bếp đã được tắt.', 't', 'CONTROL_DEVICE', '2026-07-09 03:46:09.550159');
INSERT INTO "public"."assistant_chats" VALUES ('aae49c1e-fdc3-4937-80ba-540530b6b7cf', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'tôi sắp về tới nhà và điện giúp tôi', 'f', 'USER_REQUEST', '2026-07-13 02:02:43.63714');
INSERT INTO "public"."assistant_chats" VALUES ('dba55348-b186-4cf7-9766-c687ee1c49a9', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Đang thực hiện bật đèn trần phòng khách, đèn bếp, đèn hành lang và mở rèm ban công. Các thiết bị đã được bật để chào mừng bạn về nhà.', 't', 'CONTROL_DEVICE', '2026-07-13 02:03:18.145998');
INSERT INTO "public"."assistant_chats" VALUES ('7509b0b0-017e-48b3-ade1-4a4892f5d2ba', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hôm nay ở nhà có sự kiện gì xảy ra không', 'f', 'USER_REQUEST', '2026-07-13 02:03:52.858293');
INSERT INTO "public"."assistant_chats" VALUES ('8a661b1b-e8e4-416a-9df2-9c775df6a8ae', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hôm nay ở nhà chưa có sự kiện nào đặc biệt được ghi nhận. Tuy nhiên, có thể bạn muốn kiểm tra tình trạng hoạt động của các thiết bị trong nhà để đảm bảo mọi thứ đều ổn định.', 't', 'GEMINI_CHAT', '2026-07-13 02:04:06.66338');
INSERT INTO "public"."assistant_chats" VALUES ('b2c2157a-04a9-4913-a9fe-37052f55e566', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Ok kiểm tra cảm ứng từ giúp tôi', 'f', 'USER_REQUEST', '2026-07-13 02:04:44.054935');
INSERT INTO "public"."assistant_chats" VALUES ('5402dd9d-95e3-47c5-be9f-52a18067350e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Thiết bị livingroom_sensor_radar vẫn hoạt động tốt! Trạng thái của thiết bị đã tự động phản hồi và khôi phục về trạng thái Bật.', 't', 'CHECK_DEVICE_ACTIVE', '2026-07-13 02:04:54.578436');
INSERT INTO "public"."assistant_chats" VALUES ('6bb2dff6-8ab8-4637-a8e5-23d616974f2e', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'kiểm tra các thiết bị đèn giúp tôi', 'f', 'USER_REQUEST', '2026-07-13 02:31:16.91999');
INSERT INTO "public"."assistant_chats" VALUES ('413118b7-e7be-4f95-8d01-6b188b5a03b7', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Dưới đây là trạng thái của các thiết bị đèn trong nhà:
- Đèn trần trước (livingroom_light_front): Bật
- Đèn trần P.Khách (livingroom_light_ceiling): Bật
- Đèn bếp (kitchen_light_main): Bật
- Đèn hành lang (hallway_light_main): Bật
- Đèn Ban công 1 (balcony1_light_main): Bật
- Đèn phòng ăn (livingroom_light_dining): Bật
- Đèn trần sau (livingroom_light_back): Tắt

Tất cả các thiết bị đèn đều đang hoạt động bình thường. Nếu bạn cần kiểm tra thêm thiết bị cụ thể hoặc có yêu cầu nào khác, hãy cho tôi biết nhé!', 't', 'GEMINI_CHAT', '2026-07-13 02:31:56.007187');

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."audit_logs";
CREATE TABLE "public"."audit_logs" (
  "id" uuid NOT NULL,
  "action" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6),
  "email" varchar(100) COLLATE "pg_catalog"."default",
  "executed" bool,
  "target" text COLLATE "pg_catalog"."default",
  "type" varchar(20) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of audit_logs
-- ----------------------------
INSERT INTO "public"."audit_logs" VALUES ('bfd7924b-b49e-474d-9bb6-6f6b1d7e187a', 'Đăng nhập thất bại', '2026-07-08 03:07:08.304488', 'hantrungcui@gmail.com', 'f', 'Lỗi: Email hoặc mật khẩu không đúng!', 'DANGER');
INSERT INTO "public"."audit_logs" VALUES ('ee0d5acd-3fa3-4c88-aaf1-3672d5e87dd8', 'Đăng nhập thất bại', '2026-07-08 03:07:24.308141', 'hantrungcui@gmail.com', 'f', 'Lỗi: Email hoặc mật khẩu không đúng!', 'DANGER');
INSERT INTO "public"."audit_logs" VALUES ('efa8560f-d693-4b8e-9148-f3c2ebfe3efa', 'Đăng nhập', '2026-07-08 03:12:40.290652', 'hant@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('54957dc2-8630-4faf-bd5a-1a41ebefda5b', 'Tạo ngôi nhà mới', '2026-07-08 03:13:23.784552', 'hant@gmail.com', 't', 'Tên nhà: hanoi', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('18457e06-d0af-4097-be33-46a63a462558', 'Tạo cấu hình mã nguồn', '2026-07-08 03:13:26.35924', 'hant@gmail.com', 't', 'Home ID: 20a515c1-0548-4f0f-8bcd-5b5cd1b44790 (node1)', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('710ea2ad-8e20-4282-830d-7b5b770c9dde', 'Tạo cấu hình mã nguồn', '2026-07-08 03:20:13.253472', 'hant@gmail.com', 't', 'Home ID: 20a515c1-0548-4f0f-8bcd-5b5cd1b44790 (node1)', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('c1069e45-ef5f-405a-8c5e-f61d900d7fd1', 'Tạo cấu hình mã nguồn', '2026-07-08 03:22:25.954493', 'hant@gmail.com', 't', 'Home ID: 20a515c1-0548-4f0f-8bcd-5b5cd1b44790 (node1)', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('0304e0a7-594b-490e-8a71-f2f29bd5805b', 'Đăng nhập', '2026-07-08 23:27:20.803993', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('3002bea7-96e0-4716-9b8f-6f3a1af5083d', 'Đăng nhập', '2026-07-09 03:02:46.943485', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('47180e91-59cd-45fe-bede-cd72404244aa', 'Đăng nhập', '2026-07-09 19:51:29.537545', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('b8f326b0-4e9b-4cdd-bf94-cf01e2c78b92', 'Đăng nhập', '2026-07-09 21:18:03.270742', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('c11980fa-84da-4d2e-8f1a-3f64d4478fcf', 'Đăng nhập', '2026-07-09 22:31:16.542317', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('d17b0b54-e0f2-4c34-a762-085c42623c7e', 'Đăng nhập', '2026-07-09 22:43:14.997474', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('2b3e044b-9f72-4194-9498-977662a5f438', 'Đăng nhập', '2026-07-09 23:17:09.848789', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('9915a48b-b70a-4a1f-b120-4191c5d91a16', 'Đăng nhập', '2026-07-10 00:29:30.574187', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('fcd82f68-fd91-4058-88d0-6580c040ea64', 'Đăng nhập', '2026-07-10 14:45:01.151305', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');
INSERT INTO "public"."audit_logs" VALUES ('a6563291-4b25-4e6a-91e7-a2d843c54372', 'Đăng nhập', '2026-07-12 11:46:43.567301', 'hantrung453@gmail.com', 't', 'Đăng nhập hệ thống thành công', 'SUCCESS');

-- ----------------------------
-- Table structure for automation_rules
-- ----------------------------
DROP TABLE IF EXISTS "public"."automation_rules";
CREATE TABLE "public"."automation_rules" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "home_id" uuid,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "condition" jsonb,
  "action" jsonb,
  "is_active" bool DEFAULT true,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of automation_rules
-- ----------------------------

-- ----------------------------
-- Table structure for camera_captures
-- ----------------------------
DROP TABLE IF EXISTS "public"."camera_captures";
CREATE TABLE "public"."camera_captures" (
  "id" uuid NOT NULL,
  "created_at" timestamp(6),
  "home_id" uuid NOT NULL,
  "image_url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "device_id" uuid NOT NULL
)
;

-- ----------------------------
-- Records of camera_captures
-- ----------------------------

-- ----------------------------
-- Table structure for camera_streams
-- ----------------------------
DROP TABLE IF EXISTS "public"."camera_streams";
CREATE TABLE "public"."camera_streams" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "device_id" uuid,
  "stream_url" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of camera_streams
-- ----------------------------
INSERT INTO "public"."camera_streams" VALUES ('0da62bd4-af60-4f9d-8d07-11f56288f13d', '3352793e-c035-4807-bd40-f7cdb9aff87d', '/camera-s3/stream', '2026-05-25 12:52:14.817365');
INSERT INTO "public"."camera_streams" VALUES ('64128489-ed45-4df1-b981-f97901339c9c', 'fae67229-b0dc-480e-86ad-44881fc59e79', '/camera-thinker/stream', '2026-05-25 12:52:14.813203');
INSERT INTO "public"."camera_streams" VALUES ('b0bfb76d-736e-41dd-8f95-008657a7cbe8', '25da9c9e-1e85-4530-911f-90041e6bb34f', '/camera-s3/stream', '2026-07-07 04:28:50.7303');
INSERT INTO "public"."camera_streams" VALUES ('b22cda66-6a04-4468-94ae-c71ceb826efa', '1ca53132-28ee-46d8-a227-2c254dba368a', '/camera-thinker/stream', '2026-07-07 04:28:50.7303');
INSERT INTO "public"."camera_streams" VALUES ('4c5bee44-1220-455a-b341-c96788a26217', 'e1154448-64be-463a-ac5b-bdd24fdf1b9e', '/camera-s3/stream', '2026-07-07 04:34:37.654856');
INSERT INTO "public"."camera_streams" VALUES ('b73019db-c25d-40d2-8bfc-5f16d46e8aa0', '79fe0903-d87a-41df-b2b3-6881a29e3e38', '/camera-thinker/stream', '2026-07-07 04:34:37.654856');
INSERT INTO "public"."camera_streams" VALUES ('9b7a36ab-8ad1-437c-ae86-fc4d385ed298', '71066b8a-9db4-4bb8-9c41-2eb7884f9a43', '/camera-s3/stream', '2026-07-07 12:14:00.047286');
INSERT INTO "public"."camera_streams" VALUES ('986567e7-82d5-4f8c-bc1b-fb476ef756c8', '9e212755-98e1-4c90-ab4b-2f482c5cfffa', '/camera-thinker/stream', '2026-07-07 12:14:00.047286');
INSERT INTO "public"."camera_streams" VALUES ('e2db9c19-c86f-4df0-9bcd-67fa499bab78', '41323f97-3e2f-4ae0-aff8-32687b97462d', '/camera-s3/stream', '2026-07-07 13:00:32.489695');
INSERT INTO "public"."camera_streams" VALUES ('9e77179b-946f-402b-8443-dd747d375852', 'dbfa2973-8080-4d4c-a188-511f9d96e72a', '/camera-thinker/stream', '2026-07-07 13:00:32.489695');
INSERT INTO "public"."camera_streams" VALUES ('9b4593fc-3847-4e86-9dc4-eaabc68d084d', '898ed81c-a0eb-4778-9582-2d500aa21d41', '/camera-s3/stream', '2026-07-08 03:13:23.762142');
INSERT INTO "public"."camera_streams" VALUES ('1b623ecb-86e4-40ac-a269-423ef46ca122', '43ccdbe4-a5c4-4bca-bc5b-f7a560e6ad70', '/camera-thinker/stream', '2026-07-08 03:13:23.762142');

-- ----------------------------
-- Table structure for device_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."device_logs";
CREATE TABLE "public"."device_logs" (
  "id" int8 NOT NULL DEFAULT nextval('device_logs_id_seq'::regclass),
  "device_id" uuid,
  "action" varchar(100) COLLATE "pg_catalog"."default",
  "data" jsonb,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of device_logs
-- ----------------------------

-- ----------------------------
-- Table structure for device_states
-- ----------------------------
DROP TABLE IF EXISTS "public"."device_states";
CREATE TABLE "public"."device_states" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "device_id" uuid NOT NULL,
  "state" jsonb,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of device_states
-- ----------------------------

-- ----------------------------
-- Table structure for device_tokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."device_tokens";
CREATE TABLE "public"."device_tokens" (
  "device_id" uuid NOT NULL,
  "token" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of device_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS "public"."devices";
CREATE TABLE "public"."devices" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "room_id" uuid,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "device_type" varchar(50) COLLATE "pg_catalog"."default",
  "mqtt_topic" varchar(255) COLLATE "pg_catalog"."default",
  "status" varchar(50) COLLATE "pg_catalog"."default" DEFAULT 'offline'::character varying,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "is_fake" bool DEFAULT false,
  "label" varchar(100) COLLATE "pg_catalog"."default",
  "icon" varchar(50) COLLATE "pg_catalog"."default",
  "pos_2d_x" float8 DEFAULT 0,
  "pos_2d_y" float8 DEFAULT 0,
  "state" bool,
  "pos_3d_x" float8,
  "pos_3d_y" float8,
  "pos_3d_z" float8
)
;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO "public"."devices" VALUES ('5ee15e16-9214-4bcd-9e19-494759c829bb', '22222222-0000-0000-0000-000000000002', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:34:53.16341', 'f', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 't', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('5de4ae98-64c6-42e3-99be-b208727338ce', '22222222-0000-0000-0000-000000000008', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:42:36.715888', 't', 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, 'f', 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('848b5c7d-3d1d-4135-86e2-8ec44f86b018', '22222222-0000-0000-0000-000000000004', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:42:42.211492', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('25da9c9e-1e85-4530-911f-90041e6bb34f', 'b1879a20-3779-4b05-93d9-6160bf4ad4ac', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', NULL, '2026-07-07 04:28:50.760435', '2026-07-08 02:33:36.578199', 'f', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 'f', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('46a4586a-e5d6-4d98-9890-4a919d9d0953', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', 'Cảnh báo', '2026-05-09 14:59:28.002328', '2026-07-15 04:42:15.926681', 'f', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 't', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('fda3f297-2f06-4fc9-b300-c03905b8e8a4', 'b1879a20-3779-4b05-93d9-6160bf4ad4ac', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', 'CONNECTED', '2026-07-07 04:28:50.79434', '2026-07-08 02:08:01.500158', 't', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 'f', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('22ad3cd5-6d71-4dde-8d91-678bf8da2863', 'b1879a20-3779-4b05-93d9-6160bf4ad4ac', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-07-07 04:28:50.79434', '2026-07-07 04:28:50.79434', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, NULL, -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('d316cf06-aec2-41f7-9f94-ce5c8d0131b3', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', 'Tắt', '2026-07-07 04:28:50.79534', '2026-07-07 04:28:50.79534', 't', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 'f', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('00d78810-087b-445e-a70a-3716fb0e8f61', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', 'Cảnh báo', '2026-07-07 04:28:50.79534', '2026-07-07 04:28:50.79534', 't', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 'f', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('52789c93-4603-48ee-9424-9b07a52c2af9', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', 'Yên tĩnh', '2026-07-07 04:28:50.79634', '2026-07-07 04:28:50.79634', 't', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 'f', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('35d64ce7-6b6d-4072-9bc7-4f6b8df883e0', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', 'Tắt', '2026-07-07 04:28:50.797343', '2026-07-07 04:28:50.797343', 't', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 'f', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('6e3992fe-5f1e-4e17-8c6e-8f2dc90a29ab', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', 'Cảnh báo', '2026-07-07 04:28:50.798342', '2026-07-07 04:28:50.798342', 't', 'Radar 3', 'Radar', NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('443d3e0a-b0c8-4dd8-8348-9218d99caa0d', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', 'Cảnh báo', '2026-07-07 04:28:50.798342', '2026-07-07 04:28:50.798342', 't', 'Radar Hàng 2', 'Radar', 0, 0, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('9af82f01-d545-4e5d-bb5e-06ad9e8b981a', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', 'Tắt', '2026-07-07 04:28:50.798342', '2026-07-07 04:28:50.798342', 't', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 'f', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('c62e5662-ab8c-46fb-a173-ce7fc6a4c1fe', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', 'Tắt', '2026-07-07 04:28:50.799341', '2026-07-07 04:28:50.799341', 't', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 'f', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('f0b9820a-34f0-422e-8310-51f16ddae781', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', 'Cảnh báo', '2026-07-07 04:28:50.799341', '2026-07-07 04:28:50.799341', 't', NULL, NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('54fe4edc-0772-4532-8885-60d6fb8f7db2', 'b9c6fc1e-1f94-4847-9672-45efa44ae283', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', 'An toàn', '2026-07-07 04:28:50.800346', '2026-07-07 04:28:50.800346', 't', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 'f', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('4ef6b3b8-fb2b-4986-86c4-ba2863dc790f', 'd0294a03-7348-41d9-bb4a-5d1813ee3d16', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', NULL, '2026-07-07 04:28:50.79634', '2026-07-08 02:27:07.001869', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('2bc861a3-a930-46fe-bb41-44c68f1c5557', 'b9c6fc1e-1f94-4847-9672-45efa44ae283', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', 'Nguy hiểm', '2026-07-07 04:28:50.800346', '2026-07-07 04:28:50.800346', 't', 'Khí MQ-135', 'Wind', 54.34, 61.87, 'f', -0.77, 1.2, 1.14);
INSERT INTO "public"."devices" VALUES ('bacb3b6e-26a9-4d8f-a14e-b25693c1b77f', 'b9c6fc1e-1f94-4847-9672-45efa44ae283', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', 'Tắt', '2026-07-07 04:28:50.801341', '2026-07-07 04:28:50.801341', 't', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 'f', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('dd61f89a-0be1-44df-87bb-88f2fb4395d4', '5e1cc89b-95df-4e54-b6b0-615285c31601', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-07-07 04:28:50.801341', '2026-07-07 04:28:50.801341', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('275407fa-1785-4bbc-b274-8f44789e4034', '22222222-0000-0000-0000-000000000013', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:42:30.429208', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('3352793e-c035-4807-bd40-f7cdb9aff87d', '22222222-0000-0000-0000-000000000001', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', NULL, '2026-05-09 14:59:28.002328', '2026-07-08 03:05:37.710931', 'f', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 't', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('3f989385-f8be-482f-a91f-3496f8934871', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', 'Yên tĩnh', '2026-05-09 14:59:28.002328', '2026-07-15 04:55:07.807882', 'f', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 't', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('85ab57a7-b51c-4952-af30-3c1d7fb0eaea', '22222222-0000-0000-0000-000000000002', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:34:58.814563', 'f', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 't', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('06368676-6cd6-4013-9316-92f2825d1325', '22222222-0000-0000-0000-000000000004', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', 'Cảnh báo', '2026-05-10 10:30:40.85919', '2026-07-14 20:09:09.311753', 'f', 'radar hành lang', NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('f042772a-f32b-4658-bc2e-dd1c3827053d', '22222222-0000-0000-0000-000000000008', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:03:18.4908', 'f', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 't', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('d6921dd5-a555-483d-a612-db09c5daecae', '5e1cc89b-95df-4e54-b6b0-615285c31601', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', 'Cảnh báo', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'radar hành lang', NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('a4e68fe0-6e47-4259-9374-f3c5ec3d0dfa', '5e1cc89b-95df-4e54-b6b0-615285c31601', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 'f', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('9ddbd3ec-84b8-4f53-b949-014a0d710e86', 'fa9b847d-0c53-49a0-844f-d9255444c749', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('c6ba0d7b-d9ee-49ee-9067-4eb14a2b1eec', 'fa9b847d-0c53-49a0-844f-d9255444c749', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('e11ee7f8-0907-496b-8f2a-c25aa01f01c4', 'fa9b847d-0c53-49a0-844f-d9255444c749', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('85703520-fb82-4ca5-9325-cd041ccbb2e1', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', 'Bình thường', '2026-05-09 14:59:28.002328', '2026-07-15 04:54:11.983081', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('82f5f9d2-0504-4ba3-a64b-a8b0a8059eee', '029bbb55-c6af-4da9-8f59-c4eb1f16995e', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('26830ead-7ae5-486f-8ac4-2614e3fc1164', '029bbb55-c6af-4da9-8f59-c4eb1f16995e', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '22222222-0000-0000-0000-000000000001', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', 'Cảnh báo', '2026-05-09 14:59:28.002328', '2026-07-14 20:15:57.432472', 'f', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 't', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('e4d909c2-90d0-4a51-bc20-94f4df121171', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', 'Cảnh báo', '2026-05-23 14:00:00', '2026-07-15 04:23:35.813084', 'f', 'Radar 3', 'Radar', NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('2f8e47f7-1c33-44ec-a932-810ad3960135', '8b6cc9fd-59e3-4121-804f-48429fa7b0ee', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', NULL, '2026-07-07 04:28:50.802341', '2026-07-08 02:27:07.020061', NULL, 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, 't', 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('e1837395-ef31-44a8-bf9d-6fd93bd51b48', '029bbb55-c6af-4da9-8f59-c4eb1f16995e', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('252be867-5ccf-4c20-b676-af2d78988573', '8b6cc9fd-59e3-4121-804f-48429fa7b0ee', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('9c9c526d-39bb-4384-b00b-1298c0e51eb6', '8b6cc9fd-59e3-4121-804f-48429fa7b0ee', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('d41d8cd9-8f00-3204-a980-0998ecf8427e', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', 'CONNECTED', '2026-05-23 14:00:00', '2026-07-15 02:03:00.620634', 'f', 'Radar Hàng 2', 'Radar', 0, 0, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('509f4409-79e1-4a8c-9798-1702fa9218e7', '22222222-0000-0000-0000-000000000002', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:34:47.532554', 'f', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 't', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('4030d658-a8bc-4c5b-b024-10042571f8b6', '22222222-0000-0000-0000-000000000007', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:10.231846', 't', 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, 'f', 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('926ae172-8c04-40f5-85db-fe7066d38ad7', '328b998f-7071-44b0-891b-07fad1e52603', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 'f', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('a405a50d-dbcc-42ab-ad64-6cda65cd09ef', '993bd905-41ce-48c1-9ff1-477172e0ae93', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', NULL, '2026-07-07 04:28:50.80837', '2026-07-08 02:27:07.030125', NULL, 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, 't', 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('57a5ebad-a1ef-440b-b14a-bb72c6d86295', '328b998f-7071-44b0-891b-07fad1e52603', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', 'Tắt', '2026-07-07 04:28:50.802341', '2026-07-07 04:28:50.802341', 't', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 'f', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('03710209-2dc6-4a2c-a2dc-2fd39401b796', '328b998f-7071-44b0-891b-07fad1e52603', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', NULL, '2026-07-07 04:28:50.802341', '2026-07-08 02:27:07.021463', NULL, 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, 't', 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('358cbc94-91ba-43d4-89d2-facf3b5192da', '993bd905-41ce-48c1-9ff1-477172e0ae93', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-07-07 04:28:50.80837', '2026-07-07 04:28:50.80837', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('2fd6abed-2681-4028-9f70-b057d565f77d', 'd14f58fb-161c-4f20-aa53-24a368daa241', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-07-07 04:28:50.80837', '2026-07-07 04:28:50.80837', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('f657efd1-f29f-4dd7-bd45-9850539b69aa', '22222222-0000-0000-0000-000000000002', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:03:17.470893', 'f', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 't', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('440ba046-a176-47f9-95e5-7439a3023888', '22222222-0000-0000-0000-000000000013', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:42:49.23248', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('31818f10-d9ce-4908-8889-892603e226e7', '22222222-0000-0000-0000-000000000001', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:28.21969', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, 'f', -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('dc377953-47ae-4d5a-900b-9ba5a8158949', '22222222-0000-0000-0000-000000000006', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:01.955167', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('39b3c159-92d9-4182-b2c4-40503a93dd22', '22222222-0000-0000-0000-000000000006', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:33.671716', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('00b5447f-e0dc-4023-b2cc-9ac800fb267d', '22222222-0000-0000-0000-000000000005', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:12.934743', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('a72608c3-6649-4df2-8d18-f29ccb6171b3', '22222222-0000-0000-0000-000000000005', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:39.178917', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('dac599eb-ad9f-4113-9d55-4adc70a6dff1', '22222222-0000-0000-0000-000000000003', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', NULL, '2026-05-09 14:59:28.002328', '2026-07-08 03:05:37.745286', 'f', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 't', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('ade0f56b-85e9-4c89-8154-d1ebc2e0612a', '22222222-0000-0000-0000-000000000008', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', NULL, '2026-05-09 14:59:28.002328', '2026-07-08 03:05:37.747694', 'f', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 't', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('3c15c7e9-173a-4410-8d78-3bb8f8441f90', '22222222-0000-0000-0000-000000000007', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:44.680076', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('83a5181a-cf88-452f-b566-b6b57a6dbd9a', '22222222-0000-0000-0000-000000000006', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-05-09 14:59:28.002328', '2026-07-12 02:29:00.006557', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('30b029d5-d9fa-4690-9724-557322a970f1', '22222222-0000-0000-0000-000000000010', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:50.173679', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('d2696994-6162-4cca-9033-33ad7f664cfb', '22222222-0000-0000-0000-000000000011', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:55.694633', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('a173ec87-ac48-46ea-ba1d-48fb31ee205a', '22222222-0000-0000-0000-000000000007', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:43:22.732918', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('58fba406-c3fb-4f3e-8a79-1c41361eee35', '292e2df1-7004-45ad-9153-8f16ad7176ff', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-07-07 04:28:50.80837', '2026-07-07 04:28:50.80837', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('098f9f0c-231c-4ffa-be08-05b3014c0e40', 'a8439cca-3236-4982-aa99-f963340bb9d2', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-07-07 04:28:50.80837', '2026-07-07 04:28:50.80837', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('507e1e3f-765e-44ba-943b-e534a535ce60', '8ad12728-288c-4efe-b137-b0db15a1fa29', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-07-07 04:28:50.80837', '2026-07-07 04:28:50.811178', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('62635805-e130-41b8-add0-44c07913215e', '8ad12728-288c-4efe-b137-b0db15a1fa29', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-07-07 04:28:50.811486', '2026-07-07 04:28:50.811486', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('d3993ff1-8d79-467b-83df-0d303a1a3c9a', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', 'Cảnh báo', '2026-05-10 10:30:40.85919', '2026-07-15 00:44:18.285811', 'f', NULL, NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('ab2ac091-90d3-4e87-974d-172ce035c8b1', '22222222-0000-0000-0000-000000000009', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:47.383434', 't', 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, 'f', 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('d1a7b0a8-8333-42ab-9eb9-e819b4580279', '22222222-0000-0000-0000-000000000009', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:24.691096', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('0f5debb9-57ef-4c31-9a0f-96ac759790cb', '22222222-0000-0000-0000-000000000004', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:03:18.080825', 'f', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 't', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('fae67229-b0dc-480e-86ad-44881fc59e79', '22222222-0000-0000-0000-000000000013', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', NULL, '2026-05-09 14:59:28.002328', '2026-07-08 03:05:37.754709', 'f', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 't', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('10818cf6-ca93-4db6-ba21-9cd5f4990d8c', '22222222-0000-0000-0000-000000000012', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:30.910084', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('ceb26884-46bb-4da8-a948-065a8e7ff0ff', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', NULL, '2026-07-08 03:13:23.773328', '2026-07-08 03:17:01.017002', 'f', NULL, NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('9fba8001-face-4b57-a1fa-209820d370de', '0d11e360-bf39-40f3-bfcb-8ffa9fb2b44c', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', NULL, '2026-07-08 03:13:23.774329', '2026-07-08 03:17:01.019997', 'f', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 't', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('86d248ee-1175-4ef1-9d70-1cddfe005a5f', '8ad12728-288c-4efe-b137-b0db15a1fa29', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-07-07 04:28:50.811486', '2026-07-07 04:28:50.811486', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('1ca53132-28ee-46d8-a227-2c254dba368a', '8ad12728-288c-4efe-b137-b0db15a1fa29', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', 'Bật', '2026-07-07 04:28:50.812545', '2026-07-07 04:28:50.812545', 't', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 'f', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('e1154448-64be-463a-ac5b-bdd24fdf1b9e', 'b8f1225f-8926-4ba3-90b7-42d75c5d19b9', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', 'Phát hiện', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479', 't', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 'f', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('83bbb91e-72c5-4635-92b4-720183a3acd2', 'b8f1225f-8926-4ba3-90b7-42d75c5d19b9', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', 'Cảnh báo', '2026-07-07 04:34:37.660487', '2026-07-07 04:34:37.660487', 't', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 'f', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('fd2c3fc1-1f74-43b6-994e-f1baf989f9ca', '22222222-0000-0000-0000-000000000005', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:36.405565', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('20f7b08a-6dd8-4ab4-adea-ce15aa7bbe6f', 'b8f1225f-8926-4ba3-90b7-42d75c5d19b9', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-07-07 04:34:37.660487', '2026-07-07 04:34:37.660487', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, NULL, -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('d14fc269-fdbd-428b-a3b5-9bfe3d9da477', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', 'Tắt', '2026-07-07 04:34:37.662493', '2026-07-07 04:34:37.662493', 't', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 'f', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('58639746-6b70-4dbe-8c5b-95fade2d4c43', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', 'Cảnh báo', '2026-07-07 04:34:37.662493', '2026-07-07 04:34:37.662493', 't', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 'f', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('b8b2f79e-a658-449b-ae42-857359eec925', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', 'Yên tĩnh', '2026-07-07 04:34:37.662493', '2026-07-07 04:34:37.662493', 't', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 'f', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', '22222222-0000-0000-0000-000000000003', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-13 02:30:53.56452', 'f', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 't', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('2a3b450a-e9e4-4490-a823-398678453009', '22222222-0000-0000-0000-000000000013', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'CONNECTED', '2026-05-09 14:59:28.002328', '2026-07-08 02:44:41.904214', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('f8f6f71e-2227-4478-8e04-e7e712abb0a6', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', 'Tắt', '2026-07-07 04:34:37.697616', '2026-07-07 04:34:37.697616', 't', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 'f', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('5cff2141-a3ac-450f-841b-3b3460b2602f', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', 'Cảnh báo', '2026-07-07 04:34:37.698173', '2026-07-07 04:34:37.698173', 't', 'Radar 3', 'Radar', NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('47fe13a4-647e-41e7-aed6-02d5a46e0bc6', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', 'Cảnh báo', '2026-07-07 04:34:37.698729', '2026-07-07 04:34:37.698729', 't', 'Radar Hàng 2', 'Radar', 0, 0, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('35291f51-8f16-48ce-b1db-cc0ee1f69dc8', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', 'Tắt', '2026-07-07 04:34:37.699259', '2026-07-07 04:34:37.699259', 't', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 'f', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('6b99dc46-26a1-4716-a047-3f76c69d1c5c', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', 'Tắt', '2026-07-07 04:34:37.699795', '2026-07-07 04:34:37.699795', 't', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 'f', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('c1bcb816-5cab-450f-a401-b2a946d00e69', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', 'Cảnh báo', '2026-07-07 04:34:37.700329', '2026-07-07 04:34:37.700329', 't', NULL, NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('a485c70f-0d4d-4610-b227-4ff21e725d5b', '4bc7af43-d2f7-462c-84bd-8c60cce2ebbb', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', 'An toàn', '2026-07-07 04:34:37.700329', '2026-07-07 04:34:37.700329', 't', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 'f', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('e59cf833-9684-4c30-9cd4-61cec1cb8da0', '4bc7af43-d2f7-462c-84bd-8c60cce2ebbb', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', 'Nguy hiểm', '2026-07-07 04:34:37.700861', '2026-07-07 04:34:37.700861', 't', 'Khí MQ-135', 'Wind', 54.34, 61.87, 'f', -0.77, 1.2, 1.14);
INSERT INTO "public"."devices" VALUES ('a144da76-7fac-4212-9978-96173bae7426', '4bc7af43-d2f7-462c-84bd-8c60cce2ebbb', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', 'Tắt', '2026-07-07 04:34:37.701422', '2026-07-07 04:34:37.701422', 't', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 'f', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('5e5cffa9-f086-4fbc-826d-38183a545551', '11411b27-ab37-4691-91dd-1d3e589fc235', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-07-07 04:34:37.701422', '2026-07-07 04:34:37.701422', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('771e61e1-948f-4d7a-b967-7ca86eff87a2', '11411b27-ab37-4691-91dd-1d3e589fc235', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', 'Cảnh báo', '2026-07-07 04:34:37.701982', '2026-07-07 04:34:37.701982', 't', 'radar hành lang', NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('c02c6136-4c81-4700-8e59-7c18a31ccd9b', '11411b27-ab37-4691-91dd-1d3e589fc235', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', 'Tắt', '2026-07-07 04:34:37.701982', '2026-07-07 04:34:37.701982', 't', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 'f', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('c3ba99f6-a23d-449b-8e75-8175c0ab5732', '73cf99f8-99ad-48ed-aad7-3ef03a6adc90', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-07-07 04:34:37.702518', '2026-07-07 04:34:37.702518', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('df910b1d-48f9-4c8b-bead-325d8a3cc1a1', '73cf99f8-99ad-48ed-aad7-3ef03a6adc90', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-07-07 04:34:37.702518', '2026-07-07 04:34:37.702518', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('cab7c7cf-0f58-43fe-8cfb-3b0076a1008e', '73cf99f8-99ad-48ed-aad7-3ef03a6adc90', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-07-07 04:34:37.703324', '2026-07-07 04:34:37.703324', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('94c1856e-65c9-48df-aa81-8b0e3a20e0c9', '242ce5fa-bb2f-44d0-ab0c-d075301afc44', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-07-07 04:34:37.703324', '2026-07-07 04:34:37.703324', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('54e41c7f-06a5-4436-a634-81540548d86b', '242ce5fa-bb2f-44d0-ab0c-d075301afc44', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-07-07 04:34:37.703868', '2026-07-07 04:34:37.703868', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('85c4b6bb-4f00-4523-a1fd-87fd026bbecd', '242ce5fa-bb2f-44d0-ab0c-d075301afc44', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-07-07 04:34:37.703868', '2026-07-07 04:34:37.703868', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('10692ee4-321b-41f3-ad0c-555a9567ee8e', 'f3671ca4-1a8b-47f4-995b-061d19ae0a05', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-07-07 04:34:37.704399', '2026-07-07 04:34:37.704399', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('cb4b2748-27d6-4360-9f8b-7b42ea745686', 'f3671ca4-1a8b-47f4-995b-061d19ae0a05', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-07-07 04:34:37.704924', '2026-07-07 04:34:37.704924', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('d739ab97-8d4f-4af2-967a-0d5ee196069d', '4d838034-56df-4187-aeb9-35e8d86c5542', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', 'Tắt', '2026-07-07 04:34:37.705454', '2026-07-07 04:34:37.705454', 't', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 'f', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('f12428a4-8022-4806-81d1-a393076e67f6', '4d838034-56df-4187-aeb9-35e8d86c5542', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', 'Tắt', '2026-07-07 04:34:37.705454', '2026-07-07 04:34:37.705454', 't', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 'f', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('c0ae959e-6c30-4a74-9275-92802f0282c2', '7f504c1f-a746-4fba-86ea-bb09b9c70e95', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-07-07 04:34:37.705981', '2026-07-07 04:34:37.705981', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('bbe3ee71-73f8-455a-87ae-bd7d77cbc10f', '8fb0fb42-65bc-4833-b88a-f8238828485b', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-07-07 04:34:37.706537', '2026-07-07 04:34:37.706537', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('cc2a4609-9955-450b-86d7-69f7095106ba', 'a4f06018-94aa-4b1b-b3ac-9c43d104c3e6', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-07-07 04:34:37.706537', '2026-07-07 04:34:37.707091', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('04f111eb-bde0-41a9-b81b-e987a365b041', '4c67862b-be1c-4bac-b2e6-9f1b61cacbbc', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-07-07 04:34:37.707091', '2026-07-07 04:34:37.707091', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('8b89cc09-d093-44a9-bedb-7f3b71868129', '5519882c-84b2-4fa7-82fa-6f3bf0a40242', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-07-07 04:34:37.707603', '2026-07-07 04:34:37.707603', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('05ea8925-72c9-4242-a833-4966fcbc3220', '5519882c-84b2-4fa7-82fa-6f3bf0a40242', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-07-07 04:34:37.707603', '2026-07-07 04:34:37.707603', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('d1b2bd61-c939-4809-9278-610d43c59b9e', '5519882c-84b2-4fa7-82fa-6f3bf0a40242', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-07-07 04:34:37.708141', '2026-07-07 04:34:37.708141', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('29f086e7-06ac-4213-8413-051aeba133cc', 'f3671ca4-1a8b-47f4-995b-061d19ae0a05', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', NULL, '2026-07-07 04:34:37.704399', '2026-07-08 02:27:07.052999', NULL, 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, 't', 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('0e68f469-7839-4ff8-ae60-fa8ea204958f', '4d838034-56df-4187-aeb9-35e8d86c5542', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', NULL, '2026-07-07 04:34:37.704924', '2026-07-08 02:27:07.054673', NULL, 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, 't', 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('c3a47d5b-d639-4496-9c7b-0043131f591f', '7f504c1f-a746-4fba-86ea-bb09b9c70e95', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', NULL, '2026-07-07 04:34:37.705981', '2026-07-08 02:27:07.056238', NULL, 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, 't', 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('79fe0903-d87a-41df-b2b3-6881a29e3e38', '5519882c-84b2-4fa7-82fa-6f3bf0a40242', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', 'Bật', '2026-07-07 04:34:37.708141', '2026-07-07 04:34:37.708669', 't', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 'f', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('aa6fbd24-eb38-45b2-a65f-f643b444d139', 'f0defc15-b911-44fa-b8b6-7592bdb70c95', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-07-07 12:14:00.05231', '2026-07-07 12:14:00.05231', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, NULL, -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('efe737c8-0325-4ce8-8b12-030f1ba4e703', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', 'Tắt', '2026-07-07 12:14:00.05231', '2026-07-07 12:14:00.05231', 't', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 'f', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('41c2cd3e-ba9d-4975-af1a-54b9cd542679', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', 'Cảnh báo', '2026-07-07 12:14:00.05231', '2026-07-07 12:14:00.05231', 't', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 'f', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('b8c37b62-270e-49c2-8984-10bee86eccc2', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', 'Yên tĩnh', '2026-07-07 12:14:00.05331', '2026-07-07 12:14:00.05331', 't', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 'f', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('c1221bf9-2151-4244-9776-413d63da9fc9', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', 'Tắt', '2026-07-07 12:14:00.05331', '2026-07-07 12:14:00.05331', 't', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 'f', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('8d34b744-b541-4ed1-b229-da318e469828', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', 'Cảnh báo', '2026-07-07 12:14:00.05428', '2026-07-07 12:14:00.05428', 't', 'Radar 3', 'Radar', NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('c2414d55-daf2-40aa-aff4-12453f8a0675', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', 'Cảnh báo', '2026-07-07 12:14:00.05428', '2026-07-07 12:14:00.05428', 't', 'Radar Hàng 2', 'Radar', 0, 0, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('9f530dec-1a3e-4ebe-9ca8-4213a7580fec', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', 'Tắt', '2026-07-07 12:14:00.05428', '2026-07-07 12:14:00.05428', 't', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 'f', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('4064672c-8090-4048-a1a4-6777b0973611', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', 'Tắt', '2026-07-07 12:14:00.055283', '2026-07-07 12:14:00.055283', 't', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 'f', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('b5370d98-3ad3-4c70-bae1-4f32eee9d758', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', 'Cảnh báo', '2026-07-07 12:14:00.055283', '2026-07-07 12:14:00.055283', 't', NULL, NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('88c677c7-1c92-4950-8618-e690bd1eb020', '02ac0658-dd2c-4c48-aa5f-80d2962b824d', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', 'An toàn', '2026-07-07 12:14:00.055283', '2026-07-07 12:14:00.055283', 't', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 'f', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('9a305699-f1a6-400f-a72e-b2ccbb526960', '02ac0658-dd2c-4c48-aa5f-80d2962b824d', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', 'Nguy hiểm', '2026-07-07 12:14:00.055283', '2026-07-07 12:14:00.055283', 't', 'Khí MQ-135', 'Wind', 54.34, 61.87, 'f', -0.77, 1.2, 1.14);
INSERT INTO "public"."devices" VALUES ('0da07ddc-118d-4517-ae95-a125676d00c8', '02ac0658-dd2c-4c48-aa5f-80d2962b824d', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', 'Tắt', '2026-07-07 12:14:00.056281', '2026-07-07 12:14:00.056281', 't', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 'f', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('5af9e444-0124-4c56-8bfd-ad045039ec74', 'aaf89658-e452-4922-80f1-0984a2e9fce7', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-07-07 12:14:00.056281', '2026-07-07 12:14:00.056281', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('dc0b3dbe-26dd-482b-8f7c-a09bacb3ed8b', 'aaf89658-e452-4922-80f1-0984a2e9fce7', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', 'Cảnh báo', '2026-07-07 12:14:00.056281', '2026-07-07 12:14:00.056281', 't', 'radar hành lang', NULL, NULL, NULL, 'f', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('a1d3f460-1413-4354-9586-9571d65be7a0', 'aaf89658-e452-4922-80f1-0984a2e9fce7', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', 'Tắt', '2026-07-07 12:14:00.056281', '2026-07-07 12:14:00.056281', 't', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 'f', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('e08763f0-7a4d-4224-a1bf-af003d156777', 'eddda474-53a3-4ea2-ab5f-9ca777408520', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-07-07 12:14:00.05728', '2026-07-07 12:14:00.05728', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('e4672af9-601c-4a21-98fd-2ec997d5c09f', 'eddda474-53a3-4ea2-ab5f-9ca777408520', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-07-07 12:14:00.05728', '2026-07-07 12:14:00.05728', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('4b956a8a-9be0-40a7-821e-bd5ec4773e82', 'eddda474-53a3-4ea2-ab5f-9ca777408520', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-07-07 12:14:00.05728', '2026-07-07 12:14:00.05728', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('79f25015-7c65-4903-b0bc-a4c2ae44520e', 'bb22f561-2087-4f0b-9a2b-52726a4b17a7', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-07-07 12:14:00.05728', '2026-07-07 12:14:00.05728', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('41fb599c-9feb-48bc-ba27-978f9c0c949c', 'bb22f561-2087-4f0b-9a2b-52726a4b17a7', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-07-07 12:14:00.05728', '2026-07-07 12:14:00.05728', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('0131b532-bdcc-4afd-b11a-a76c0f98dcc8', 'bb22f561-2087-4f0b-9a2b-52726a4b17a7', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-07-07 12:14:00.058282', '2026-07-07 12:14:00.058282', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('5afaf85f-549c-485b-b0de-2209849654ae', '50e1f445-4aff-4834-a448-2beca7452120', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-07-07 12:14:00.058282', '2026-07-07 12:14:00.058282', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('33160e4c-211a-4d5c-89d2-4bfa369a0b39', '50e1f445-4aff-4834-a448-2beca7452120', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-07-07 12:14:00.058282', '2026-07-07 12:14:00.058282', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('d5cbf748-2371-4922-843f-3a55b6efef5b', '6721cd8f-e3fd-48da-9b9f-3986c4ce1e21', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', 'Tắt', '2026-07-07 12:14:00.058282', '2026-07-07 12:14:00.058282', 't', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 'f', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('94e8792f-1967-4af2-8695-f31cc08c585d', '6721cd8f-e3fd-48da-9b9f-3986c4ce1e21', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', 'Tắt', '2026-07-07 12:14:00.059351', '2026-07-07 12:14:00.059351', 't', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 'f', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('cf9edd1f-5045-46dd-aa16-25c1a01f6fad', 'f0defc15-b911-44fa-b8b6-7592bdb70c95', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', 'CONNECTED', '2026-07-07 12:14:00.051194', '2026-07-08 01:58:58.34808', 't', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 'f', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('baf95406-2613-4a31-81fd-047d451144bf', 'eea4f21b-a0fe-46f3-b42b-0054470f23cd', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', NULL, '2026-07-07 12:14:00.05331', '2026-07-08 02:27:07.057833', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('e6a7e75f-f8b7-427f-95a7-2c2c64c78350', '50e1f445-4aff-4834-a448-2beca7452120', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', NULL, '2026-07-07 12:14:00.058282', '2026-07-08 02:27:07.060308', NULL, 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, 't', 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('da6b8839-edad-4403-a276-11cee596c314', '6721cd8f-e3fd-48da-9b9f-3986c4ce1e21', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', NULL, '2026-07-07 12:14:00.058282', '2026-07-08 02:27:07.062372', NULL, 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, 't', 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('9c127bba-b6e3-4934-92e9-0f90356f5bc1', 'b71a6250-47b2-492e-8aa6-e04f2b708a0a', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', NULL, '2026-07-07 12:14:00.059351', '2026-07-08 02:27:07.065498', NULL, 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, 't', 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('79e6b17b-dda4-4cbc-8226-44bd771a7041', 'b71a6250-47b2-492e-8aa6-e04f2b708a0a', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-07-07 12:14:00.059351', '2026-07-07 12:14:00.059351', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('b1dd4f73-0ab7-4244-8baa-b36970dd26fa', 'd0a141ac-c133-41a1-87fe-1122637c7b45', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-07-07 12:14:00.059351', '2026-07-07 12:14:00.059351', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('749589c6-9244-4f9c-a7dd-ee502e4010f1', '8f3269cd-3406-4d97-8fe1-2fc641f44ebc', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-07-07 12:14:00.059351', '2026-07-07 12:14:00.059351', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('7e358e6b-72a1-4586-87c8-ad0926ae26df', 'b8d3b887-e243-46a9-8f05-3cb4ad60c9cc', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-07-07 12:14:00.060351', '2026-07-07 12:14:00.060351', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('36495d92-6429-4efe-bfdc-d1f58f3faa12', 'b5073e3c-20f9-4d48-93cc-1b955a75aec1', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-07-07 12:14:00.060351', '2026-07-07 12:14:00.060351', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('1e6033a1-93f2-4be6-93e0-cd37bbbb5cfc', 'b5073e3c-20f9-4d48-93cc-1b955a75aec1', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-07-07 12:14:00.060351', '2026-07-07 12:14:00.060351', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('9c8f525c-290a-408c-a495-d0913958c613', 'b5073e3c-20f9-4d48-93cc-1b955a75aec1', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-07-07 12:14:00.060351', '2026-07-07 12:14:00.060351', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('9e212755-98e1-4c90-ab4b-2f482c5cfffa', 'b5073e3c-20f9-4d48-93cc-1b955a75aec1', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', 'Bật', '2026-07-07 12:14:00.061354', '2026-07-07 12:14:00.061354', 't', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 'f', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('e868b2fb-f9d2-4681-af9e-dd1f4217b828', '13a17dac-deaf-4395-9748-c15e7c67e67a', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, NULL, -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('e3b34b14-5fcf-49a3-8d1d-03c4e34397df', '7d88d862-6337-4c0c-8cf7-feedc794634a', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('887b9ac9-326a-41f1-9cef-9ea4a97b9fd8', '6d45ed5d-b4d3-4b58-ba77-750544edb65c', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('4965335c-57c1-4287-ab31-326675021c20', '6d45ed5d-b4d3-4b58-ba77-750544edb65c', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('c6ade2a6-1c2e-4d6e-b3b9-e96c8633d76b', '6d45ed5d-b4d3-4b58-ba77-750544edb65c', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('4e0a2d5b-375e-4b93-be4c-92868ea88ef3', 'ace1c57b-170b-4d4a-b7b6-3fcf3bae63f7', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('6b3ea1b1-296d-4d21-b678-f5f933d528d3', 'ace1c57b-170b-4d4a-b7b6-3fcf3bae63f7', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('4618ce71-6eae-4eb8-afea-e2e9a0218bf0', 'ace1c57b-170b-4d4a-b7b6-3fcf3bae63f7', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('edac5885-7fa0-408e-80c5-af7a65c030b3', '13a17dac-deaf-4395-9748-c15e7c67e67a', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.068645', 'f', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 't', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('092f0043-17eb-4288-b490-129c0a39d120', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.070099', 'f', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 't', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('c9218e23-c3b7-43e4-af11-db9b6f44e8b7', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.071552', 'f', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 't', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('b7e238e6-aac8-4634-bc14-7cad6c47f559', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.072943', 'f', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 't', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('f475a0a9-9597-4ef9-ac1b-c06d3d6b8b48', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.074316', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('935998d7-3fe3-4c1c-aaa5-796c768bdb67', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.075972', 'f', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 't', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('975df161-9c9f-4390-b222-d1d7ba4226b7', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.077605', 'f', 'Radar 3', 'Radar', NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('9419e588-9ba0-40be-a4d6-a617521f914f', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.079312', 'f', 'Radar Hàng 2', 'Radar', 0, 0, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('a0e97b64-49b0-42f0-8a07-399ae7a81fa0', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.081403', 'f', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 't', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('fcf15586-9f78-4ec4-a432-5a60b6f38bb8', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.08323', 'f', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 't', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('1fccd1b5-3c16-428a-b895-812afb0d74d5', '5693cf7f-a5b4-46d5-9c1f-d90d9436707f', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.085062', 'f', NULL, NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('1cd8a35a-284a-4f6e-a8e2-db676298f576', '8bf7a1f2-88c8-4c3e-b2a3-3c4c9da872fc', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.086311', 'f', 'Cảm biến Lửa', 'Flame', 61.8, 62.02, 't', 1.69, 1.2, 1.53);
INSERT INTO "public"."devices" VALUES ('13cd5510-bb88-4364-b8a5-a67d6c09c71d', '8bf7a1f2-88c8-4c3e-b2a3-3c4c9da872fc', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.087507', 'f', 'Khí MQ-135', 'Wind', 54.34, 61.87, 't', -0.77, 1.2, 1.14);
INSERT INTO "public"."devices" VALUES ('c65ee51c-cfb9-4cc5-974a-b57a1e4960a6', '8bf7a1f2-88c8-4c3e-b2a3-3c4c9da872fc', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.088758', 'f', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 't', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('817c1dae-e7a7-409b-b069-46b3c5b4e025', '7d88d862-6337-4c0c-8cf7-feedc794634a', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.089963', 'f', 'radar hành lang', NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('e5fc4807-e3b6-4a8f-a54e-b3b5f974edbd', '7d88d862-6337-4c0c-8cf7-feedc794634a', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.091124', 'f', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 't', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('9708f2ec-ec5d-4120-9422-6c8ddad8a802', '5939e215-c68a-4baa-b2d5-7b30e0bdd3b5', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, NULL, 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('0db3fb5b-44f4-4836-be79-b1fac4224fae', '5939e215-c68a-4baa-b2d5-7b30e0bdd3b5', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('cef1ddb9-8ba5-4dc4-abe8-e0fe54b036c3', '5939e215-c68a-4baa-b2d5-7b30e0bdd3b5', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('5cad9c0f-fc76-4c22-ae94-d5b57e63835a', 'f2665e96-6b44-4302-b3b1-1ecf13719916', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, NULL, 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('903b5acb-0592-4cb0-a06a-14604e47d04d', '8ce345f9-7eb1-421f-9b2b-340dd766860d', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, NULL, 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('0b124bf8-833e-4ebf-96cb-6abef946dba4', '8ce345f9-7eb1-421f-9b2b-340dd766860d', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('e9c49eaa-7948-46cb-a297-7833139df21a', 'ca6c1a2d-e5cb-4a9d-b5c8-85bf5364feab', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('ab85afcf-bddf-4dc4-9a63-ff63ab6f3a44', 'e9fa8712-b947-47bf-9477-c80e92a05ec5', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('0ee4c90d-e9df-4d8d-a752-9243b9bdeaaa', '90089b91-09b8-4db6-877c-f61fccb39ffb', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('9e1a2bca-836f-4e74-8dc7-70c6d5cfa6b9', '2cdf657a-504d-443a-9303-354355cac412', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('487a5876-737f-4580-83ea-7c2d5affff4c', '2cdf657a-504d-443a-9303-354355cac412', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('c75be065-b237-4061-8b8c-145b92839f3c', '2cdf657a-504d-443a-9303-354355cac412', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-07-07 13:00:32.508412', '2026-07-07 13:00:32.508412', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('71066b8a-9db4-4bb8-9c41-2eb7884f9a43', 'f0defc15-b911-44fa-b8b6-7592bdb70c95', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', 'CONNECTED', '2026-07-07 12:14:00.051194', '2026-07-08 01:58:56.591136', 't', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 'f', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('c29c2ec5-e39e-41c0-adb1-f84b34a8fbec', 'db8e4d53-bceb-486b-b757-ece443588e0b', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', NULL, '2026-07-07 04:34:37.662493', '2026-07-08 02:27:07.041275', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('41323f97-3e2f-4ae0-aff8-32687b97462d', '13a17dac-deaf-4395-9748-c15e7c67e67a', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', NULL, '2026-07-07 13:00:32.492589', '2026-07-08 02:27:07.06716', 'f', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 't', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('939a4811-8732-45be-89fa-0d9a27cfbdba', 'f2665e96-6b44-4302-b3b1-1ecf13719916', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', NULL, '2026-07-07 13:00:32.508412', '2026-07-08 02:27:07.092433', 'f', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 't', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('c84cc4d1-aeeb-4427-9355-6faf54b159ec', 'f2665e96-6b44-4302-b3b1-1ecf13719916', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', NULL, '2026-07-07 13:00:32.508412', '2026-07-08 02:27:07.094048', 'f', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 't', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('dbfa2973-8080-4d4c-a188-511f9d96e72a', '2cdf657a-504d-443a-9303-354355cac412', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', NULL, '2026-07-07 13:00:32.508412', '2026-07-08 02:27:07.095912', 'f', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 't', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('53d488d2-e402-4e62-8f78-6db59f5ee63f', '2b6aa439-bee8-4b6d-ba3c-05f86774d2ce', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-07-08 03:13:23.76833', '2026-07-08 03:13:23.76833', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86, NULL, -4.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('898ed81c-a0eb-4778-9582-2d500aa21d41', '2b6aa439-bee8-4b6d-ba3c-05f86774d2ce', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', NULL, '2026-07-08 03:13:23.767328', '2026-07-08 03:17:01.048265', 'f', 'Camera ESP32-S3', 'Camera', 26.81, 69.49, 't', -4.67, 2.2, 2.84);
INSERT INTO "public"."devices" VALUES ('3da38ff7-cca1-4cc8-b74c-fe5ca18779e6', '2b6aa439-bee8-4b6d-ba3c-05f86774d2ce', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', NULL, '2026-07-08 03:13:23.76833', '2026-07-08 03:17:01.050359', 'f', 'PIR Cửa chính', 'Activity', 22.11, 74.91, 't', -4.67, 2.2, 3.84);
INSERT INTO "public"."devices" VALUES ('1c786c6d-57a6-4e3f-a1bc-316849dcbdb8', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', NULL, '2026-07-08 03:13:23.769331', '2026-07-08 03:17:01.052859', 'f', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16, 't', -5.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('a2be852b-7f13-4cbc-b1b9-9c2a8b5d26cf', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', NULL, '2026-07-08 03:13:23.769331', '2026-07-08 03:17:01.054491', 'f', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88, 't', -0.15, 1.2, 3.18);
INSERT INTO "public"."devices" VALUES ('c13c914e-bc7b-46e7-b795-3a2c6bb33887', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', NULL, '2026-07-08 03:13:23.770331', '2026-07-08 03:17:01.055994', 'f', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66, 't', 0.06, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('b7e3096f-4227-4c0f-96f4-5b58a4841d1e', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', NULL, '2026-07-08 03:13:23.77133', '2026-07-08 03:17:01.057776', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05, NULL, 0.03, 1.2, -0.06);
INSERT INTO "public"."devices" VALUES ('939a8544-0e94-476c-a8ea-a77de5224f7c', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', NULL, '2026-07-08 03:13:23.77133', '2026-07-08 03:17:01.059206', 'f', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7, 't', -3.67, 1.2, 2.84);
INSERT INTO "public"."devices" VALUES ('20c564cc-b209-4100-a038-d5798d8a21d4', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_radar3', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar3', NULL, '2026-07-08 03:13:23.77233', '2026-07-08 03:17:01.060643', 'f', 'Radar 3', 'Radar', NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('96fe4eb4-4b64-4197-b3e1-74a590e373cf', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_sensor_radar2', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar2', NULL, '2026-07-08 03:13:23.77233', '2026-07-08 03:17:01.062102', 'f', 'Radar Hàng 2', 'Radar', 0, 0, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('6271cb7f-305e-4f10-8a0e-bf9d86515cf5', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', NULL, '2026-07-08 03:13:23.773328', '2026-07-08 03:17:01.063644', 'f', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39, 't', -1.79, 1.2, 3.19);
INSERT INTO "public"."devices" VALUES ('22c51c80-085f-4823-bb8e-3399ce0240d9', 'adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', NULL, '2026-07-08 03:13:23.773328', '2026-07-08 03:17:01.06505', 'f', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92, 't', 1.77, 1.2, 3.08);
INSERT INTO "public"."devices" VALUES ('936d1656-7787-46e0-a2c4-96c11fcc8be8', '2444df0f-80bb-4783-b32b-6b24576dc5ba', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-07-08 03:13:23.775329', '2026-07-08 03:13:23.775329', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03, 't', 0.14, 1.2, -2.28);
INSERT INTO "public"."devices" VALUES ('cc44f18b-d104-47dd-b874-2e486e6d7a1e', 'ac5f00b4-f015-427c-b06f-7e4d9573e804', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-07-08 03:13:23.775329', '2026-07-08 03:13:23.775329', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25, 't', -3.89, 1.2, -1.94);
INSERT INTO "public"."devices" VALUES ('3c25c610-2798-41e4-abd9-cc6673d52ef9', 'ac5f00b4-f015-427c-b06f-7e4d9573e804', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-07-08 03:13:23.776837', '2026-07-08 03:13:23.776837', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68, 't', -2.81, 1.2, -0.42);
INSERT INTO "public"."devices" VALUES ('8bf633da-ffce-4e76-add1-a25e2bfaf43e', 'ac5f00b4-f015-427c-b06f-7e4d9573e804', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-07-08 03:13:23.776837', '2026-07-08 03:13:23.776837', 't', 'Lửa PN1', 'Flame', 43.6, 44.65, 't', -3.28, 1.2, 1.02);
INSERT INTO "public"."devices" VALUES ('f5196637-3ff1-400c-8312-a2a16505a161', '107034d5-bf5a-4119-a2e0-83af33782fc4', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-07-08 03:13:23.776837', '2026-07-08 03:13:23.776837', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93, 't', -1.7, 1.2, -5.52);
INSERT INTO "public"."devices" VALUES ('1314262b-942b-45bc-9877-f7e182e38522', '107034d5-bf5a-4119-a2e0-83af33782fc4', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-07-08 03:13:23.777845', '2026-07-08 03:13:23.777845', 't', 'Lửa PN2', 'Flame', 48.43, 30.49, 't', -2.96, 1.2, -3.06);
INSERT INTO "public"."devices" VALUES ('edbdf6f5-ca95-45b0-b7bd-9fa2aede0d80', '107034d5-bf5a-4119-a2e0-83af33782fc4', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Bật', '2026-07-08 03:13:23.777845', '2026-07-08 03:13:23.777845', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98, 't', -1.85, 1.2, -4.11);
INSERT INTO "public"."devices" VALUES ('e6537f52-a221-4358-b775-592d4bc2ecd9', 'fc103bee-ab88-4e58-b94d-e67c79f492d3', 'bedroom3_window_main', 'appliance', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', 'Tắt', '2026-07-08 03:13:23.777845', '2026-07-08 03:13:23.777845', 't', 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17, NULL, 4.65, 1.2, -3.58);
INSERT INTO "public"."devices" VALUES ('2b678201-f61b-4cb0-9124-e01b83ef4a5d', 'fc103bee-ab88-4e58-b94d-e67c79f492d3', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-07-08 03:13:23.778845', '2026-07-08 03:13:23.778845', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19, 't', 3.06, 1.2, -4);
INSERT INTO "public"."devices" VALUES ('dd5e9433-3fc9-4e4c-bfd7-db21108066ee', 'fc103bee-ab88-4e58-b94d-e67c79f492d3', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-07-08 03:13:23.778845', '2026-07-08 03:13:23.778845', 't', 'Lửa PN3', 'Flame', 57.78, 22.49, 't', 1.84, 1.2, -3.96);
INSERT INTO "public"."devices" VALUES ('0025a94e-d2d7-4f00-860e-9b06faa001b2', '32aa01dc-78d8-41e2-9f58-d1050b1d6467', 'balcony1_door_main', 'appliance', 'home/tsmarthome/balcony1/door/balcony1_door_main', 'Tắt', '2026-07-08 03:13:23.778845', '2026-07-08 03:13:23.778845', 't', 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7, NULL, 3.56, 1.2, 2.9);
INSERT INTO "public"."devices" VALUES ('007d1bcc-5e6a-4a63-8ef4-70dbc58f5d1e', 'dc6f7751-f38e-4cac-b4c6-23116877f508', 'balcony2_door_main', 'appliance', 'home/tsmarthome/balcony2/door/balcony2_door_main', 'Tắt', '2026-07-08 03:13:23.779845', '2026-07-08 03:13:23.779845', 't', 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39, NULL, 4.54, 1.2, -0.4);
INSERT INTO "public"."devices" VALUES ('5d43f165-9fc6-4671-a931-1a258e8fe92d', 'dc6f7751-f38e-4cac-b4c6-23116877f508', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-07-08 03:13:23.779845', '2026-07-08 03:13:23.779845', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59, 't', 4.21, 1.2, -0.96);
INSERT INTO "public"."devices" VALUES ('75f34300-bdb8-4c58-988f-51d610b71d6f', '19b94bea-97ce-4402-8879-2fbd2deec776', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-07-08 03:13:23.780847', '2026-07-08 03:13:23.780847', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14, 't', 4.74, 1.2, 0.41);
INSERT INTO "public"."devices" VALUES ('5b0b8f99-36b7-4d30-897c-c3a4531f4f78', '05f5b370-ac70-4592-a288-5238fcfdd54b', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-07-08 03:13:23.780847', '2026-07-08 03:13:23.780847', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64, 't', 2.13, 1.2, -1.6);
INSERT INTO "public"."devices" VALUES ('d824d5d8-a553-4b6a-8d0b-aab1ecdabe56', 'a6ccc73c-7de3-41ea-b305-70a7cc52d64a', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-07-08 03:13:23.780847', '2026-07-08 03:13:23.780847', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42, 't', 0.64, 1.2, -4.46);
INSERT INTO "public"."devices" VALUES ('0b0e84be-b623-45ca-a09b-e042b2499ebf', '4e53b980-549a-4c70-92e2-11e7a7d7251f', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-07-08 03:13:23.781845', '2026-07-08 03:13:23.781845', 't', 'Còi Buzzer', 'Bell', 35.64, 81.42, 't', -3.13, 1.2, 3.92);
INSERT INTO "public"."devices" VALUES ('78f741c6-9d5d-4586-9206-2370feda58f6', '4e53b980-549a-4c70-92e2-11e7a7d7251f', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-07-08 03:13:23.781845', '2026-07-08 03:13:23.781845', 't', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82, 't', 1.16, 1.2, 4.79);
INSERT INTO "public"."devices" VALUES ('fa5c2460-5ddc-4623-ae52-013015b2aa5d', '4e53b980-549a-4c70-92e2-11e7a7d7251f', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-07-08 03:13:23.782474', '2026-07-08 03:13:23.782474', 't', 'Cảm biến TV', 'Tv', 39.66, 88.92, 't', -1.7, 1.2, 4.74);
INSERT INTO "public"."devices" VALUES ('233aee4d-c0af-4b8a-bb4c-b89cc6cf6338', '0d11e360-bf39-40f3-bfcb-8ffa9fb2b44c', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', NULL, '2026-07-08 03:13:23.774329', '2026-07-08 03:17:01.066451', 'f', 'Khí MQ-135', 'Wind', 54.34, 61.87, 't', -0.77, 1.2, 1.14);
INSERT INTO "public"."devices" VALUES ('b6053a8b-11db-417a-a0cf-bd16f345e8f4', '0d11e360-bf39-40f3-bfcb-8ffa9fb2b44c', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', NULL, '2026-07-08 03:13:23.774329', '2026-07-08 03:17:01.067903', 'f', 'Đèn bếp', 'Lightbulb', 58.44, 54.42, 't', 1.86, 1.2, 0.13);
INSERT INTO "public"."devices" VALUES ('3ad6364c-03ab-4da2-8bbe-e608b7658f63', '2444df0f-80bb-4783-b32b-6b24576dc5ba', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', NULL, '2026-07-08 03:13:23.775329', '2026-07-08 03:17:01.069725', 'f', 'radar hành lang', NULL, NULL, NULL, 't', NULL, NULL, NULL);
INSERT INTO "public"."devices" VALUES ('05c23489-5f6d-4316-9657-92a798ae1d5f', '2444df0f-80bb-4783-b32b-6b24576dc5ba', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', NULL, '2026-07-08 03:13:23.775329', '2026-07-08 03:17:01.070858', 'f', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66, 't', 0.06, 1.2, -1.45);
INSERT INTO "public"."devices" VALUES ('b71f9b82-43de-435c-9af3-c26f4aedf1e7', '32aa01dc-78d8-41e2-9f58-d1050b1d6467', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', NULL, '2026-07-08 03:13:23.778845', '2026-07-08 03:17:01.072152', 'f', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59, 't', 3.56, 1.2, 3.64);
INSERT INTO "public"."devices" VALUES ('834355da-1bd9-40c5-bf9a-272b37967d1f', '32aa01dc-78d8-41e2-9f58-d1050b1d6467', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', NULL, '2026-07-08 03:13:23.779845', '2026-07-08 03:17:01.073435', 'f', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27, 't', 4.61, 1.2, 3.44);
INSERT INTO "public"."devices" VALUES ('43ccdbe4-a5c4-4bca-bc5b-f7a560e6ad70', '4e53b980-549a-4c70-92e2-11e7a7d7251f', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', NULL, '2026-07-08 03:13:23.78298', '2026-07-08 03:17:01.07456', 'f', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4, 't', 3.32, 2.2, 4.75);
INSERT INTO "public"."devices" VALUES ('2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '22222222-0000-0000-0000-000000000003', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', 'Nguy hiểm', '2026-05-09 14:59:28.002328', '2026-07-15 04:54:12.299923', 'f', 'Khí MQ-135', 'Wind', 54.34, 61.87, 't', -0.77, 1.2, 1.14);

-- ----------------------------
-- Table structure for homes
-- ----------------------------
DROP TABLE IF EXISTS "public"."homes";
CREATE TABLE "public"."homes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of homes
-- ----------------------------
INSERT INTO "public"."homes" VALUES ('11111111-1111-1111-1111-111111111111', 'TSmartHome Demo', '2026-05-09 14:59:27.932645', '2026-06-17 16:55:43.247218');
INSERT INTO "public"."homes" VALUES ('20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Can ho Landmark 81', '2026-07-07 04:28:50.729375', '2026-07-07 04:28:50.729375');
INSERT INTO "public"."homes" VALUES ('6be703d5-d9cd-451c-8151-f0787801b6a0', 'testhoem', '2026-07-07 04:34:37.653457', '2026-07-07 04:34:37.653457');
INSERT INTO "public"."homes" VALUES ('13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'the home', '2026-07-07 12:14:00.04682', '2026-07-07 12:14:00.04682');
INSERT INTO "public"."homes" VALUES ('8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'home', '2026-07-07 13:00:32.476898', '2026-07-07 13:00:32.476898');
INSERT INTO "public"."homes" VALUES ('8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'hanoi', '2026-07-08 03:13:23.76089', '2026-07-08 03:13:23.76089');

-- ----------------------------
-- Table structure for mqtt_messages
-- ----------------------------
DROP TABLE IF EXISTS "public"."mqtt_messages";
CREATE TABLE "public"."mqtt_messages" (
  "id" int8 NOT NULL DEFAULT nextval('mqtt_messages_id_seq'::regclass),
  "topic" varchar(255) COLLATE "pg_catalog"."default",
  "payload" jsonb,
  "direction" varchar(10) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of mqtt_messages
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."notifications";
CREATE TABLE "public"."notifications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "message" text COLLATE "pg_catalog"."default",
  "is_read" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for otp_codes
-- ----------------------------
DROP TABLE IF EXISTS "public"."otp_codes";
CREATE TABLE "public"."otp_codes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "otp_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "is_used" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of otp_codes
-- ----------------------------
INSERT INTO "public"."otp_codes" VALUES ('a13bef5b-6483-47a5-99a7-b9e2311bc485', 'hantrung453@gmail.com', '592699', '2026-04-19 19:35:15.834178', 't', '2026-04-19 19:30:15.858046');
INSERT INTO "public"."otp_codes" VALUES ('6670cd18-b483-4a88-81f1-72c5356b3abd', 'hantrung453@gmail.com', '899775', '2026-04-20 09:58:24.427574', 'f', '2026-04-20 09:53:24.427574');
INSERT INTO "public"."otp_codes" VALUES ('d493dcfb-7180-40cf-b5f5-ed32c9c079b2', 'hantrung453@gmail.com', '076612', '2026-04-20 11:43:32.950121', 't', '2026-04-20 11:38:32.955119');
INSERT INTO "public"."otp_codes" VALUES ('4645b971-3f8b-4c23-ae84-9946afc997c2', 'hantrung453@gmail.com', '269300', '2026-04-20 13:02:56.63333', 'f', '2026-04-20 12:57:56.634331');
INSERT INTO "public"."otp_codes" VALUES ('3a975121-1c5e-440b-9919-1896fb4438e3', 'hantrung453@gmail.com', '436613', '2026-04-20 13:03:21.057621', 't', '2026-04-20 12:58:21.05862');
INSERT INTO "public"."otp_codes" VALUES ('4cc5c044-e567-4e4a-8b49-3c27e55d3d9a', 'hantrung453@gmail.com', '231488', '2026-06-01 07:01:37.187531', 'f', '2026-06-01 06:56:37.196532');
INSERT INTO "public"."otp_codes" VALUES ('b4345531-0fe2-498f-85d5-645f26fe99fb', 'hantrung453@gmail.com', '393228', '2026-06-15 02:17:22.035269', 'f', '2026-06-15 02:12:22.036271');

-- ----------------------------
-- Table structure for refresh_tokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."refresh_tokens";
CREATE TABLE "public"."refresh_tokens" (
  "id" uuid NOT NULL,
  "expiry_date" timestamptz(6) NOT NULL,
  "token" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" uuid
)
;

-- ----------------------------
-- Records of refresh_tokens
-- ----------------------------
INSERT INTO "public"."refresh_tokens" VALUES ('d832cae1-2eea-4897-b755-c0ff3a37eda1', '2026-08-07 03:12:40.258648+07', '982bf089-dab2-49f3-a104-121aec61ee72', '268800e9-702b-4cb2-b6eb-295befaca239');
INSERT INTO "public"."refresh_tokens" VALUES ('c76c12a4-3f04-4b47-ae96-bc06601d5aa7', '2026-08-11 11:46:43.50795+07', '78f698df-2c39-4da6-b741-50292d55f0fb', '1f0385a0-da98-49ad-907d-f1c880c0dfad');

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS "public"."rooms";
CREATE TABLE "public"."rooms" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "home_id" uuid,
  "name" varchar(100) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Cửa chính', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Phòng Khách', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Bếp', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Hành Lang', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Phòng Ngủ 1', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Phòng Ngủ 2', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Phòng Ngủ 3', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Ban Công 1', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Ban Công 2', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'WC 1', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'WC 2', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'WC 3', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('22222222-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'Toàn hệ thống', '2026-05-09 14:59:27.983346', '2026-05-09 14:59:27.983346');
INSERT INTO "public"."rooms" VALUES ('b1879a20-3779-4b05-93d9-6160bf4ad4ac', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Cửa chính', '2026-07-07 04:28:50.740287', '2026-07-07 04:28:50.740287');
INSERT INTO "public"."rooms" VALUES ('d0294a03-7348-41d9-bb4a-5d1813ee3d16', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Phòng Khách', '2026-07-07 04:28:50.755331', '2026-07-07 04:28:50.755331');
INSERT INTO "public"."rooms" VALUES ('b9c6fc1e-1f94-4847-9672-45efa44ae283', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Bếp', '2026-07-07 04:28:50.756331', '2026-07-07 04:28:50.756331');
INSERT INTO "public"."rooms" VALUES ('5e1cc89b-95df-4e54-b6b0-615285c31601', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Hành Lang', '2026-07-07 04:28:50.756331', '2026-07-07 04:28:50.756331');
INSERT INTO "public"."rooms" VALUES ('fa9b847d-0c53-49a0-844f-d9255444c749', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Phòng Ngủ 1', '2026-07-07 04:28:50.756331', '2026-07-07 04:28:50.756331');
INSERT INTO "public"."rooms" VALUES ('029bbb55-c6af-4da9-8f59-c4eb1f16995e', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Phòng Ngủ 2', '2026-07-07 04:28:50.758427', '2026-07-07 04:28:50.758427');
INSERT INTO "public"."rooms" VALUES ('8b6cc9fd-59e3-4121-804f-48429fa7b0ee', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Phòng Ngủ 3', '2026-07-07 04:28:50.758427', '2026-07-07 04:28:50.758427');
INSERT INTO "public"."rooms" VALUES ('328b998f-7071-44b0-891b-07fad1e52603', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Ban Công 1', '2026-07-07 04:28:50.758427', '2026-07-07 04:28:50.758427');
INSERT INTO "public"."rooms" VALUES ('993bd905-41ce-48c1-9ff1-477172e0ae93', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Ban Công 2', '2026-07-07 04:28:50.758427', '2026-07-07 04:28:50.758427');
INSERT INTO "public"."rooms" VALUES ('d14f58fb-161c-4f20-aa53-24a368daa241', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'WC 1', '2026-07-07 04:28:50.758427', '2026-07-07 04:28:50.758427');
INSERT INTO "public"."rooms" VALUES ('292e2df1-7004-45ad-9153-8f16ad7176ff', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'WC 2', '2026-07-07 04:28:50.760435', '2026-07-07 04:28:50.760435');
INSERT INTO "public"."rooms" VALUES ('a8439cca-3236-4982-aa99-f963340bb9d2', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'WC 3', '2026-07-07 04:28:50.760435', '2026-07-07 04:28:50.760435');
INSERT INTO "public"."rooms" VALUES ('8ad12728-288c-4efe-b137-b0db15a1fa29', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'Toàn hệ thống', '2026-07-07 04:28:50.760435', '2026-07-07 04:28:50.760435');
INSERT INTO "public"."rooms" VALUES ('b8f1225f-8926-4ba3-90b7-42d75c5d19b9', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Cửa chính', '2026-07-07 04:34:37.653457', '2026-07-07 04:34:37.653457');
INSERT INTO "public"."rooms" VALUES ('db8e4d53-bceb-486b-b757-ece443588e0b', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Phòng Khách', '2026-07-07 04:34:37.655468', '2026-07-07 04:34:37.655468');
INSERT INTO "public"."rooms" VALUES ('4bc7af43-d2f7-462c-84bd-8c60cce2ebbb', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Bếp', '2026-07-07 04:34:37.655468', '2026-07-07 04:34:37.655468');
INSERT INTO "public"."rooms" VALUES ('11411b27-ab37-4691-91dd-1d3e589fc235', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Hành Lang', '2026-07-07 04:34:37.655468', '2026-07-07 04:34:37.655468');
INSERT INTO "public"."rooms" VALUES ('73cf99f8-99ad-48ed-aad7-3ef03a6adc90', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Phòng Ngủ 1', '2026-07-07 04:34:37.655468', '2026-07-07 04:34:37.655468');
INSERT INTO "public"."rooms" VALUES ('242ce5fa-bb2f-44d0-ab0c-d075301afc44', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Phòng Ngủ 2', '2026-07-07 04:34:37.657475', '2026-07-07 04:34:37.657475');
INSERT INTO "public"."rooms" VALUES ('f3671ca4-1a8b-47f4-995b-061d19ae0a05', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Phòng Ngủ 3', '2026-07-07 04:34:37.657475', '2026-07-07 04:34:37.657475');
INSERT INTO "public"."rooms" VALUES ('4d838034-56df-4187-aeb9-35e8d86c5542', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Ban Công 1', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('7f504c1f-a746-4fba-86ea-bb09b9c70e95', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Ban Công 2', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('8fb0fb42-65bc-4833-b88a-f8238828485b', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'WC 1', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('a4f06018-94aa-4b1b-b3ac-9c43d104c3e6', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'WC 2', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('4c67862b-be1c-4bac-b2e6-9f1b61cacbbc', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'WC 3', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('5519882c-84b2-4fa7-82fa-6f3bf0a40242', '6be703d5-d9cd-451c-8151-f0787801b6a0', 'Toàn hệ thống', '2026-07-07 04:34:37.658479', '2026-07-07 04:34:37.658479');
INSERT INTO "public"."rooms" VALUES ('f0defc15-b911-44fa-b8b6-7592bdb70c95', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Cửa chính', '2026-07-07 12:14:00.04682', '2026-07-07 12:14:00.04682');
INSERT INTO "public"."rooms" VALUES ('eea4f21b-a0fe-46f3-b42b-0054470f23cd', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Phòng Khách', '2026-07-07 12:14:00.04779', '2026-07-07 12:14:00.04779');
INSERT INTO "public"."rooms" VALUES ('02ac0658-dd2c-4c48-aa5f-80d2962b824d', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Bếp', '2026-07-07 12:14:00.04779', '2026-07-07 12:14:00.04779');
INSERT INTO "public"."rooms" VALUES ('aaf89658-e452-4922-80f1-0984a2e9fce7', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Hành Lang', '2026-07-07 12:14:00.04779', '2026-07-07 12:14:00.04779');
INSERT INTO "public"."rooms" VALUES ('eddda474-53a3-4ea2-ab5f-9ca777408520', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Phòng Ngủ 1', '2026-07-07 12:14:00.04879', '2026-07-07 12:14:00.04879');
INSERT INTO "public"."rooms" VALUES ('bb22f561-2087-4f0b-9a2b-52726a4b17a7', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Phòng Ngủ 2', '2026-07-07 12:14:00.04879', '2026-07-07 12:14:00.04879');
INSERT INTO "public"."rooms" VALUES ('50e1f445-4aff-4834-a448-2beca7452120', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Phòng Ngủ 3', '2026-07-07 12:14:00.04879', '2026-07-07 12:14:00.04879');
INSERT INTO "public"."rooms" VALUES ('6721cd8f-e3fd-48da-9b9f-3986c4ce1e21', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Ban Công 1', '2026-07-07 12:14:00.04879', '2026-07-07 12:14:00.04879');
INSERT INTO "public"."rooms" VALUES ('b71a6250-47b2-492e-8aa6-e04f2b708a0a', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Ban Công 2', '2026-07-07 12:14:00.049794', '2026-07-07 12:14:00.049794');
INSERT INTO "public"."rooms" VALUES ('d0a141ac-c133-41a1-87fe-1122637c7b45', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'WC 1', '2026-07-07 12:14:00.049794', '2026-07-07 12:14:00.049794');
INSERT INTO "public"."rooms" VALUES ('8f3269cd-3406-4d97-8fe1-2fc641f44ebc', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'WC 2', '2026-07-07 12:14:00.049794', '2026-07-07 12:14:00.049794');
INSERT INTO "public"."rooms" VALUES ('b8d3b887-e243-46a9-8f05-3cb4ad60c9cc', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'WC 3', '2026-07-07 12:14:00.05079', '2026-07-07 12:14:00.05079');
INSERT INTO "public"."rooms" VALUES ('b5073e3c-20f9-4d48-93cc-1b955a75aec1', '13abaf00-9a8f-4a0b-8cca-3e25aeecb793', 'Toàn hệ thống', '2026-07-07 12:14:00.05079', '2026-07-07 12:14:00.05079');
INSERT INTO "public"."rooms" VALUES ('13a17dac-deaf-4395-9748-c15e7c67e67a', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Cửa chính', '2026-07-07 13:00:32.476898', '2026-07-07 13:00:32.476898');
INSERT INTO "public"."rooms" VALUES ('5693cf7f-a5b4-46d5-9c1f-d90d9436707f', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Phòng Khách', '2026-07-07 13:00:32.476898', '2026-07-07 13:00:32.476898');
INSERT INTO "public"."rooms" VALUES ('8bf7a1f2-88c8-4c3e-b2a3-3c4c9da872fc', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Bếp', '2026-07-07 13:00:32.476898', '2026-07-07 13:00:32.476898');
INSERT INTO "public"."rooms" VALUES ('7d88d862-6337-4c0c-8cf7-feedc794634a', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Hành Lang', '2026-07-07 13:00:32.476898', '2026-07-07 13:00:32.476898');
INSERT INTO "public"."rooms" VALUES ('6d45ed5d-b4d3-4b58-ba77-750544edb65c', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Phòng Ngủ 1', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('ace1c57b-170b-4d4a-b7b6-3fcf3bae63f7', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Phòng Ngủ 2', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('5939e215-c68a-4baa-b2d5-7b30e0bdd3b5', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Phòng Ngủ 3', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('f2665e96-6b44-4302-b3b1-1ecf13719916', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Ban Công 1', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('8ce345f9-7eb1-421f-9b2b-340dd766860d', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Ban Công 2', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('ca6c1a2d-e5cb-4a9d-b5c8-85bf5364feab', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'WC 1', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('e9fa8712-b947-47bf-9477-c80e92a05ec5', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'WC 2', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('90089b91-09b8-4db6-877c-f61fccb39ffb', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'WC 3', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('2cdf657a-504d-443a-9303-354355cac412', '8e41be92-b4e2-4689-a1d3-da3fe76cc5cf', 'Toàn hệ thống', '2026-07-07 13:00:32.492589', '2026-07-07 13:00:32.492589');
INSERT INTO "public"."rooms" VALUES ('2b6aa439-bee8-4b6d-ba3c-05f86774d2ce', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Cửa chính', '2026-07-08 03:13:23.762019', '2026-07-08 03:13:23.762019');
INSERT INTO "public"."rooms" VALUES ('adbb1865-4fc8-48ab-ad1d-2a6f72a4b02b', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Phòng Khách', '2026-07-08 03:13:23.763054', '2026-07-08 03:13:23.763054');
INSERT INTO "public"."rooms" VALUES ('0d11e360-bf39-40f3-bfcb-8ffa9fb2b44c', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Bếp', '2026-07-08 03:13:23.763054', '2026-07-08 03:13:23.763054');
INSERT INTO "public"."rooms" VALUES ('2444df0f-80bb-4783-b32b-6b24576dc5ba', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Hành Lang', '2026-07-08 03:13:23.764026', '2026-07-08 03:13:23.764026');
INSERT INTO "public"."rooms" VALUES ('ac5f00b4-f015-427c-b06f-7e4d9573e804', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Phòng Ngủ 1', '2026-07-08 03:13:23.764026', '2026-07-08 03:13:23.764026');
INSERT INTO "public"."rooms" VALUES ('107034d5-bf5a-4119-a2e0-83af33782fc4', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Phòng Ngủ 2', '2026-07-08 03:13:23.765026', '2026-07-08 03:13:23.765026');
INSERT INTO "public"."rooms" VALUES ('fc103bee-ab88-4e58-b94d-e67c79f492d3', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Phòng Ngủ 3', '2026-07-08 03:13:23.765026', '2026-07-08 03:13:23.765026');
INSERT INTO "public"."rooms" VALUES ('32aa01dc-78d8-41e2-9f58-d1050b1d6467', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Ban Công 1', '2026-07-08 03:13:23.765026', '2026-07-08 03:13:23.765026');
INSERT INTO "public"."rooms" VALUES ('dc6f7751-f38e-4cac-b4c6-23116877f508', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Ban Công 2', '2026-07-08 03:13:23.766056', '2026-07-08 03:13:23.766056');
INSERT INTO "public"."rooms" VALUES ('19b94bea-97ce-4402-8879-2fbd2deec776', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'WC 1', '2026-07-08 03:13:23.766056', '2026-07-08 03:13:23.766056');
INSERT INTO "public"."rooms" VALUES ('05f5b370-ac70-4592-a288-5238fcfdd54b', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'WC 2', '2026-07-08 03:13:23.766056', '2026-07-08 03:13:23.766056');
INSERT INTO "public"."rooms" VALUES ('a6ccc73c-7de3-41ea-b305-70a7cc52d64a', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'WC 3', '2026-07-08 03:13:23.766056', '2026-07-08 03:13:23.766056');
INSERT INTO "public"."rooms" VALUES ('4e53b980-549a-4c70-92e2-11e7a7d7251f', '8fd45f22-f5ed-4028-803e-ceffa0fb13e1', 'Toàn hệ thống', '2026-07-08 03:13:23.767328', '2026-07-08 03:13:23.767328');

-- ----------------------------
-- Table structure for scene_actions
-- ----------------------------
DROP TABLE IF EXISTS "public"."scene_actions";
CREATE TABLE "public"."scene_actions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "scene_id" uuid,
  "device_id" uuid,
  "action" jsonb
)
;

-- ----------------------------
-- Records of scene_actions
-- ----------------------------

-- ----------------------------
-- Table structure for scenes
-- ----------------------------
DROP TABLE IF EXISTS "public"."scenes";
CREATE TABLE "public"."scenes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "home_id" uuid,
  "name" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of scenes
-- ----------------------------

-- ----------------------------
-- Table structure for schedules
-- ----------------------------
DROP TABLE IF EXISTS "public"."schedules";
CREATE TABLE "public"."schedules" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "device_id" uuid,
  "action" jsonb,
  "execute_time" timestamp(6),
  "is_active" bool DEFAULT true,
  "cron_expression" varchar(50) COLLATE "pg_catalog"."default",
  "schedule_type" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'ONCE'::character varying,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of schedules
-- ----------------------------
INSERT INTO "public"."schedules" VALUES ('11f41c73-6287-4987-b4f4-0d1395c02210', '83a5181a-cf88-452f-b566-b6b57a6dbd9a', '{"state": true, "deviceId": "bedroom2_light_main"}', NULL, 't', '02:29', 'DAILY', '2026-06-11 02:29:00.004463');
INSERT INTO "public"."schedules" VALUES ('e867173d-976b-4c96-8d5a-268d1af05ce7', 'd41d8cd9-8f00-3204-a980-0998ecf8427e', '{"state": true, "deviceId": "livingroom_sensor_radar2"}', NULL, 't', '12:48', 'DAILY', '2026-06-15 12:48:00.015052');
INSERT INTO "public"."schedules" VALUES ('307c81c3-5810-4168-9b0c-15ded0e18bcb', 'd41d8cd9-8f00-3204-a980-0998ecf8427e', '{"state": true, "deviceId": "livingroom_sensor_radar2"}', NULL, 't', '12:48', 'DAILY', '2026-06-16 23:01:46.090099');
INSERT INTO "public"."schedules" VALUES ('898a70d8-fe41-48d6-a90d-741709c9f1b9', 'd41d8cd9-8f00-3204-a980-0998ecf8427e', '{"state": false, "deviceId": "livingroom_sensor_radar2"}', NULL, 't', '02:03', 'DAILY', '2026-06-22 02:03:00.016766');

-- ----------------------------
-- Table structure for sensor_data
-- ----------------------------
DROP TABLE IF EXISTS "public"."sensor_data";
CREATE TABLE "public"."sensor_data" (
  "id" int8 NOT NULL DEFAULT nextval('sensor_data_id_seq'::regclass),
  "device_id" uuid,
  "value" jsonb,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of sensor_data
-- ----------------------------

-- ----------------------------
-- Table structure for telegram_link_codes
-- ----------------------------
DROP TABLE IF EXISTS "public"."telegram_link_codes";
CREATE TABLE "public"."telegram_link_codes" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "code" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "is_used" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of telegram_link_codes
-- ----------------------------
INSERT INTO "public"."telegram_link_codes" VALUES ('52b2c334-b80b-480d-92a8-77033d2b479a', '1f0385a0-da98-49ad-907d-f1c880c0dfad', 'TSM-PJA4QO', '2026-06-20 17:56:34.367074', 't', '2026-06-20 17:46:34.369069');

-- ----------------------------
-- Table structure for user_homes
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_homes";
CREATE TABLE "public"."user_homes" (
  "user_id" uuid NOT NULL,
  "home_id" uuid NOT NULL,
  "role" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'member'::character varying
)
;

-- ----------------------------
-- Records of user_homes
-- ----------------------------
INSERT INTO "public"."user_homes" VALUES ('1f0385a0-da98-49ad-907d-f1c880c0dfad', '11111111-1111-1111-1111-111111111111', 'owner');
INSERT INTO "public"."user_homes" VALUES ('b6ac1c1b-bfa3-4a4c-a157-343b2eb5f1ea', '20a515c1-0548-4f0f-8bcd-5b5cd1b44790', 'owner');

-- ----------------------------
-- Table structure for user_profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_profiles";
CREATE TABLE "public"."user_profiles" (
  "user_id" uuid NOT NULL,
  "avatar_url" varchar(255) COLLATE "pg_catalog"."default",
  "phone_number" varchar(20) COLLATE "pg_catalog"."default",
  "region" varchar(100) COLLATE "pg_catalog"."default",
  "telegram_chat_id" varchar(100) COLLATE "pg_catalog"."default",
  "updated_at" timestamp(6),
  "telegram_username" varchar(100) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of user_profiles
-- ----------------------------
INSERT INTO "public"."user_profiles" VALUES ('1f0385a0-da98-49ad-907d-f1c880c0dfad', 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', '0335625672', 'Việt Nam', '5715975017', '2026-06-20 17:46:44.336235', 'Han Trung');
INSERT INTO "public"."user_profiles" VALUES ('c40fc44a-ec9c-4789-ad35-41c07d082d3a', NULL, '0335625672', 'Đồng Nai', NULL, '2026-07-05 16:55:18.880427', NULL);
INSERT INTO "public"."user_profiles" VALUES ('fb8cc7c1-f1f1-4be3-976b-c2e7b6f88a6f', NULL, '0335625672', 'Đồng Nai, vườn xoài', NULL, '2026-07-05 16:55:32.359945', NULL);
INSERT INTO "public"."user_profiles" VALUES ('eb91f187-b701-457e-b177-cf69c48978fa', NULL, '0335625672', 'Đồng Nai', NULL, '2026-07-07 17:17:22.648796', NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "first_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "password_hash" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_verified" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "system_role" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'USER'::character varying,
  "is_locked" bool NOT NULL DEFAULT false
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES ('c40fc44a-ec9c-4789-ad35-41c07d082d3a', 'han', 'trung', 'hant1@gmail.com', '$2a$10$omNQXZaoM06oOq/BWeBbi.DRAHXyYMTFIsfly4aExGUEvPtnZ/qIa', 'f', '2026-04-18 09:53:25.602707', '2026-04-18 09:53:25.602707', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('fb8cc7c1-f1f1-4be3-976b-c2e7b6f88a6f', 'Hán', 'Trung', 'h@gmail.com', '$2a$10$QgKkewXarKtW3.OlRkdlD.tBLC4wDwodUil647uE4BEqlfx52cSEa', 'f', '2026-04-18 15:52:31.27387', '2026-04-18 15:52:31.27387', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('87738872-3ce7-449d-89bf-175384e1f8f8', 'Hán', 'Trung', 'ht@gmail.com', '$2a$10$wapkqGdaJqiDwR/BPauBm.VXiAd5zd5e3KMN0AYzYXHZ.3kXelFR.', 'f', '2026-04-18 16:24:07.38781', '2026-04-18 16:24:07.38781', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('c1e0c1c8-16ef-4724-b8d7-89d242ea4d76', 'Hán', 'Trung', 'hrt@gmail.com', '$2a$10$emNkZ1AneBqzUekXsiYPyuuJgNDXqXd35rMXzEauERJua/IDYf01S', 'f', '2026-04-18 16:24:23.471318', '2026-04-18 16:24:23.471318', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('1d8d985c-ccbb-454f-a9b1-3c7bc4dd2e10', 'Hán', 'Trung', 'hrt4@gmail.com', '$2a$10$Ygyc0yEu5EYhDDmtMEnYuezeuCKs7GMkkR4zQL1hJPOrSd2gRBBEq', 'f', '2026-04-18 16:26:47.989555', '2026-04-18 16:26:47.989555', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('268800e9-702b-4cb2-b6eb-295befaca239', 'han', 'trung', 'hant@gmail.com', '$2a$10$eVk5A.p.zjrl7XttXepIvuth3p5ZFs/qwL7YOkRVbVuQcbRMyh2GG', 'f', '2026-04-18 07:30:29.071599', '2026-06-27 01:39:19.805841', 'ADMIN', 'f');
INSERT INTO "public"."users" VALUES ('1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hán', 'Trung', 'hantrung453@gmail.com', '$2a$10$eVk5A.p.zjrl7XttXepIvuth3p5ZFs/qwL7YOkRVbVuQcbRMyh2GG', 't', '2026-04-18 14:07:47.042061', '2026-07-05 16:55:55.485319', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('1f7a833c-20d1-4274-8ae3-7ed600fcc82a', 'Test', 'Admin', 'testadmin@tsmarthome.com', '$2a$10$T9/0I3goU7A4bGhFEBc9zett5f0Do.iQR3K4aets1sFTWxBrVxqIq', 't', '2026-07-07 04:25:27.647625', '2026-07-07 04:25:27.647625', 'ADMIN', 'f');
INSERT INTO "public"."users" VALUES ('b6ac1c1b-bfa3-4a4c-a157-343b2eb5f1ea', 'Admin', 'User', 'admin@tsmarthome.com', '$2a$10$CuItXq9p/89KCVO8P2TN3eOsT6jCYumeka6e0UOaRPmjj8xp2D9sq', 'f', '2026-07-07 16:30:23.350333', '2026-07-07 16:30:23.350333', 'USER', 'f');
INSERT INTO "public"."users" VALUES ('eb91f187-b701-457e-b177-cf69c48978fa', 'hanádasd', 'trungádasd', 'hant123@gmail.com', '$2a$10$KBeghErRoGN1EidPHBo0LOHgln/e12YgXzZmQOVZqXe6Hd312mBMe', 't', '2026-07-07 17:17:22.63428', '2026-07-07 17:17:22.63428', 'USER', 'f');

-- ----------------------------
-- Function structure for armor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."armor"(bytea);
CREATE FUNCTION "public"."armor"(bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_armor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for armor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."armor"(bytea, _text, _text);
CREATE FUNCTION "public"."armor"(bytea, _text, _text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_armor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for crypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."crypt"(text, text);
CREATE FUNCTION "public"."crypt"(text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_crypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for dearmor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."dearmor"(text);
CREATE FUNCTION "public"."dearmor"(text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_dearmor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."decrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."decrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_decrypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for decrypt_iv
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."decrypt_iv"(bytea, bytea, bytea, text);
CREATE FUNCTION "public"."decrypt_iv"(bytea, bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_decrypt_iv'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for digest
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."digest"(text, text);
CREATE FUNCTION "public"."digest"(text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_digest'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for digest
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."digest"(bytea, text);
CREATE FUNCTION "public"."digest"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_digest'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."encrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."encrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_encrypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for encrypt_iv
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."encrypt_iv"(bytea, bytea, bytea, text);
CREATE FUNCTION "public"."encrypt_iv"(bytea, bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_encrypt_iv'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for fips_mode
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."fips_mode"();
CREATE FUNCTION "public"."fips_mode"()
  RETURNS "pg_catalog"."bool" AS '$libdir/pgcrypto', 'pg_check_fipsmode'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_random_bytes
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_random_bytes"(int4);
CREATE FUNCTION "public"."gen_random_bytes"(int4)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_random_bytes'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_random_uuid
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_random_uuid"();
CREATE FUNCTION "public"."gen_random_uuid"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/pgcrypto', 'pg_random_uuid'
  LANGUAGE c VOLATILE
  COST 1;

-- ----------------------------
-- Function structure for gen_salt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_salt"(text);
CREATE FUNCTION "public"."gen_salt"(text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_gen_salt'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_salt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_salt"(text, int4);
CREATE FUNCTION "public"."gen_salt"(text, int4)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_gen_salt_rounds'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for hmac
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."hmac"(bytea, bytea, text);
CREATE FUNCTION "public"."hmac"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_hmac'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for hmac
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."hmac"(text, text, text);
CREATE FUNCTION "public"."hmac"(text, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_hmac'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_armor_headers
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_armor_headers"(text, OUT "key" text, OUT "value" text);
CREATE FUNCTION "public"."pgp_armor_headers"(IN text, OUT "key" text, OUT "value" text)
  RETURNS SETOF "pg_catalog"."record" AS '$libdir/pgcrypto', 'pgp_armor_headers'
  LANGUAGE c IMMUTABLE STRICT
  COST 1
  ROWS 1000;

-- ----------------------------
-- Function structure for pgp_key_id
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_key_id"(bytea);
CREATE FUNCTION "public"."pgp_key_id"(bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_key_id_w'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea, text, text);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea, text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text, text);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt"(text, bytea);
CREATE FUNCTION "public"."pgp_pub_encrypt"(text, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt"(text, bytea, text);
CREATE FUNCTION "public"."pgp_pub_encrypt"(text, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt_bytea"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_encrypt_bytea"(bytea, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt_bytea"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_encrypt_bytea"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_decrypt"(bytea, text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_decrypt"(bytea, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt_bytea"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_decrypt_bytea"(bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt_bytea"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_decrypt_bytea"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt"(text, text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt"(text, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt"(text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt"(text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt_bytea"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_encrypt_bytea"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt_bytea"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt_bytea"(bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for update_updated_at_column
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_updated_at_column"();
CREATE FUNCTION "public"."update_updated_at_column"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."device_logs_id_seq"
OWNED BY "public"."device_logs"."id";
SELECT setval('"public"."device_logs_id_seq"', 80433, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."mqtt_messages_id_seq"
OWNED BY "public"."mqtt_messages"."id";
SELECT setval('"public"."mqtt_messages_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."sensor_data_id_seq"
OWNED BY "public"."sensor_data"."id";
SELECT setval('"public"."sensor_data_id_seq"', 80433, true);

-- ----------------------------
-- Indexes structure for table assistant_chats
-- ----------------------------
CREATE INDEX "idx_assistant_chats_user_time" ON "public"."assistant_chats" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table assistant_chats
-- ----------------------------
ALTER TABLE "public"."assistant_chats" ADD CONSTRAINT "assistant_chats_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table audit_logs
-- ----------------------------
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table automation_rules
-- ----------------------------
ALTER TABLE "public"."automation_rules" ADD CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table camera_captures
-- ----------------------------
ALTER TABLE "public"."camera_captures" ADD CONSTRAINT "camera_captures_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table camera_streams
-- ----------------------------
ALTER TABLE "public"."camera_streams" ADD CONSTRAINT "camera_streams_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table device_logs
-- ----------------------------
ALTER TABLE "public"."device_logs" ADD CONSTRAINT "device_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table device_states
-- ----------------------------
ALTER TABLE "public"."device_states" ADD CONSTRAINT "device_states_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table device_tokens
-- ----------------------------
ALTER TABLE "public"."device_tokens" ADD CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("device_id");

-- ----------------------------
-- Indexes structure for table devices
-- ----------------------------
CREATE INDEX "idx_devices_room" ON "public"."devices" USING btree (
  "room_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table devices
-- ----------------------------
CREATE TRIGGER "trg_devices_updated_at" BEFORE UPDATE ON "public"."devices"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table devices
-- ----------------------------
ALTER TABLE "public"."devices" ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table homes
-- ----------------------------
CREATE TRIGGER "trg_homes_updated_at" BEFORE UPDATE ON "public"."homes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table homes
-- ----------------------------
ALTER TABLE "public"."homes" ADD CONSTRAINT "homes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table mqtt_messages
-- ----------------------------
ALTER TABLE "public"."mqtt_messages" ADD CONSTRAINT "mqtt_messages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table notifications
-- ----------------------------
CREATE INDEX "idx_notifications_user" ON "public"."notifications" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table otp_codes
-- ----------------------------
ALTER TABLE "public"."otp_codes" ADD CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table refresh_tokens
-- ----------------------------
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "ukghpmfn23vmxfu3spu3lfg4r2d" UNIQUE ("token");
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "uk7tdcd6ab5wsgoudnvj7xf1b7l" UNIQUE ("user_id");

-- ----------------------------
-- Primary Key structure for table refresh_tokens
-- ----------------------------
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table rooms
-- ----------------------------
CREATE INDEX "idx_rooms_home" ON "public"."rooms" USING btree (
  "home_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table rooms
-- ----------------------------
CREATE TRIGGER "trg_rooms_updated_at" BEFORE UPDATE ON "public"."rooms"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table rooms
-- ----------------------------
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table scene_actions
-- ----------------------------
ALTER TABLE "public"."scene_actions" ADD CONSTRAINT "scene_actions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table scenes
-- ----------------------------
ALTER TABLE "public"."scenes" ADD CONSTRAINT "scenes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table schedules
-- ----------------------------
CREATE TRIGGER "trg_schedules_updated_at" BEFORE UPDATE ON "public"."schedules"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table schedules
-- ----------------------------
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sensor_data
-- ----------------------------
CREATE INDEX "idx_sensor_device_time" ON "public"."sensor_data" USING btree (
  "device_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_sensor_json" ON "public"."sensor_data" USING gin (
  "value" "pg_catalog"."jsonb_ops"
);

-- ----------------------------
-- Primary Key structure for table sensor_data
-- ----------------------------
ALTER TABLE "public"."sensor_data" ADD CONSTRAINT "sensor_data_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table telegram_link_codes
-- ----------------------------
ALTER TABLE "public"."telegram_link_codes" ADD CONSTRAINT "telegram_link_codes_code_key" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table telegram_link_codes
-- ----------------------------
ALTER TABLE "public"."telegram_link_codes" ADD CONSTRAINT "telegram_link_codes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table user_homes
-- ----------------------------
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_pkey" PRIMARY KEY ("user_id", "home_id");

-- ----------------------------
-- Primary Key structure for table user_profiles
-- ----------------------------
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");

-- ----------------------------
-- Triggers structure for table users
-- ----------------------------
CREATE TRIGGER "trg_users_updated_at" BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table automation_rules
-- ----------------------------
ALTER TABLE "public"."automation_rules" ADD CONSTRAINT "automation_rules_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."homes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table camera_captures
-- ----------------------------
ALTER TABLE "public"."camera_captures" ADD CONSTRAINT "fk93wll5k7pawai351x0a9ccsa3" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table camera_streams
-- ----------------------------
ALTER TABLE "public"."camera_streams" ADD CONSTRAINT "camera_streams_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table device_logs
-- ----------------------------
ALTER TABLE "public"."device_logs" ADD CONSTRAINT "device_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table device_states
-- ----------------------------
ALTER TABLE "public"."device_states" ADD CONSTRAINT "device_states_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table device_tokens
-- ----------------------------
ALTER TABLE "public"."device_tokens" ADD CONSTRAINT "device_tokens_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table devices
-- ----------------------------
ALTER TABLE "public"."devices" ADD CONSTRAINT "devices_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table refresh_tokens
-- ----------------------------
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "fk1lih5y2npsf8u5o3vhdb9y0os" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table rooms
-- ----------------------------
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."homes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table scene_actions
-- ----------------------------
ALTER TABLE "public"."scene_actions" ADD CONSTRAINT "scene_actions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."scene_actions" ADD CONSTRAINT "scene_actions_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "public"."scenes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table scenes
-- ----------------------------
ALTER TABLE "public"."scenes" ADD CONSTRAINT "scenes_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."homes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table schedules
-- ----------------------------
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sensor_data
-- ----------------------------
ALTER TABLE "public"."sensor_data" ADD CONSTRAINT "sensor_data_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table telegram_link_codes
-- ----------------------------
ALTER TABLE "public"."telegram_link_codes" ADD CONSTRAINT "fk_telegram_link_codes_user" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_homes
-- ----------------------------
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."homes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_profiles
-- ----------------------------
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "fkjcad5nfve11khsnpwj1mv8frj" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

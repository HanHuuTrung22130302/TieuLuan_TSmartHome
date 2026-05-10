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

 Date: 11/05/2026 03:49:20
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
INSERT INTO "public"."device_logs" VALUES (1, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315252}', '2026-05-09 15:27:32.065908');
INSERT INTO "public"."device_logs" VALUES (2, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315282}', '2026-05-09 15:28:02.240267');
INSERT INTO "public"."device_logs" VALUES (3, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315302}', '2026-05-09 15:28:22.465453');
INSERT INTO "public"."device_logs" VALUES (4, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315305}', '2026-05-09 15:28:25.792764');
INSERT INTO "public"."device_logs" VALUES (5, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315319}', '2026-05-09 15:28:39.862818');
INSERT INTO "public"."device_logs" VALUES (6, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315322}', '2026-05-09 15:28:42.398255');
INSERT INTO "public"."device_logs" VALUES (7, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315341}', '2026-05-09 15:29:01.015864');
INSERT INTO "public"."device_logs" VALUES (8, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315342}', '2026-05-09 15:29:02.211032');
INSERT INTO "public"."device_logs" VALUES (9, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315345}', '2026-05-09 15:29:05.09089');
INSERT INTO "public"."device_logs" VALUES (10, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315362}', '2026-05-09 15:29:22.563751');
INSERT INTO "public"."device_logs" VALUES (11, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315404}', '2026-05-09 15:30:04.293783');
INSERT INTO "public"."device_logs" VALUES (12, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315410}', '2026-05-09 15:30:10.434315');
INSERT INTO "public"."device_logs" VALUES (13, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315412}', '2026-05-09 15:30:12.471924');
INSERT INTO "public"."device_logs" VALUES (14, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315432}', '2026-05-09 15:30:32.681774');
INSERT INTO "public"."device_logs" VALUES (15, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315452}', '2026-05-09 15:30:52.630848');
INSERT INTO "public"."device_logs" VALUES (16, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315461}', '2026-05-09 15:31:01.53853');
INSERT INTO "public"."device_logs" VALUES (17, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315462}', '2026-05-09 15:31:02.562212');
INSERT INTO "public"."device_logs" VALUES (18, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315492}', '2026-05-09 15:31:32.692239');
INSERT INTO "public"."device_logs" VALUES (19, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315494}', '2026-05-09 15:31:34.852601');
INSERT INTO "public"."device_logs" VALUES (20, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315502}', '2026-05-09 15:31:42.968301');
INSERT INTO "public"."device_logs" VALUES (21, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315512}', '2026-05-09 15:31:52.764812');
INSERT INTO "public"."device_logs" VALUES (22, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315522}', '2026-05-09 15:32:03.180676');
INSERT INTO "public"."device_logs" VALUES (23, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315525}', '2026-05-09 15:32:05.566049');
INSERT INTO "public"."device_logs" VALUES (24, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315562}', '2026-05-09 15:32:43.111762');
INSERT INTO "public"."device_logs" VALUES (25, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315603}', '2026-05-09 15:33:23.062916');
INSERT INTO "public"."device_logs" VALUES (26, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315613}', '2026-05-09 15:33:33.10324');
INSERT INTO "public"."device_logs" VALUES (27, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315623}', '2026-05-09 15:33:43.431722');
INSERT INTO "public"."device_logs" VALUES (28, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315683}', '2026-05-09 15:34:43.329815');
INSERT INTO "public"."device_logs" VALUES (29, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315693}', '2026-05-09 15:34:53.472841');
INSERT INTO "public"."device_logs" VALUES (30, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315713}', '2026-05-09 15:35:13.728595');
INSERT INTO "public"."device_logs" VALUES (31, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315753}', '2026-05-09 15:35:53.676603');
INSERT INTO "public"."device_logs" VALUES (32, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315763}', '2026-05-09 15:36:03.650088');
INSERT INTO "public"."device_logs" VALUES (33, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315773}', '2026-05-09 15:36:13.885735');
INSERT INTO "public"."device_logs" VALUES (34, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315793}', '2026-05-09 15:36:33.738252');
INSERT INTO "public"."device_logs" VALUES (35, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315813}', '2026-05-09 15:36:53.885409');
INSERT INTO "public"."device_logs" VALUES (36, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315823}', '2026-05-09 15:37:03.930136');
INSERT INTO "public"."device_logs" VALUES (37, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315833}', '2026-05-09 15:37:13.99153');
INSERT INTO "public"."device_logs" VALUES (38, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315843}', '2026-05-09 15:37:24.188552');
INSERT INTO "public"."device_logs" VALUES (39, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315853}', '2026-05-09 15:37:34.263538');
INSERT INTO "public"."device_logs" VALUES (40, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315884}', '2026-05-09 15:38:04.107381');
INSERT INTO "public"."device_logs" VALUES (41, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315894}', '2026-05-09 15:38:14.11366');
INSERT INTO "public"."device_logs" VALUES (42, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315924}', '2026-05-09 15:38:44.201355');
INSERT INTO "public"."device_logs" VALUES (43, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315944}', '2026-05-09 15:39:04.337815');
INSERT INTO "public"."device_logs" VALUES (44, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778315954}', '2026-05-09 15:39:14.370836');
INSERT INTO "public"."device_logs" VALUES (45, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315954}', '2026-05-09 15:39:14.382354');
INSERT INTO "public"."device_logs" VALUES (46, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778315974}', '2026-05-09 15:39:34.562912');
INSERT INTO "public"."device_logs" VALUES (47, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316014}', '2026-05-09 15:40:14.470578');
INSERT INTO "public"."device_logs" VALUES (48, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316044}', '2026-05-09 15:40:44.605291');
INSERT INTO "public"."device_logs" VALUES (49, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316064}', '2026-05-09 15:41:04.561225');
INSERT INTO "public"."device_logs" VALUES (50, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316114}', '2026-05-09 15:41:55.050693');
INSERT INTO "public"."device_logs" VALUES (51, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316124}', '2026-05-09 15:42:04.984475');
INSERT INTO "public"."device_logs" VALUES (52, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316144}', '2026-05-09 15:42:24.849013');
INSERT INTO "public"."device_logs" VALUES (53, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316164}', '2026-05-09 15:42:45.036778');
INSERT INTO "public"."device_logs" VALUES (54, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316185}', '2026-05-09 15:43:04.96877');
INSERT INTO "public"."device_logs" VALUES (55, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316195}', '2026-05-09 15:43:14.918055');
INSERT INTO "public"."device_logs" VALUES (56, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316205}', '2026-05-09 15:43:25.281779');
INSERT INTO "public"."device_logs" VALUES (57, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316215}', '2026-05-09 15:43:35.315698');
INSERT INTO "public"."device_logs" VALUES (58, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316255}', '2026-05-09 15:44:15.315825');
INSERT INTO "public"."device_logs" VALUES (59, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316265}', '2026-05-09 15:44:25.287955');
INSERT INTO "public"."device_logs" VALUES (60, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316275}', '2026-05-09 15:44:35.428427');
INSERT INTO "public"."device_logs" VALUES (61, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316295}', '2026-05-09 15:44:55.579106');
INSERT INTO "public"."device_logs" VALUES (62, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316305}', '2026-05-09 15:45:05.394877');
INSERT INTO "public"."device_logs" VALUES (63, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316315}', '2026-05-09 15:45:15.648746');
INSERT INTO "public"."device_logs" VALUES (64, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316325}', '2026-05-09 15:45:25.473965');
INSERT INTO "public"."device_logs" VALUES (65, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316355}', '2026-05-09 15:45:55.660977');
INSERT INTO "public"."device_logs" VALUES (66, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316365}', '2026-05-09 15:46:05.72078');
INSERT INTO "public"."device_logs" VALUES (67, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316375}', '2026-05-09 15:46:15.538798');
INSERT INTO "public"."device_logs" VALUES (68, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316395}', '2026-05-09 15:46:35.816627');
INSERT INTO "public"."device_logs" VALUES (69, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316425}', '2026-05-09 15:47:05.826361');
INSERT INTO "public"."device_logs" VALUES (70, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316445}', '2026-05-09 15:47:25.922607');
INSERT INTO "public"."device_logs" VALUES (71, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316475}', '2026-05-09 15:47:56.014913');
INSERT INTO "public"."device_logs" VALUES (72, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316486}', '2026-05-09 15:48:05.931606');
INSERT INTO "public"."device_logs" VALUES (73, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316566}', '2026-05-09 15:49:26.352168');
INSERT INTO "public"."device_logs" VALUES (74, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316596}', '2026-05-09 15:49:56.613694');
INSERT INTO "public"."device_logs" VALUES (75, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316605}', '2026-05-09 15:50:05.827151');
INSERT INTO "public"."device_logs" VALUES (76, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316626}', '2026-05-09 15:50:26.9396');
INSERT INTO "public"."device_logs" VALUES (77, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316656}', '2026-05-09 15:50:56.733529');
INSERT INTO "public"."device_logs" VALUES (78, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316677}', '2026-05-09 15:51:16.99471');
INSERT INTO "public"."device_logs" VALUES (79, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316689}', '2026-05-09 15:51:29.787483');
INSERT INTO "public"."device_logs" VALUES (80, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316694}', '2026-05-09 15:51:34.21878');
INSERT INTO "public"."device_logs" VALUES (81, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316697}', '2026-05-09 15:51:37.1952');
INSERT INTO "public"."device_logs" VALUES (82, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316711}', '2026-05-09 15:51:51.650885');
INSERT INTO "public"."device_logs" VALUES (83, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316717}', '2026-05-09 15:51:57.252588');
INSERT INTO "public"."device_logs" VALUES (84, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316726}', '2026-05-09 15:52:06.435815');
INSERT INTO "public"."device_logs" VALUES (85, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316727}', '2026-05-09 15:52:07.398987');
INSERT INTO "public"."device_logs" VALUES (86, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316737}', '2026-05-09 15:52:17.245746');
INSERT INTO "public"."device_logs" VALUES (87, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316743}', '2026-05-09 15:52:23.524476');
INSERT INTO "public"."device_logs" VALUES (88, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316752}', '2026-05-09 15:52:32.708705');
INSERT INTO "public"."device_logs" VALUES (89, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316757}', '2026-05-09 15:52:37.605934');
INSERT INTO "public"."device_logs" VALUES (90, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316787}', '2026-05-09 15:53:07.748079');
INSERT INTO "public"."device_logs" VALUES (91, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316793}', '2026-05-09 15:53:13.958978');
INSERT INTO "public"."device_logs" VALUES (92, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316813}', '2026-05-09 15:53:33.859702');
INSERT INTO "public"."device_logs" VALUES (93, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316829}', '2026-05-09 15:53:49.094281');
INSERT INTO "public"."device_logs" VALUES (94, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316871}', '2026-05-09 15:54:31.765612');
INSERT INTO "public"."device_logs" VALUES (95, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316879}', '2026-05-09 15:54:39.962708');
INSERT INTO "public"."device_logs" VALUES (96, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316903}', '2026-05-09 15:55:03.522855');
INSERT INTO "public"."device_logs" VALUES (97, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316910}', '2026-05-09 15:55:12.262356');
INSERT INTO "public"."device_logs" VALUES (98, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316910}', '2026-05-09 15:55:12.270934');
INSERT INTO "public"."device_logs" VALUES (99, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316913}', '2026-05-09 15:55:13.494251');
INSERT INTO "public"."device_logs" VALUES (100, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316923}', '2026-05-09 15:55:23.850031');
INSERT INTO "public"."device_logs" VALUES (101, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316934}', '2026-05-09 15:55:34.452837');
INSERT INTO "public"."device_logs" VALUES (102, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316941}', '2026-05-09 15:55:41.244938');
INSERT INTO "public"."device_logs" VALUES (103, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316943}', '2026-05-09 15:55:43.600405');
INSERT INTO "public"."device_logs" VALUES (104, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316945}', '2026-05-09 15:55:45.809084');
INSERT INTO "public"."device_logs" VALUES (105, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316946}', '2026-05-09 15:55:46.851697');
INSERT INTO "public"."device_logs" VALUES (106, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316953}', '2026-05-09 15:55:53.897722');
INSERT INTO "public"."device_logs" VALUES (107, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316961}', '2026-05-09 15:56:01.033217');
INSERT INTO "public"."device_logs" VALUES (108, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316973}', '2026-05-09 15:56:13.897561');
INSERT INTO "public"."device_logs" VALUES (109, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778316983}', '2026-05-09 15:56:23.872328');
INSERT INTO "public"."device_logs" VALUES (110, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316987}', '2026-05-09 15:56:27.301908');
INSERT INTO "public"."device_logs" VALUES (111, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316991}', '2026-05-09 15:56:31.803557');
INSERT INTO "public"."device_logs" VALUES (112, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316993}', '2026-05-09 15:56:33.613723');
INSERT INTO "public"."device_logs" VALUES (113, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778316998}', '2026-05-09 15:56:41.323078');
INSERT INTO "public"."device_logs" VALUES (114, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317004}', '2026-05-09 15:56:44.058721');
INSERT INTO "public"."device_logs" VALUES (115, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317006}', '2026-05-09 15:56:46.86961');
INSERT INTO "public"."device_logs" VALUES (116, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317008}', '2026-05-09 15:56:48.415802');
INSERT INTO "public"."device_logs" VALUES (117, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317014}', '2026-05-09 15:56:54.224675');
INSERT INTO "public"."device_logs" VALUES (118, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317024}', '2026-05-09 15:57:04.194993');
INSERT INTO "public"."device_logs" VALUES (119, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317058}', '2026-05-09 15:57:38.444493');
INSERT INTO "public"."device_logs" VALUES (120, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317059}', '2026-05-09 15:57:39.875855');
INSERT INTO "public"."device_logs" VALUES (121, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317060}', '2026-05-09 15:57:40.588197');
INSERT INTO "public"."device_logs" VALUES (122, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317087}', '2026-05-09 15:58:07.744176');
INSERT INTO "public"."device_logs" VALUES (123, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317101}', '2026-05-09 15:58:21.097046');
INSERT INTO "public"."device_logs" VALUES (124, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317120}', '2026-05-09 15:58:42.223511');
INSERT INTO "public"."device_logs" VALUES (125, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317130}', '2026-05-09 15:58:50.24673');
INSERT INTO "public"."device_logs" VALUES (126, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317150}', '2026-05-09 15:59:10.097673');
INSERT INTO "public"."device_logs" VALUES (127, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317170}', '2026-05-09 15:59:30.574007');
INSERT INTO "public"."device_logs" VALUES (128, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317175}', '2026-05-09 15:59:36.840282');
INSERT INTO "public"."device_logs" VALUES (129, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317204}', '2026-05-09 16:00:04.622756');
INSERT INTO "public"."device_logs" VALUES (130, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317220}', '2026-05-09 16:00:20.618466');
INSERT INTO "public"."device_logs" VALUES (131, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317225}', '2026-05-09 16:00:25.599519');
INSERT INTO "public"."device_logs" VALUES (132, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317250}', '2026-05-09 16:00:50.584525');
INSERT INTO "public"."device_logs" VALUES (133, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317260}', '2026-05-09 16:01:00.906259');
INSERT INTO "public"."device_logs" VALUES (134, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317281}', '2026-05-09 16:01:21.105534');
INSERT INTO "public"."device_logs" VALUES (135, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317290}', '2026-05-09 16:01:31.198211');
INSERT INTO "public"."device_logs" VALUES (136, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317310}', '2026-05-09 16:01:50.90447');
INSERT INTO "public"."device_logs" VALUES (137, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317321}', '2026-05-09 16:02:01.025357');
INSERT INTO "public"."device_logs" VALUES (138, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317340}', '2026-05-09 16:02:20.369018');
INSERT INTO "public"."device_logs" VALUES (139, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317346}', '2026-05-09 16:02:26.317001');
INSERT INTO "public"."device_logs" VALUES (140, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317362}', '2026-05-09 16:02:42.086917');
INSERT INTO "public"."device_logs" VALUES (141, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317381}', '2026-05-09 16:03:01.098459');
INSERT INTO "public"."device_logs" VALUES (142, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317411}', '2026-05-09 16:03:31.412536');
INSERT INTO "public"."device_logs" VALUES (143, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317421}', '2026-05-09 16:03:41.249374');
INSERT INTO "public"."device_logs" VALUES (144, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317431}', '2026-05-09 16:03:51.363817');
INSERT INTO "public"."device_logs" VALUES (145, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317471}', '2026-05-09 16:04:31.405384');
INSERT INTO "public"."device_logs" VALUES (146, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317481}', '2026-05-09 16:04:41.691564');
INSERT INTO "public"."device_logs" VALUES (147, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317481}', '2026-05-09 16:04:41.695563');
INSERT INTO "public"."device_logs" VALUES (148, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317481}', '2026-05-09 16:04:41.700568');
INSERT INTO "public"."device_logs" VALUES (149, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317491}', '2026-05-09 16:04:53.920414');
INSERT INTO "public"."device_logs" VALUES (150, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317501}', '2026-05-09 16:05:01.715743');
INSERT INTO "public"."device_logs" VALUES (151, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317521}', '2026-05-09 16:05:21.695984');
INSERT INTO "public"."device_logs" VALUES (152, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317538}', '2026-05-09 16:05:38.206659');
INSERT INTO "public"."device_logs" VALUES (153, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317551}', '2026-05-09 16:05:51.715724');
INSERT INTO "public"."device_logs" VALUES (154, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317561}', '2026-05-09 16:06:03.455232');
INSERT INTO "public"."device_logs" VALUES (155, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317592}', '2026-05-09 16:06:32.776311');
INSERT INTO "public"."device_logs" VALUES (156, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317599}', '2026-05-09 16:06:39.506712');
INSERT INTO "public"."device_logs" VALUES (157, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317602}', '2026-05-09 16:06:42.911542');
INSERT INTO "public"."device_logs" VALUES (158, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317605}', '2026-05-09 16:06:45.442887');
INSERT INTO "public"."device_logs" VALUES (159, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317634}', '2026-05-09 16:07:15.96123');
INSERT INTO "public"."device_logs" VALUES (160, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317654}', '2026-05-09 16:07:34.321979');
INSERT INTO "public"."device_logs" VALUES (161, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317656}', '2026-05-09 16:07:37.536097');
INSERT INTO "public"."device_logs" VALUES (162, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317674}', '2026-05-09 16:07:54.460364');
INSERT INTO "public"."device_logs" VALUES (163, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317694}', '2026-05-09 16:08:14.058431');
INSERT INTO "public"."device_logs" VALUES (164, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317704}', '2026-05-09 16:08:24.671223');
INSERT INTO "public"."device_logs" VALUES (165, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317714}', '2026-05-09 16:08:34.644096');
INSERT INTO "public"."device_logs" VALUES (166, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317724}', '2026-05-09 16:08:44.990182');
INSERT INTO "public"."device_logs" VALUES (167, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317734}', '2026-05-09 16:08:54.821801');
INSERT INTO "public"."device_logs" VALUES (168, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317754}', '2026-05-09 16:09:14.908824');
INSERT INTO "public"."device_logs" VALUES (169, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317764}', '2026-05-09 16:09:24.928262');
INSERT INTO "public"."device_logs" VALUES (170, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317774}', '2026-05-09 16:09:34.867722');
INSERT INTO "public"."device_logs" VALUES (171, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317780}', '2026-05-09 16:09:40.519809');
INSERT INTO "public"."device_logs" VALUES (172, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317785}', '2026-05-09 16:09:44.965529');
INSERT INTO "public"."device_logs" VALUES (173, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317788}', '2026-05-09 16:09:48.396065');
INSERT INTO "public"."device_logs" VALUES (174, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317815}', '2026-05-09 16:10:14.955025');
INSERT INTO "public"."device_logs" VALUES (175, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317845}', '2026-05-09 16:10:45.197731');
INSERT INTO "public"."device_logs" VALUES (176, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317855}', '2026-05-09 16:10:55.11481');
INSERT INTO "public"."device_logs" VALUES (177, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317922}', '2026-05-09 16:12:02.792386');
INSERT INTO "public"."device_logs" VALUES (178, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317945}', '2026-05-09 16:12:25.318408');
INSERT INTO "public"."device_logs" VALUES (179, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317955}', '2026-05-09 16:12:35.602392');
INSERT INTO "public"."device_logs" VALUES (180, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778317956}', '2026-05-09 16:12:36.683022');
INSERT INTO "public"."device_logs" VALUES (181, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317975}', '2026-05-09 16:12:55.71847');
INSERT INTO "public"."device_logs" VALUES (182, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778317985}', '2026-05-09 16:13:05.471746');
INSERT INTO "public"."device_logs" VALUES (183, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318004}', '2026-05-09 16:13:26.07399');
INSERT INTO "public"."device_logs" VALUES (184, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318016}', '2026-05-09 16:13:36.776058');
INSERT INTO "public"."device_logs" VALUES (185, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318023}', '2026-05-09 16:13:43.420762');
INSERT INTO "public"."device_logs" VALUES (186, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318036}', '2026-05-09 16:13:56.843106');
INSERT INTO "public"."device_logs" VALUES (187, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318050}', '2026-05-09 16:14:09.959442');
INSERT INTO "public"."device_logs" VALUES (188, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318055}', '2026-05-09 16:14:15.550063');
INSERT INTO "public"."device_logs" VALUES (189, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318056}', '2026-05-09 16:14:16.902038');
INSERT INTO "public"."device_logs" VALUES (190, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318077}', '2026-05-09 16:14:37.126404');
INSERT INTO "public"."device_logs" VALUES (191, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318087}', '2026-05-09 16:14:46.925247');
INSERT INTO "public"."device_logs" VALUES (192, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318107}', '2026-05-09 16:15:06.896975');
INSERT INTO "public"."device_logs" VALUES (193, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318131}', '2026-05-09 16:15:31.181317');
INSERT INTO "public"."device_logs" VALUES (194, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318132}', '2026-05-09 16:15:32.291602');
INSERT INTO "public"."device_logs" VALUES (195, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318137}', '2026-05-09 16:15:37.225316');
INSERT INTO "public"."device_logs" VALUES (196, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318147}', '2026-05-09 16:15:46.942178');
INSERT INTO "public"."device_logs" VALUES (197, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318157}', '2026-05-09 16:15:57.073802');
INSERT INTO "public"."device_logs" VALUES (198, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318177}', '2026-05-09 16:16:17.238045');
INSERT INTO "public"."device_logs" VALUES (199, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318217}', '2026-05-09 16:16:57.183944');
INSERT INTO "public"."device_logs" VALUES (200, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318237}', '2026-05-09 16:17:17.356675');
INSERT INTO "public"."device_logs" VALUES (201, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318277}', '2026-05-09 16:17:57.28415');
INSERT INTO "public"."device_logs" VALUES (202, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318297}', '2026-05-09 16:18:17.669832');
INSERT INTO "public"."device_logs" VALUES (203, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318317}', '2026-05-09 16:18:37.536963');
INSERT INTO "public"."device_logs" VALUES (204, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318347}', '2026-05-09 16:19:07.715957');
INSERT INTO "public"."device_logs" VALUES (205, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318387}', '2026-05-09 16:19:47.969959');
INSERT INTO "public"."device_logs" VALUES (206, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318427}', '2026-05-09 16:20:27.922735');
INSERT INTO "public"."device_logs" VALUES (207, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318448}', '2026-05-09 16:20:47.977352');
INSERT INTO "public"."device_logs" VALUES (208, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318468}', '2026-05-09 16:21:08.064927');
INSERT INTO "public"."device_logs" VALUES (209, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318486}', '2026-05-09 16:21:26.793822');
INSERT INTO "public"."device_logs" VALUES (210, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318488}', '2026-05-09 16:21:28.149476');
INSERT INTO "public"."device_logs" VALUES (211, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318491}', '2026-05-09 16:21:31.222466');
INSERT INTO "public"."device_logs" VALUES (212, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318498}', '2026-05-09 16:21:38.386509');
INSERT INTO "public"."device_logs" VALUES (213, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318538}', '2026-05-09 16:22:18.695915');
INSERT INTO "public"."device_logs" VALUES (214, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318548}', '2026-05-09 16:22:28.868901');
INSERT INTO "public"."device_logs" VALUES (215, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318558}', '2026-05-09 16:22:38.682623');
INSERT INTO "public"."device_logs" VALUES (216, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318568}', '2026-05-09 16:22:48.419153');
INSERT INTO "public"."device_logs" VALUES (217, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318568}', '2026-05-09 16:22:48.684955');
INSERT INTO "public"."device_logs" VALUES (218, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318578}', '2026-05-09 16:22:58.678807');
INSERT INTO "public"."device_logs" VALUES (219, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318597}', '2026-05-09 16:23:17.730059');
INSERT INTO "public"."device_logs" VALUES (220, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318598}', '2026-05-09 16:23:18.806202');
INSERT INTO "public"."device_logs" VALUES (221, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318619}', '2026-05-09 16:23:39.218963');
INSERT INTO "public"."device_logs" VALUES (222, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318629}', '2026-05-09 16:23:49.644753');
INSERT INTO "public"."device_logs" VALUES (223, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318651}', '2026-05-09 16:24:11.67467');
INSERT INTO "public"."device_logs" VALUES (224, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318653}', '2026-05-09 16:24:12.787696');
INSERT INTO "public"."device_logs" VALUES (225, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318658}', '2026-05-09 16:24:18.046779');
INSERT INTO "public"."device_logs" VALUES (226, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318659}', '2026-05-09 16:24:18.7389');
INSERT INTO "public"."device_logs" VALUES (227, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318665}', '2026-05-09 16:24:25.715677');
INSERT INTO "public"."device_logs" VALUES (228, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318669}', '2026-05-09 16:24:29.346534');
INSERT INTO "public"."device_logs" VALUES (229, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318689}', '2026-05-09 16:24:49.358');
INSERT INTO "public"."device_logs" VALUES (230, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318706}', '2026-05-09 16:25:06.792637');
INSERT INTO "public"."device_logs" VALUES (231, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318714}', '2026-05-09 16:25:14.773798');
INSERT INTO "public"."device_logs" VALUES (232, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318719}', '2026-05-09 16:25:19.374226');
INSERT INTO "public"."device_logs" VALUES (233, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318720}', '2026-05-09 16:25:20.485501');
INSERT INTO "public"."device_logs" VALUES (234, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318749}', '2026-05-09 16:25:49.738352');
INSERT INTO "public"."device_logs" VALUES (235, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318769}', '2026-05-09 16:26:09.694445');
INSERT INTO "public"."device_logs" VALUES (236, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318778}', '2026-05-09 16:26:18.429054');
INSERT INTO "public"."device_logs" VALUES (237, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318789}', '2026-05-09 16:26:29.682795');
INSERT INTO "public"."device_logs" VALUES (238, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778318795}', '2026-05-09 16:26:35.675846');
INSERT INTO "public"."device_logs" VALUES (239, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318829}', '2026-05-09 16:27:09.651362');
INSERT INTO "public"."device_logs" VALUES (240, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318880}', '2026-05-09 16:28:00.004227');
INSERT INTO "public"."device_logs" VALUES (241, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318890}', '2026-05-09 16:28:10.176147');
INSERT INTO "public"."device_logs" VALUES (242, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318900}', '2026-05-09 16:28:20.510444');
INSERT INTO "public"."device_logs" VALUES (243, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318910}', '2026-05-09 16:28:30.321023');
INSERT INTO "public"."device_logs" VALUES (244, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318920}', '2026-05-09 16:28:40.177819');
INSERT INTO "public"."device_logs" VALUES (245, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318950}', '2026-05-09 16:29:10.559423');
INSERT INTO "public"."device_logs" VALUES (246, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318970}', '2026-05-09 16:29:30.749786');
INSERT INTO "public"."device_logs" VALUES (247, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778318980}', '2026-05-09 16:29:40.808858');
INSERT INTO "public"."device_logs" VALUES (248, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319011}', '2026-05-09 16:30:10.870761');
INSERT INTO "public"."device_logs" VALUES (249, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319051}', '2026-05-09 16:30:51.234596');
INSERT INTO "public"."device_logs" VALUES (250, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319071}', '2026-05-09 16:31:11.325456');
INSERT INTO "public"."device_logs" VALUES (251, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319101}', '2026-05-09 16:31:41.421731');
INSERT INTO "public"."device_logs" VALUES (252, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319111}', '2026-05-09 16:31:51.625154');
INSERT INTO "public"."device_logs" VALUES (253, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319131}', '2026-05-09 16:32:11.9287');
INSERT INTO "public"."device_logs" VALUES (254, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319141}', '2026-05-09 16:32:21.85943');
INSERT INTO "public"."device_logs" VALUES (255, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319152}', '2026-05-09 16:32:32.583236');
INSERT INTO "public"."device_logs" VALUES (256, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319161}', '2026-05-09 16:32:41.714587');
INSERT INTO "public"."device_logs" VALUES (257, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319171}', '2026-05-09 16:32:50.903835');
INSERT INTO "public"."device_logs" VALUES (258, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319171}', '2026-05-09 16:32:51.939467');
INSERT INTO "public"."device_logs" VALUES (259, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319175}', '2026-05-09 16:32:55.319637');
INSERT INTO "public"."device_logs" VALUES (260, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319178}', '2026-05-09 16:32:57.984247');
INSERT INTO "public"."device_logs" VALUES (261, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319180}', '2026-05-09 16:33:00.853843');
INSERT INTO "public"."device_logs" VALUES (262, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319182}', '2026-05-09 16:33:01.876038');
INSERT INTO "public"."device_logs" VALUES (263, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319195}', '2026-05-09 16:33:15.301643');
INSERT INTO "public"."device_logs" VALUES (264, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319202}', '2026-05-09 16:33:21.959315');
INSERT INTO "public"."device_logs" VALUES (265, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319222}', '2026-05-09 16:33:42.01235');
INSERT INTO "public"."device_logs" VALUES (266, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319252}', '2026-05-09 16:34:12.255469');
INSERT INTO "public"."device_logs" VALUES (267, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319265}', '2026-05-09 16:34:25.384492');
INSERT INTO "public"."device_logs" VALUES (268, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319272}', '2026-05-09 16:34:32.236425');
INSERT INTO "public"."device_logs" VALUES (269, '275407fa-1785-4bbc-b274-8f44789e4034', 'Đang kêu', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319273}', '2026-05-09 16:34:33.643774');
INSERT INTO "public"."device_logs" VALUES (270, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319282}', '2026-05-09 16:34:42.30872');
INSERT INTO "public"."device_logs" VALUES (271, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Tắt', '{"state": false, "value": "Tắt", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319312}', '2026-05-09 16:35:12.561923');
INSERT INTO "public"."device_logs" VALUES (272, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319322}', '2026-05-09 16:35:22.602572');
INSERT INTO "public"."device_logs" VALUES (273, '5ee15e16-9214-4bcd-9e19-494759c829bb', 'Bật', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319342}', '2026-05-09 16:35:42.768271');
INSERT INTO "public"."device_logs" VALUES (274, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Tắt', '{"state": false, "value": "Tắt", "deviceId": "kitchen_light_main", "timestamp": 1778386846}', '2026-05-10 11:20:45.983765');
INSERT INTO "public"."device_logs" VALUES (275, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Bật', '{"state": true, "value": "Bật", "deviceId": "kitchen_light_main", "timestamp": 1778386853}', '2026-05-10 11:20:53.457651');
INSERT INTO "public"."device_logs" VALUES (276, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Tắt', '{"state": false, "value": "Tắt", "deviceId": "kitchen_light_main", "timestamp": 1778386953}', '2026-05-10 11:22:33.10668');
INSERT INTO "public"."device_logs" VALUES (277, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Bật', '{"state": true, "value": "Bật", "deviceId": "kitchen_light_main", "timestamp": 1778399718}', '2026-05-10 14:55:18.572683');
INSERT INTO "public"."device_logs" VALUES (278, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Tắt', '{"state": false, "value": "Tắt", "deviceId": "kitchen_light_main", "timestamp": 1778399734}', '2026-05-10 14:55:34.870194');
INSERT INTO "public"."device_logs" VALUES (279, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Tắt', '{"state": false, "value": "Tắt", "deviceId": "kitchen_light_main", "timestamp": 1778400058}', '2026-05-10 15:00:58.706532');
INSERT INTO "public"."device_logs" VALUES (280, '6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', 'Bật', '{"state": true, "value": "Bật", "deviceId": "kitchen_light_main", "timestamp": 1778400062}', '2026-05-10 15:01:02.319336');

-- ----------------------------
-- Table structure for device_states
-- ----------------------------
DROP TABLE IF EXISTS "public"."device_states";
CREATE TABLE "public"."device_states" (
  "device_id" uuid NOT NULL,
  "state" jsonb,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of device_states
-- ----------------------------
INSERT INTO "public"."device_states" VALUES ('31818f10-d9ce-4908-8889-892603e226e7', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('3352793e-c035-4807-bd40-f7cdb9aff87d', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('85ab57a7-b51c-4952-af30-3c1d7fb0eaea', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('f657efd1-f29f-4dd7-bd45-9850539b69aa', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('509f4409-79e1-4a8c-9798-1702fa9218e7', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('46a4586a-e5d6-4d98-9890-4a919d9d0953', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('3f989385-f8be-482f-a91f-3496f8934871', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('848b5c7d-3d1d-4135-86e2-8ec44f86b018', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('0f5debb9-57ef-4c31-9a0f-96ac759790cb', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('00b5447f-e0dc-4023-b2cc-9ac800fb267d', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('fd2c3fc1-1f74-43b6-994e-f1baf989f9ca', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('a72608c3-6649-4df2-8d18-f29ccb6171b3', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('83a5181a-cf88-452f-b566-b6b57a6dbd9a', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('dc377953-47ae-4d5a-900b-9ba5a8158949', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('39b3c159-92d9-4182-b2c4-40503a93dd22', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('3c15c7e9-173a-4410-8d78-3bb8f8441f90', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('a173ec87-ac48-46ea-ba1d-48fb31ee205a', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('4030d658-a8bc-4c5b-b024-10042571f8b6', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('5de4ae98-64c6-42e3-99be-b208727338ce', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('ade0f56b-85e9-4c89-8154-d1ebc2e0612a', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('f042772a-f32b-4658-bc2e-dd1c3827053d', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('ab2ac091-90d3-4e87-974d-172ce035c8b1', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('d1a7b0a8-8333-42ab-9eb9-e819b4580279', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('30b029d5-d9fa-4690-9724-557322a970f1', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('d2696994-6162-4cca-9033-33ad7f664cfb', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('10818cf6-ca93-4db6-ba21-9cd5f4990d8c', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('2a3b450a-e9e4-4490-a823-398678453009', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('440ba046-a176-47f9-95e5-7439a3023888', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('fae67229-b0dc-480e-86ad-44881fc59e79', '{"value": "Chưa có dữ liệu", "isSimulated": true}', '2026-05-09 14:59:28.004928');
INSERT INTO "public"."device_states" VALUES ('275407fa-1785-4bbc-b274-8f44789e4034', '{"state": true, "value": "Đang kêu", "reason": "PIR phát hiện chuyển động!", "status": "Báo động", "deviceId": "global_safety_buzzer", "timestamp": 1778319273}', '2026-05-09 16:34:33.642773');
INSERT INTO "public"."device_states" VALUES ('5ee15e16-9214-4bcd-9e19-494759c829bb', '{"state": true, "value": "Bật", "isFake": true, "deviceId": "livingroom_light_front", "timestamp": 1778319342}', '2026-05-09 16:35:42.766792');
INSERT INTO "public"."device_states" VALUES ('d3993ff1-8d79-467b-83df-0d303a1a3c9a', '{"value": "Sẵn sàng", "distance": 0}', '2026-05-10 10:30:40.908082');
INSERT INTO "public"."device_states" VALUES ('06368676-6cd6-4013-9316-92f2825d1325', '{"value": "Sẵn sàng", "distance": 0}', '2026-05-10 10:30:40.908082');
INSERT INTO "public"."device_states" VALUES ('6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', '{"state": true, "value": "Bật", "deviceId": "kitchen_light_main", "timestamp": 1778400062}', '2026-05-10 15:01:02.318327');

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
  "pos_2d_y" float8 DEFAULT 0
)
;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO "public"."devices" VALUES ('dac599eb-ad9f-4113-9d55-4adc70a6dff1', '22222222-0000-0000-0000-000000000003', 'kitchen_sensor_flame', 'safety', 'home/tsmarthome/kitchen/flame/kitchen_sensor_flame', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 23:17:19.322169', 'f', 'Cảm biến Lửa', 'Flame', 61.8, 62.02);
INSERT INTO "public"."devices" VALUES ('46a4586a-e5d6-4d98-9890-4a919d9d0953', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_pir', 'security', 'home/tsmarthome/livingroom/motion/livingroom_sensor_pir', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.901988', 'f', 'PIR Khách/Bếp', 'Activity', 49.84, 75.88);
INSERT INTO "public"."devices" VALUES ('85703520-fb82-4ca5-9325-cd041ccbb2e1', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_dht22', 'environment', 'home/tsmarthome/livingroom/temperature/livingroom_sensor_dht22', 'Bình thường', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.90256', 'f', 'DHT22 (Nhiệt/Ẩm)', 'Thermometer', 50.52, 46.05);
INSERT INTO "public"."devices" VALUES ('3f989385-f8be-482f-a91f-3496f8934871', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_audio', 'environment', 'home/tsmarthome/livingroom/sound/livingroom_sensor_audio', 'Yên tĩnh', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.904142', 'f', 'Cảm biến Âm thanh & Mic', 'Mic', 33.67, 67.66);
INSERT INTO "public"."devices" VALUES ('4030d658-a8bc-4c5b-b024-10042571f8b6', '22222222-0000-0000-0000-000000000007', 'bedroom3_window_main', 'security', 'home/tsmarthome/bedroom3/window/bedroom3_window_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.908905', 't', 'Cửa sổ PN3', 'AppWindow', 71.04, 19.17);
INSERT INTO "public"."devices" VALUES ('5de4ae98-64c6-42e3-99be-b208727338ce', '22222222-0000-0000-0000-000000000008', 'balcony1_door_main', 'security', 'home/tsmarthome/balcony1/door/balcony1_door_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.909487', 't', 'Cửa Ban công 1', 'DoorClosed', 65.93, 71.7);
INSERT INTO "public"."devices" VALUES ('ab2ac091-90d3-4e87-974d-172ce035c8b1', '22222222-0000-0000-0000-000000000009', 'balcony2_door_main', 'security', 'home/tsmarthome/balcony2/door/balcony2_door_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.910734', 't', 'Cửa Ban công 2', 'DoorClosed', 73.26, 46.39);
INSERT INTO "public"."devices" VALUES ('31818f10-d9ce-4908-8889-892603e226e7', '22222222-0000-0000-0000-000000000001', 'entrance_door_smartlock', 'security', 'home/tsmarthome/entrance/smartlock/entrance_door_smartlock', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 23:17:42.377537', 't', 'Cửa chính & Smart Lock', 'DoorClosed', 29.29, 74.86);
INSERT INTO "public"."devices" VALUES ('848b5c7d-3d1d-4135-86e2-8ec44f86b018', '22222222-0000-0000-0000-000000000004', 'hallway_sensor_pir', 'security', 'home/tsmarthome/hallway/motion/hallway_sensor_pir', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 23:18:11.161338', 't', 'PIR Hành lang', 'Activity', 48.02, 35.03);
INSERT INTO "public"."devices" VALUES ('fd2c3fc1-1f74-43b6-994e-f1baf989f9ca', '22222222-0000-0000-0000-000000000005', 'bedroom1_sensor_flame', 'safety', 'home/tsmarthome/bedroom1/flame/bedroom1_sensor_flame', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 23:18:17.596409', 't', 'Lửa PN1', 'Flame', 43.6, 44.65);
INSERT INTO "public"."devices" VALUES ('dc377953-47ae-4d5a-900b-9ba5a8158949', '22222222-0000-0000-0000-000000000006', 'bedroom2_sensor_flame', 'safety', 'home/tsmarthome/bedroom2/flame/bedroom2_sensor_flame', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 23:18:20.561025', 't', 'Lửa PN2', 'Flame', 48.43, 30.49);
INSERT INTO "public"."devices" VALUES ('f042772a-f32b-4658-bc2e-dd1c3827053d', '22222222-0000-0000-0000-000000000008', 'balcony1_curtain_main', 'appliance', 'home/tsmarthome/balcony1/curtain/balcony1_curtain_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 20:55:22.059588', 't', 'Rèm Ban công 1', 'Blinds', 65.93, 80.59);
INSERT INTO "public"."devices" VALUES ('a72608c3-6649-4df2-8d18-f29ccb6171b3', '22222222-0000-0000-0000-000000000005', 'bedroom1_window_main', 'security', 'home/tsmarthome/bedroom1/window/bedroom1_window_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 20:55:44.296647', 't', 'Cửa sổ PN1', 'AppWindow', 32.47, 34.25);
INSERT INTO "public"."devices" VALUES ('39b3c159-92d9-4182-b2c4-40503a93dd22', '22222222-0000-0000-0000-000000000006', 'bedroom2_window_main', 'security', 'home/tsmarthome/bedroom2/window/bedroom2_window_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 20:55:59.651639', 't', 'Cửa sổ PN2', 'AppWindow', 42.23, 4.93);
INSERT INTO "public"."devices" VALUES ('83a5181a-cf88-452f-b566-b6b57a6dbd9a', '22222222-0000-0000-0000-000000000006', 'bedroom2_light_main', 'appliance', 'home/tsmarthome/bedroom2/light/bedroom2_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.906922', 't', 'Đèn PN2', 'Lightbulb', 42.5, 17.98);
INSERT INTO "public"."devices" VALUES ('3c15c7e9-173a-4410-8d78-3bb8f8441f90', '22222222-0000-0000-0000-000000000007', 'bedroom3_light_main', 'appliance', 'home/tsmarthome/bedroom3/light/bedroom3_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.908107', 't', 'Đèn PN3', 'Lightbulb', 63.83, 18.19);
INSERT INTO "public"."devices" VALUES ('a173ec87-ac48-46ea-ba1d-48fb31ee205a', '22222222-0000-0000-0000-000000000007', 'bedroom3_sensor_flame', 'safety', 'home/tsmarthome/bedroom3/flame/bedroom3_sensor_flame', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.908517', 'f', 'Lửa PN3', 'Flame', 57.78, 22.49);
INSERT INTO "public"."devices" VALUES ('ade0f56b-85e9-4c89-8154-d1ebc2e0612a', '22222222-0000-0000-0000-000000000008', 'balcony1_light_main', 'appliance', 'home/tsmarthome/balcony1/light/balcony1_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.909996', 't', 'Đèn Ban công 1', 'Lightbulb', 70.65, 74.27);
INSERT INTO "public"."devices" VALUES ('6ec9e2af-d28d-4e42-a5a9-add3a1fb75d0', '22222222-0000-0000-0000-000000000003', 'kitchen_light_main', 'appliance', 'home/tsmarthome/kitchen/light/kitchen_light_main', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 23:19:20.011377', 'f', 'Đèn bếp', 'Lightbulb', 58.44, 54.42);
INSERT INTO "public"."devices" VALUES ('0f5debb9-57ef-4c31-9a0f-96ac759790cb', '22222222-0000-0000-0000-000000000004', 'hallway_light_main', 'appliance', 'home/tsmarthome/hallway/light/hallway_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 23:19:26.639054', 't', 'Đèn hành lang', 'Lightbulb', 47.45, 50.66);
INSERT INTO "public"."devices" VALUES ('d1a7b0a8-8333-42ab-9eb9-e819b4580279', '22222222-0000-0000-0000-000000000009', 'balcony2_light_main', 'appliance', 'home/tsmarthome/balcony2/light/balcony2_light_main', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.911162', 't', 'Đèn Ban công 2', 'Lightbulb', 70.41, 37.59);
INSERT INTO "public"."devices" VALUES ('d3993ff1-8d79-467b-83df-0d303a1a3c9a', '22222222-0000-0000-0000-000000000002', 'livingroom_sensor_radar', 'radar', 'home/tsmarthome/livingroom/radar/livingroom_sensor_radar', 'Cảnh báo', '2026-05-10 10:30:40.85919', '2026-05-10 17:37:44.977074', 'f', NULL, NULL, 0, 0);
INSERT INTO "public"."devices" VALUES ('07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '22222222-0000-0000-0000-000000000001', 'entrance_sensor_pir', 'security', 'home/tsmarthome/entrance/motion/entrance_sensor_pir', 'Cảnh báo', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.897153', 'f', 'PIR Cửa chính', 'Activity', 22.11, 74.91);
INSERT INTO "public"."devices" VALUES ('06368676-6cd6-4013-9316-92f2825d1325', '22222222-0000-0000-0000-000000000004', 'hallway_sensor_radar', 'radar', 'home/tsmarthome/hallway/radar/hallway_sensor_radar', 'Cảnh báo', '2026-05-10 10:30:40.85919', '2026-05-10 16:17:50.421267', 'f', NULL, NULL, 0, 0);
INSERT INTO "public"."devices" VALUES ('30b029d5-d9fa-4690-9724-557322a970f1', '22222222-0000-0000-0000-000000000010', 'wc1_light_main', 'appliance', 'home/tsmarthome/wc1/light/wc1_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.911658', 't', 'Đèn WC 1', 'Lightbulb', 70.93, 56.14);
INSERT INTO "public"."devices" VALUES ('d2696994-6162-4cca-9033-33ad7f664cfb', '22222222-0000-0000-0000-000000000011', 'wc2_light_main', 'appliance', 'home/tsmarthome/wc2/light/wc2_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.912075', 't', 'Đèn WC 2', 'Lightbulb', 57.21, 38.64);
INSERT INTO "public"."devices" VALUES ('5ee15e16-9214-4bcd-9e19-494759c829bb', '22222222-0000-0000-0000-000000000002', 'livingroom_light_front', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_front', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.897873', 't', 'Đèn trần trước', 'Lightbulb', 25.04, 75.16);
INSERT INTO "public"."devices" VALUES ('85ab57a7-b51c-4952-af30-3c1d7fb0eaea', '22222222-0000-0000-0000-000000000002', 'livingroom_light_back', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_back', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.898594', 't', 'Đèn trần sau', 'Lightbulb', 34.11, 73.7);
INSERT INTO "public"."devices" VALUES ('f657efd1-f29f-4dd7-bd45-9850539b69aa', '22222222-0000-0000-0000-000000000002', 'livingroom_light_ceiling', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_ceiling', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.899374', 't', 'Đèn trần P.Khách', 'Lightbulb', 42.08, 75.39);
INSERT INTO "public"."devices" VALUES ('10818cf6-ca93-4db6-ba21-9cd5f4990d8c', '22222222-0000-0000-0000-000000000012', 'wc3_light_main', 'appliance', 'home/tsmarthome/wc3/light/wc3_light_main', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.912476', 't', 'Đèn WC 3', 'Lightbulb', 54.03, 16.42);
INSERT INTO "public"."devices" VALUES ('509f4409-79e1-4a8c-9798-1702fa9218e7', '22222222-0000-0000-0000-000000000002', 'livingroom_light_dining', 'appliance', 'home/tsmarthome/livingroom/light/livingroom_light_dining', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.900234', 't', 'Đèn phòng ăn', 'Lightbulb', 57.78, 74.92);
INSERT INTO "public"."devices" VALUES ('2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '22222222-0000-0000-0000-000000000003', 'kitchen_sensor_mq135', 'environment', 'home/tsmarthome/kitchen/air_quality/kitchen_sensor_mq135', 'Nguy hiểm', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.902957', 'f', 'Khí MQ-135', 'Wind', 54.34, 61.87);
INSERT INTO "public"."devices" VALUES ('2a3b450a-e9e4-4490-a823-398678453009', '22222222-0000-0000-0000-000000000013', 'global_appliance_tv', 'appliance', 'home/tsmarthome/global/tv/global_appliance_tv', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.912869', 'f', 'Cảm biến TV', 'Tv', 39.66, 88.92);
INSERT INTO "public"."devices" VALUES ('275407fa-1785-4bbc-b274-8f44789e4034', '22222222-0000-0000-0000-000000000013', 'global_safety_buzzer', 'safety', 'home/tsmarthome/global/buzzer/global_safety_buzzer', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.913518', 'f', 'Còi Buzzer', 'Bell', 35.64, 81.42);
INSERT INTO "public"."devices" VALUES ('00b5447f-e0dc-4023-b2cc-9ac800fb267d', '22222222-0000-0000-0000-000000000005', 'bedroom1_light_main', 'appliance', 'home/tsmarthome/bedroom1/light/bedroom1_light_main', 'Tắt', '2026-05-09 14:59:28.002328', '2026-05-10 18:30:22.905594', 't', 'Đèn PN1', 'Lightbulb', 36.34, 46.68);
INSERT INTO "public"."devices" VALUES ('440ba046-a176-47f9-95e5-7439a3023888', '22222222-0000-0000-0000-000000000013', 'global_environment_light', 'environment', 'home/tsmarthome/global/light_sensor/global_environment_light', 'Tối', '2026-05-09 14:59:28.002328', '2026-05-10 20:33:15.641962', 'f', 'Cảm biến Ánh sáng', 'Sun', 55.37, 89.82);
INSERT INTO "public"."devices" VALUES ('fae67229-b0dc-480e-86ad-44881fc59e79', '22222222-0000-0000-0000-000000000013', 'global_camera_ai', 'security', 'home/tsmarthome/global/camera/global_camera_ai', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 21:17:47.210522', 'f', 'Camera AI Toàn Cảnh', 'Camera', 65.25, 89.4);
INSERT INTO "public"."devices" VALUES ('3352793e-c035-4807-bd40-f7cdb9aff87d', '22222222-0000-0000-0000-000000000001', 'entrance_camera_s3', 'security', 'home/tsmarthome/entrance/camera/entrance_camera_s3', 'Bật', '2026-05-09 14:59:28.002328', '2026-05-10 23:18:40.60876', 't', 'Camera ESP32-S3', 'Camera', 26.81, 69.49);

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
INSERT INTO "public"."homes" VALUES ('11111111-1111-1111-1111-111111111111', 'TSmartHome Demo', '2026-05-09 14:59:27.932645', '2026-05-09 14:59:27.932645');

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
INSERT INTO "public"."refresh_tokens" VALUES ('7e5020f9-0c47-4352-9c2b-3b895a73cbc2', '2026-05-20 23:12:35.095656+07', 'f942d541-3686-411d-8138-a77eb86d87fd', '1f0385a0-da98-49ad-907d-f1c880c0dfad');
INSERT INTO "public"."refresh_tokens" VALUES ('5c454255-5a17-4713-984f-d547b6a25ddc', '2026-06-09 14:55:02.959551+07', 'cd49a271-2cc9-480d-b811-551d3aef5fc7', '268800e9-702b-4cb2-b6eb-295befaca239');

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
INSERT INTO "public"."sensor_data" VALUES (5100, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426724}', '2026-05-10 22:25:25.76342');
INSERT INTO "public"."sensor_data" VALUES (5101, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426729}', '2026-05-10 22:25:30.301668');
INSERT INTO "public"."sensor_data" VALUES (5102, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426734}', '2026-05-10 22:25:35.302139');
INSERT INTO "public"."sensor_data" VALUES (5103, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426739}', '2026-05-10 22:25:40.304468');
INSERT INTO "public"."sensor_data" VALUES (5104, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426744}', '2026-05-10 22:25:45.310098');
INSERT INTO "public"."sensor_data" VALUES (5105, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426749}', '2026-05-10 22:25:50.30451');
INSERT INTO "public"."sensor_data" VALUES (5106, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426754}', '2026-05-10 22:25:55.304472');
INSERT INTO "public"."sensor_data" VALUES (5107, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778426757}', '2026-05-10 22:25:58.301951');
INSERT INTO "public"."sensor_data" VALUES (5108, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426759}', '2026-05-10 22:25:59.932864');
INSERT INTO "public"."sensor_data" VALUES (5109, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426759}', '2026-05-10 22:26:00.268385');
INSERT INTO "public"."sensor_data" VALUES (5110, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426759}', '2026-05-10 22:26:00.271358');
INSERT INTO "public"."sensor_data" VALUES (5111, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426759}', '2026-05-10 22:26:00.273902');
INSERT INTO "public"."sensor_data" VALUES (5112, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426759}', '2026-05-10 22:26:00.590249');
INSERT INTO "public"."sensor_data" VALUES (5113, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426760}', '2026-05-10 22:26:00.88065');
INSERT INTO "public"."sensor_data" VALUES (5114, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426760}', '2026-05-10 22:26:01.185954');
INSERT INTO "public"."sensor_data" VALUES (5115, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426760}', '2026-05-10 22:26:01.495819');
INSERT INTO "public"."sensor_data" VALUES (5116, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426761}', '2026-05-10 22:26:01.801775');
INSERT INTO "public"."sensor_data" VALUES (5117, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426761}', '2026-05-10 22:26:02.492839');
INSERT INTO "public"."sensor_data" VALUES (5118, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426762}', '2026-05-10 22:26:02.827793');
INSERT INTO "public"."sensor_data" VALUES (5119, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778426763}', '2026-05-10 22:26:03.910849');
INSERT INTO "public"."sensor_data" VALUES (5120, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426763}', '2026-05-10 22:26:04.332866');
INSERT INTO "public"."sensor_data" VALUES (5121, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426763}', '2026-05-10 22:26:04.669187');
INSERT INTO "public"."sensor_data" VALUES (5122, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "CÓ LỬA", "status": "Nguy hiểm", "detected": true, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426763}', '2026-05-10 22:26:04.67121');
INSERT INTO "public"."sensor_data" VALUES (5123, 'dac599eb-ad9f-4113-9d55-4adc70a6dff1', '{"value": "Không có lửa", "status": "An toàn", "detected": false, "deviceId": "kitchen_sensor_flame", "timestamp": 1778426763}', '2026-05-10 22:26:04.673721');
INSERT INTO "public"."sensor_data" VALUES (5124, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426764}', '2026-05-10 22:26:05.30633');
INSERT INTO "public"."sensor_data" VALUES (5125, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426769}', '2026-05-10 22:26:10.307481');
INSERT INTO "public"."sensor_data" VALUES (5126, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426774}', '2026-05-10 22:26:15.313097');
INSERT INTO "public"."sensor_data" VALUES (5127, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426779}', '2026-05-10 22:26:20.308357');
INSERT INTO "public"."sensor_data" VALUES (5128, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426784}', '2026-05-10 22:26:25.308803');
INSERT INTO "public"."sensor_data" VALUES (5129, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426789}', '2026-05-10 22:26:30.309958');
INSERT INTO "public"."sensor_data" VALUES (5130, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426794}', '2026-05-10 22:26:35.319078');
INSERT INTO "public"."sensor_data" VALUES (5131, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426799}', '2026-05-10 22:26:40.311567');
INSERT INTO "public"."sensor_data" VALUES (5132, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426804}', '2026-05-10 22:26:45.315262');
INSERT INTO "public"."sensor_data" VALUES (5133, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426809}', '2026-05-10 22:26:50.312833');
INSERT INTO "public"."sensor_data" VALUES (5134, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426814}', '2026-05-10 22:26:55.314789');
INSERT INTO "public"."sensor_data" VALUES (5135, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426819}', '2026-05-10 22:27:00.318254');
INSERT INTO "public"."sensor_data" VALUES (5136, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426824}', '2026-05-10 22:27:05.31357');
INSERT INTO "public"."sensor_data" VALUES (5137, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426829}', '2026-05-10 22:27:10.314293');
INSERT INTO "public"."sensor_data" VALUES (5138, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426834}', '2026-05-10 22:27:15.317532');
INSERT INTO "public"."sensor_data" VALUES (5139, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426839}', '2026-05-10 22:27:20.315659');
INSERT INTO "public"."sensor_data" VALUES (5140, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426844}', '2026-05-10 22:27:25.316075');
INSERT INTO "public"."sensor_data" VALUES (5141, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426849}', '2026-05-10 22:27:30.316487');
INSERT INTO "public"."sensor_data" VALUES (5142, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426854}', '2026-05-10 22:27:35.318195');
INSERT INTO "public"."sensor_data" VALUES (5143, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426859}', '2026-05-10 22:27:40.317913');
INSERT INTO "public"."sensor_data" VALUES (5144, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778426859}', '2026-05-10 22:27:40.614404');
INSERT INTO "public"."sensor_data" VALUES (5145, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "36.1°C / 53.0%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778426864}', '2026-05-10 22:27:44.936921');
INSERT INTO "public"."sensor_data" VALUES (5146, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778426864}', '2026-05-10 22:27:45.222682');
INSERT INTO "public"."sensor_data" VALUES (5147, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426864}', '2026-05-10 22:27:45.536204');
INSERT INTO "public"."sensor_data" VALUES (5148, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426869}', '2026-05-10 22:27:50.320756');
INSERT INTO "public"."sensor_data" VALUES (5149, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426874}', '2026-05-10 22:27:55.321136');
INSERT INTO "public"."sensor_data" VALUES (5150, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426879}', '2026-05-10 22:28:00.321383');
INSERT INTO "public"."sensor_data" VALUES (5151, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426884}', '2026-05-10 22:28:05.323949');
INSERT INTO "public"."sensor_data" VALUES (5152, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426889}', '2026-05-10 22:28:10.32606');
INSERT INTO "public"."sensor_data" VALUES (5153, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426894}', '2026-05-10 22:28:15.326377');
INSERT INTO "public"."sensor_data" VALUES (5154, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426899}', '2026-05-10 22:28:20.323922');
INSERT INTO "public"."sensor_data" VALUES (5155, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426904}', '2026-05-10 22:28:25.324704');
INSERT INTO "public"."sensor_data" VALUES (5156, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426909}', '2026-05-10 22:28:30.325433');
INSERT INTO "public"."sensor_data" VALUES (5157, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426914}', '2026-05-10 22:28:35.331303');
INSERT INTO "public"."sensor_data" VALUES (5158, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426919}', '2026-05-10 22:28:40.327031');
INSERT INTO "public"."sensor_data" VALUES (5159, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426924}', '2026-05-10 22:28:45.331743');
INSERT INTO "public"."sensor_data" VALUES (5160, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426929}', '2026-05-10 22:28:50.330093');
INSERT INTO "public"."sensor_data" VALUES (5161, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426934}', '2026-05-10 22:28:55.329059');
INSERT INTO "public"."sensor_data" VALUES (5162, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426939}', '2026-05-10 22:29:00.326921');
INSERT INTO "public"."sensor_data" VALUES (5163, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426944}', '2026-05-10 22:29:05.333231');
INSERT INTO "public"."sensor_data" VALUES (5164, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426949}', '2026-05-10 22:29:10.33248');
INSERT INTO "public"."sensor_data" VALUES (5165, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426954}', '2026-05-10 22:29:15.43615');
INSERT INTO "public"."sensor_data" VALUES (5166, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426959}', '2026-05-10 22:29:20.333143');
INSERT INTO "public"."sensor_data" VALUES (5167, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426964}', '2026-05-10 22:29:25.333755');
INSERT INTO "public"."sensor_data" VALUES (5168, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426969}', '2026-05-10 22:29:30.334102');
INSERT INTO "public"."sensor_data" VALUES (5169, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426974}', '2026-05-10 22:29:35.336038');
INSERT INTO "public"."sensor_data" VALUES (5170, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426979}', '2026-05-10 22:29:40.324791');
INSERT INTO "public"."sensor_data" VALUES (5171, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426984}', '2026-05-10 22:29:45.32906');
INSERT INTO "public"."sensor_data" VALUES (5172, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426989}', '2026-05-10 22:29:50.333838');
INSERT INTO "public"."sensor_data" VALUES (5173, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426994}', '2026-05-10 22:29:55.32704');
INSERT INTO "public"."sensor_data" VALUES (5174, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778426999}', '2026-05-10 22:30:00.327754');
INSERT INTO "public"."sensor_data" VALUES (5175, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427004}', '2026-05-10 22:30:05.32802');
INSERT INTO "public"."sensor_data" VALUES (5176, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427009}', '2026-05-10 22:30:10.334738');
INSERT INTO "public"."sensor_data" VALUES (5177, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427014}', '2026-05-10 22:30:15.342084');
INSERT INTO "public"."sensor_data" VALUES (5178, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427019}', '2026-05-10 22:30:20.331783');
INSERT INTO "public"."sensor_data" VALUES (5179, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427024}', '2026-05-10 22:30:25.343922');
INSERT INTO "public"."sensor_data" VALUES (5180, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427029}', '2026-05-10 22:30:30.331982');
INSERT INTO "public"."sensor_data" VALUES (5181, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427034}', '2026-05-10 22:30:35.332698');
INSERT INTO "public"."sensor_data" VALUES (5182, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427039}', '2026-05-10 22:30:40.333904');
INSERT INTO "public"."sensor_data" VALUES (5183, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427044}', '2026-05-10 22:30:45.334085');
INSERT INTO "public"."sensor_data" VALUES (5184, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427049}', '2026-05-10 22:30:50.338083');
INSERT INTO "public"."sensor_data" VALUES (5185, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427054}', '2026-05-10 22:30:55.337002');
INSERT INTO "public"."sensor_data" VALUES (5186, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427059}', '2026-05-10 22:31:00.337686');
INSERT INTO "public"."sensor_data" VALUES (5187, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427064}', '2026-05-10 22:31:05.337076');
INSERT INTO "public"."sensor_data" VALUES (5188, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427069}', '2026-05-10 22:31:10.337506');
INSERT INTO "public"."sensor_data" VALUES (5189, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427074}', '2026-05-10 22:31:15.339474');
INSERT INTO "public"."sensor_data" VALUES (5190, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427079}', '2026-05-10 22:31:20.343457');
INSERT INTO "public"."sensor_data" VALUES (5191, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427084}', '2026-05-10 22:31:25.339525');
INSERT INTO "public"."sensor_data" VALUES (5192, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427089}', '2026-05-10 22:31:30.340448');
INSERT INTO "public"."sensor_data" VALUES (5193, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427094}', '2026-05-10 22:31:35.342821');
INSERT INTO "public"."sensor_data" VALUES (5194, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427099}', '2026-05-10 22:31:40.341644');
INSERT INTO "public"."sensor_data" VALUES (5195, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427104}', '2026-05-10 22:31:45.348464');
INSERT INTO "public"."sensor_data" VALUES (5196, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427109}', '2026-05-10 22:31:50.346317');
INSERT INTO "public"."sensor_data" VALUES (5197, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427114}', '2026-05-10 22:31:55.344294');
INSERT INTO "public"."sensor_data" VALUES (5198, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427119}', '2026-05-10 22:32:00.344855');
INSERT INTO "public"."sensor_data" VALUES (5199, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427124}', '2026-05-10 22:32:05.346075');
INSERT INTO "public"."sensor_data" VALUES (5200, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427129}', '2026-05-10 22:32:10.357064');
INSERT INTO "public"."sensor_data" VALUES (5201, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427134}', '2026-05-10 22:32:15.347801');
INSERT INTO "public"."sensor_data" VALUES (5202, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427139}', '2026-05-10 22:32:20.348629');
INSERT INTO "public"."sensor_data" VALUES (5203, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427144}', '2026-05-10 22:32:25.348295');
INSERT INTO "public"."sensor_data" VALUES (5204, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427149}', '2026-05-10 22:32:30.349236');
INSERT INTO "public"."sensor_data" VALUES (5205, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427154}', '2026-05-10 22:32:35.349009');
INSERT INTO "public"."sensor_data" VALUES (5206, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427159}', '2026-05-10 22:32:40.350053');
INSERT INTO "public"."sensor_data" VALUES (5207, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.5°C / 54.2%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778427164}', '2026-05-10 22:32:44.908366');
INSERT INTO "public"."sensor_data" VALUES (5208, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778427164}', '2026-05-10 22:32:45.234432');
INSERT INTO "public"."sensor_data" VALUES (5209, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "32 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427164}', '2026-05-10 22:32:45.564873');
INSERT INTO "public"."sensor_data" VALUES (5210, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427169}', '2026-05-10 22:32:50.352371');
INSERT INTO "public"."sensor_data" VALUES (5211, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427174}', '2026-05-10 22:32:55.351981');
INSERT INTO "public"."sensor_data" VALUES (5212, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427179}', '2026-05-10 22:33:00.353426');
INSERT INTO "public"."sensor_data" VALUES (5213, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427184}', '2026-05-10 22:33:05.353081');
INSERT INTO "public"."sensor_data" VALUES (5214, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427189}', '2026-05-10 22:33:10.354559');
INSERT INTO "public"."sensor_data" VALUES (5215, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427194}', '2026-05-10 22:33:15.35559');
INSERT INTO "public"."sensor_data" VALUES (5216, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427199}', '2026-05-10 22:33:20.360623');
INSERT INTO "public"."sensor_data" VALUES (5217, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427204}', '2026-05-10 22:33:25.358242');
INSERT INTO "public"."sensor_data" VALUES (5218, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427209}', '2026-05-10 22:33:30.357455');
INSERT INTO "public"."sensor_data" VALUES (5219, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427214}', '2026-05-10 22:33:35.355451');
INSERT INTO "public"."sensor_data" VALUES (5220, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427219}', '2026-05-10 22:33:40.358971');
INSERT INTO "public"."sensor_data" VALUES (5221, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427224}', '2026-05-10 22:33:45.362161');
INSERT INTO "public"."sensor_data" VALUES (5222, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427229}', '2026-05-10 22:33:50.466325');
INSERT INTO "public"."sensor_data" VALUES (5223, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427234}', '2026-05-10 22:33:55.361054');
INSERT INTO "public"."sensor_data" VALUES (5224, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427239}', '2026-05-10 22:34:00.376073');
INSERT INTO "public"."sensor_data" VALUES (5225, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427244}', '2026-05-10 22:34:05.362986');
INSERT INTO "public"."sensor_data" VALUES (5226, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427249}', '2026-05-10 22:34:10.363249');
INSERT INTO "public"."sensor_data" VALUES (5227, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427254}', '2026-05-10 22:34:15.366292');
INSERT INTO "public"."sensor_data" VALUES (5228, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427259}', '2026-05-10 22:34:20.366752');
INSERT INTO "public"."sensor_data" VALUES (5229, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427264}', '2026-05-10 22:34:25.36852');
INSERT INTO "public"."sensor_data" VALUES (5230, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427269}', '2026-05-10 22:34:30.36687');
INSERT INTO "public"."sensor_data" VALUES (5231, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427274}', '2026-05-10 22:34:35.366643');
INSERT INTO "public"."sensor_data" VALUES (5232, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427279}', '2026-05-10 22:34:40.367467');
INSERT INTO "public"."sensor_data" VALUES (5233, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427284}', '2026-05-10 22:34:45.368051');
INSERT INTO "public"."sensor_data" VALUES (5234, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427289}', '2026-05-10 22:34:50.371443');
INSERT INTO "public"."sensor_data" VALUES (5235, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427294}', '2026-05-10 22:34:55.378663');
INSERT INTO "public"."sensor_data" VALUES (5236, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427299}', '2026-05-10 22:35:00.370861');
INSERT INTO "public"."sensor_data" VALUES (5237, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427304}', '2026-05-10 22:35:05.370671');
INSERT INTO "public"."sensor_data" VALUES (5238, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427309}', '2026-05-10 22:35:10.37114');
INSERT INTO "public"."sensor_data" VALUES (5239, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427314}', '2026-05-10 22:35:15.37277');
INSERT INTO "public"."sensor_data" VALUES (5240, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427319}', '2026-05-10 22:35:20.37618');
INSERT INTO "public"."sensor_data" VALUES (5241, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427324}', '2026-05-10 22:35:25.374124');
INSERT INTO "public"."sensor_data" VALUES (5242, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427329}', '2026-05-10 22:35:30.374926');
INSERT INTO "public"."sensor_data" VALUES (5243, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427334}', '2026-05-10 22:35:35.375738');
INSERT INTO "public"."sensor_data" VALUES (5244, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427339}', '2026-05-10 22:35:40.376175');
INSERT INTO "public"."sensor_data" VALUES (5245, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427344}', '2026-05-10 22:35:45.377274');
INSERT INTO "public"."sensor_data" VALUES (5246, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427349}', '2026-05-10 22:35:50.381263');
INSERT INTO "public"."sensor_data" VALUES (5247, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427354}', '2026-05-10 22:35:55.38219');
INSERT INTO "public"."sensor_data" VALUES (5248, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427359}', '2026-05-10 22:36:00.379648');
INSERT INTO "public"."sensor_data" VALUES (5249, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427364}', '2026-05-10 22:36:05.380785');
INSERT INTO "public"."sensor_data" VALUES (5250, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427369}', '2026-05-10 22:36:10.381018');
INSERT INTO "public"."sensor_data" VALUES (5251, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427374}', '2026-05-10 22:36:15.384127');
INSERT INTO "public"."sensor_data" VALUES (5252, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427379}', '2026-05-10 22:36:20.381733');
INSERT INTO "public"."sensor_data" VALUES (5253, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427384}', '2026-05-10 22:36:25.386673');
INSERT INTO "public"."sensor_data" VALUES (5254, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427389}', '2026-05-10 22:36:30.383359');
INSERT INTO "public"."sensor_data" VALUES (5255, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427394}', '2026-05-10 22:36:35.384704');
INSERT INTO "public"."sensor_data" VALUES (5256, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427399}', '2026-05-10 22:36:40.386117');
INSERT INTO "public"."sensor_data" VALUES (5257, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427404}', '2026-05-10 22:36:45.388823');
INSERT INTO "public"."sensor_data" VALUES (5258, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427409}', '2026-05-10 22:36:50.386187');
INSERT INTO "public"."sensor_data" VALUES (5259, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427414}', '2026-05-10 22:36:55.404292');
INSERT INTO "public"."sensor_data" VALUES (5260, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427419}', '2026-05-10 22:37:00.387436');
INSERT INTO "public"."sensor_data" VALUES (5261, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427424}', '2026-05-10 22:37:05.39114');
INSERT INTO "public"."sensor_data" VALUES (5262, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427429}', '2026-05-10 22:37:10.391356');
INSERT INTO "public"."sensor_data" VALUES (5263, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427434}', '2026-05-10 22:37:15.392927');
INSERT INTO "public"."sensor_data" VALUES (5264, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427439}', '2026-05-10 22:37:20.393196');
INSERT INTO "public"."sensor_data" VALUES (5265, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427444}', '2026-05-10 22:37:25.407459');
INSERT INTO "public"."sensor_data" VALUES (5266, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427449}', '2026-05-10 22:37:30.394636');
INSERT INTO "public"."sensor_data" VALUES (5267, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427454}', '2026-05-10 22:37:35.395598');
INSERT INTO "public"."sensor_data" VALUES (5268, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427459}', '2026-05-10 22:37:40.396008');
INSERT INTO "public"."sensor_data" VALUES (5269, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.5°C / 54.4%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778427464}', '2026-05-10 22:37:44.897256');
INSERT INTO "public"."sensor_data" VALUES (5270, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778427464}', '2026-05-10 22:37:45.167545');
INSERT INTO "public"."sensor_data" VALUES (5271, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427464}', '2026-05-10 22:37:45.469412');
INSERT INTO "public"."sensor_data" VALUES (5272, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427469}', '2026-05-10 22:37:50.397463');
INSERT INTO "public"."sensor_data" VALUES (5273, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427474}', '2026-05-10 22:37:55.401053');
INSERT INTO "public"."sensor_data" VALUES (5274, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427479}', '2026-05-10 22:38:00.406036');
INSERT INTO "public"."sensor_data" VALUES (5275, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427484}', '2026-05-10 22:38:05.400465');
INSERT INTO "public"."sensor_data" VALUES (5276, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427489}', '2026-05-10 22:38:10.399741');
INSERT INTO "public"."sensor_data" VALUES (5277, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427494}', '2026-05-10 22:38:15.403202');
INSERT INTO "public"."sensor_data" VALUES (5278, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427499}', '2026-05-10 22:38:20.403241');
INSERT INTO "public"."sensor_data" VALUES (5279, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427504}', '2026-05-10 22:38:25.608242');
INSERT INTO "public"."sensor_data" VALUES (5280, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427509}', '2026-05-10 22:38:30.410062');
INSERT INTO "public"."sensor_data" VALUES (5281, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427514}', '2026-05-10 22:38:35.405421');
INSERT INTO "public"."sensor_data" VALUES (5282, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427519}', '2026-05-10 22:38:40.407469');
INSERT INTO "public"."sensor_data" VALUES (5283, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427524}', '2026-05-10 22:38:45.40578');
INSERT INTO "public"."sensor_data" VALUES (5284, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427529}', '2026-05-10 22:38:50.406787');
INSERT INTO "public"."sensor_data" VALUES (5285, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427534}', '2026-05-10 22:38:55.414035');
INSERT INTO "public"."sensor_data" VALUES (5286, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427539}', '2026-05-10 22:39:00.413859');
INSERT INTO "public"."sensor_data" VALUES (5287, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427544}', '2026-05-10 22:39:05.418266');
INSERT INTO "public"."sensor_data" VALUES (5288, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427549}', '2026-05-10 22:39:10.408706');
INSERT INTO "public"."sensor_data" VALUES (5289, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427554}', '2026-05-10 22:39:15.412511');
INSERT INTO "public"."sensor_data" VALUES (5290, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427559}', '2026-05-10 22:39:20.421071');
INSERT INTO "public"."sensor_data" VALUES (5291, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427564}', '2026-05-10 22:39:25.412214');
INSERT INTO "public"."sensor_data" VALUES (5292, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427569}', '2026-05-10 22:39:30.421285');
INSERT INTO "public"."sensor_data" VALUES (5293, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427574}', '2026-05-10 22:39:35.528631');
INSERT INTO "public"."sensor_data" VALUES (5294, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427579}', '2026-05-10 22:39:40.413869');
INSERT INTO "public"."sensor_data" VALUES (5295, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427584}', '2026-05-10 22:39:45.415321');
INSERT INTO "public"."sensor_data" VALUES (5296, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427589}', '2026-05-10 22:39:50.414975');
INSERT INTO "public"."sensor_data" VALUES (5297, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427594}', '2026-05-10 22:39:55.415773');
INSERT INTO "public"."sensor_data" VALUES (5298, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427599}', '2026-05-10 22:40:00.416408');
INSERT INTO "public"."sensor_data" VALUES (5299, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427604}', '2026-05-10 22:40:05.417107');
INSERT INTO "public"."sensor_data" VALUES (5300, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427609}', '2026-05-10 22:40:10.414629');
INSERT INTO "public"."sensor_data" VALUES (5301, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427614}', '2026-05-10 22:40:15.418491');
INSERT INTO "public"."sensor_data" VALUES (5302, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427619}', '2026-05-10 22:40:20.421167');
INSERT INTO "public"."sensor_data" VALUES (5303, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427624}', '2026-05-10 22:40:25.420208');
INSERT INTO "public"."sensor_data" VALUES (5304, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427629}', '2026-05-10 22:40:30.419037');
INSERT INTO "public"."sensor_data" VALUES (5305, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427634}', '2026-05-10 22:40:35.4199');
INSERT INTO "public"."sensor_data" VALUES (5306, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427639}', '2026-05-10 22:40:40.420212');
INSERT INTO "public"."sensor_data" VALUES (5307, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427644}', '2026-05-10 22:40:45.422756');
INSERT INTO "public"."sensor_data" VALUES (5308, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778427649}', '2026-05-10 22:40:50.016225');
INSERT INTO "public"."sensor_data" VALUES (5309, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427649}', '2026-05-10 22:40:50.422847');
INSERT INTO "public"."sensor_data" VALUES (5310, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427654}', '2026-05-10 22:40:55.422922');
INSERT INTO "public"."sensor_data" VALUES (5311, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427659}', '2026-05-10 22:41:00.428433');
INSERT INTO "public"."sensor_data" VALUES (5312, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427664}', '2026-05-10 22:41:05.425419');
INSERT INTO "public"."sensor_data" VALUES (5313, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427669}', '2026-05-10 22:41:10.426895');
INSERT INTO "public"."sensor_data" VALUES (5314, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427674}', '2026-05-10 22:41:15.429338');
INSERT INTO "public"."sensor_data" VALUES (5315, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427679}', '2026-05-10 22:41:20.427986');
INSERT INTO "public"."sensor_data" VALUES (5316, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427684}', '2026-05-10 22:41:25.433945');
INSERT INTO "public"."sensor_data" VALUES (5317, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427689}', '2026-05-10 22:41:30.430372');
INSERT INTO "public"."sensor_data" VALUES (5318, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427694}', '2026-05-10 22:41:35.428708');
INSERT INTO "public"."sensor_data" VALUES (5319, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427699}', '2026-05-10 22:41:40.429548');
INSERT INTO "public"."sensor_data" VALUES (5320, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427704}', '2026-05-10 22:41:45.433077');
INSERT INTO "public"."sensor_data" VALUES (5321, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427709}', '2026-05-10 22:41:50.432274');
INSERT INTO "public"."sensor_data" VALUES (5322, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427714}', '2026-05-10 22:41:55.434338');
INSERT INTO "public"."sensor_data" VALUES (5323, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427719}', '2026-05-10 22:42:00.435963');
INSERT INTO "public"."sensor_data" VALUES (5324, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427724}', '2026-05-10 22:42:05.433258');
INSERT INTO "public"."sensor_data" VALUES (5325, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427729}', '2026-05-10 22:42:10.434095');
INSERT INTO "public"."sensor_data" VALUES (5326, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427734}', '2026-05-10 22:42:15.435327');
INSERT INTO "public"."sensor_data" VALUES (5327, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427739}', '2026-05-10 22:42:20.43496');
INSERT INTO "public"."sensor_data" VALUES (5328, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427744}', '2026-05-10 22:42:25.436297');
INSERT INTO "public"."sensor_data" VALUES (5329, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427749}', '2026-05-10 22:42:30.436979');
INSERT INTO "public"."sensor_data" VALUES (5330, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427754}', '2026-05-10 22:42:35.437844');
INSERT INTO "public"."sensor_data" VALUES (5331, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427759}', '2026-05-10 22:42:40.441976');
INSERT INTO "public"."sensor_data" VALUES (5332, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.7°C / 54.8%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778427764}', '2026-05-10 22:42:44.880101');
INSERT INTO "public"."sensor_data" VALUES (5333, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778427764}', '2026-05-10 22:42:45.189161');
INSERT INTO "public"."sensor_data" VALUES (5334, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427764}', '2026-05-10 22:42:45.496505');
INSERT INTO "public"."sensor_data" VALUES (5335, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427769}', '2026-05-10 22:42:50.446193');
INSERT INTO "public"."sensor_data" VALUES (5336, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427774}', '2026-05-10 22:42:55.440671');
INSERT INTO "public"."sensor_data" VALUES (5337, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427779}', '2026-05-10 22:43:00.444031');
INSERT INTO "public"."sensor_data" VALUES (5338, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427784}', '2026-05-10 22:43:05.447434');
INSERT INTO "public"."sensor_data" VALUES (5339, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427789}', '2026-05-10 22:43:10.442649');
INSERT INTO "public"."sensor_data" VALUES (5340, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427794}', '2026-05-10 22:43:15.44438');
INSERT INTO "public"."sensor_data" VALUES (5341, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427799}', '2026-05-10 22:43:20.443662');
INSERT INTO "public"."sensor_data" VALUES (5342, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778427802}', '2026-05-10 22:43:22.873967');
INSERT INTO "public"."sensor_data" VALUES (5343, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427804}', '2026-05-10 22:43:25.444604');
INSERT INTO "public"."sensor_data" VALUES (5344, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427809}', '2026-05-10 22:43:30.448054');
INSERT INTO "public"."sensor_data" VALUES (5345, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427814}', '2026-05-10 22:43:35.450102');
INSERT INTO "public"."sensor_data" VALUES (5346, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427819}', '2026-05-10 22:43:40.459617');
INSERT INTO "public"."sensor_data" VALUES (5347, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427824}', '2026-05-10 22:43:45.448634');
INSERT INTO "public"."sensor_data" VALUES (5348, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427829}', '2026-05-10 22:43:50.448053');
INSERT INTO "public"."sensor_data" VALUES (5349, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427834}', '2026-05-10 22:43:55.449897');
INSERT INTO "public"."sensor_data" VALUES (5350, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427839}', '2026-05-10 22:44:00.459987');
INSERT INTO "public"."sensor_data" VALUES (5351, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427844}', '2026-05-10 22:44:05.451271');
INSERT INTO "public"."sensor_data" VALUES (5352, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427849}', '2026-05-10 22:44:10.463246');
INSERT INTO "public"."sensor_data" VALUES (5353, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427854}', '2026-05-10 22:44:15.453851');
INSERT INTO "public"."sensor_data" VALUES (5354, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427859}', '2026-05-10 22:44:20.452884');
INSERT INTO "public"."sensor_data" VALUES (5355, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427864}', '2026-05-10 22:44:25.457792');
INSERT INTO "public"."sensor_data" VALUES (5356, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427869}', '2026-05-10 22:44:30.461133');
INSERT INTO "public"."sensor_data" VALUES (5357, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427874}', '2026-05-10 22:44:35.454757');
INSERT INTO "public"."sensor_data" VALUES (5358, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427879}', '2026-05-10 22:44:40.45674');
INSERT INTO "public"."sensor_data" VALUES (5359, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427884}', '2026-05-10 22:44:45.457056');
INSERT INTO "public"."sensor_data" VALUES (5360, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427889}', '2026-05-10 22:44:50.458207');
INSERT INTO "public"."sensor_data" VALUES (5361, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427894}', '2026-05-10 22:44:55.461029');
INSERT INTO "public"."sensor_data" VALUES (5362, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.4, "timestamp": 1778427894}', '2026-05-10 22:44:55.761499');
INSERT INTO "public"."sensor_data" VALUES (5363, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427899}', '2026-05-10 22:45:00.464445');
INSERT INTO "public"."sensor_data" VALUES (5364, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427904}', '2026-05-10 22:45:05.460695');
INSERT INTO "public"."sensor_data" VALUES (5365, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427909}', '2026-05-10 22:45:10.461536');
INSERT INTO "public"."sensor_data" VALUES (5366, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778427913}', '2026-05-10 22:45:14.491748');
INSERT INTO "public"."sensor_data" VALUES (5367, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427914}', '2026-05-10 22:45:15.461404');
INSERT INTO "public"."sensor_data" VALUES (5368, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427919}', '2026-05-10 22:45:20.467409');
INSERT INTO "public"."sensor_data" VALUES (5369, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427924}', '2026-05-10 22:45:25.46688');
INSERT INTO "public"."sensor_data" VALUES (5370, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427929}', '2026-05-10 22:45:30.466098');
INSERT INTO "public"."sensor_data" VALUES (5371, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427934}', '2026-05-10 22:45:35.470997');
INSERT INTO "public"."sensor_data" VALUES (5372, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427939}', '2026-05-10 22:45:40.465029');
INSERT INTO "public"."sensor_data" VALUES (5373, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427944}', '2026-05-10 22:45:45.466113');
INSERT INTO "public"."sensor_data" VALUES (5374, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427949}', '2026-05-10 22:45:50.466352');
INSERT INTO "public"."sensor_data" VALUES (5375, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427954}', '2026-05-10 22:45:55.471675');
INSERT INTO "public"."sensor_data" VALUES (5376, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427959}', '2026-05-10 22:46:00.471723');
INSERT INTO "public"."sensor_data" VALUES (5377, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427964}', '2026-05-10 22:46:05.474103');
INSERT INTO "public"."sensor_data" VALUES (5378, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427969}', '2026-05-10 22:46:10.471581');
INSERT INTO "public"."sensor_data" VALUES (5379, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427974}', '2026-05-10 22:46:15.473683');
INSERT INTO "public"."sensor_data" VALUES (5380, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427979}', '2026-05-10 22:46:20.473022');
INSERT INTO "public"."sensor_data" VALUES (5381, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427984}', '2026-05-10 22:46:25.477046');
INSERT INTO "public"."sensor_data" VALUES (5382, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427989}', '2026-05-10 22:46:30.472849');
INSERT INTO "public"."sensor_data" VALUES (5383, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427994}', '2026-05-10 22:46:35.480953');
INSERT INTO "public"."sensor_data" VALUES (5384, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778427999}', '2026-05-10 22:46:40.473215');
INSERT INTO "public"."sensor_data" VALUES (5385, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428004}', '2026-05-10 22:46:45.475239');
INSERT INTO "public"."sensor_data" VALUES (5386, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428009}', '2026-05-10 22:46:51.761097');
INSERT INTO "public"."sensor_data" VALUES (5387, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428014}', '2026-05-10 22:46:55.479');
INSERT INTO "public"."sensor_data" VALUES (5388, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428019}', '2026-05-10 22:47:00.484791');
INSERT INTO "public"."sensor_data" VALUES (5389, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428023}', '2026-05-10 22:47:03.880642');
INSERT INTO "public"."sensor_data" VALUES (5390, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428024}', '2026-05-10 22:47:05.480439');
INSERT INTO "public"."sensor_data" VALUES (5391, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428029}', '2026-05-10 22:47:10.483811');
INSERT INTO "public"."sensor_data" VALUES (5392, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428034}', '2026-05-10 22:47:15.485361');
INSERT INTO "public"."sensor_data" VALUES (5393, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428039}', '2026-05-10 22:47:20.481894');
INSERT INTO "public"."sensor_data" VALUES (5394, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428044}', '2026-05-10 22:47:25.482523');
INSERT INTO "public"."sensor_data" VALUES (5395, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428049}', '2026-05-10 22:47:30.486077');
INSERT INTO "public"."sensor_data" VALUES (5396, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428052}', '2026-05-10 22:47:32.94569');
INSERT INTO "public"."sensor_data" VALUES (5397, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428054}', '2026-05-10 22:47:35.48367');
INSERT INTO "public"."sensor_data" VALUES (5398, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428059}', '2026-05-10 22:47:40.489881');
INSERT INTO "public"."sensor_data" VALUES (5399, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.8°C / 54.0%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778428064}', '2026-05-10 22:47:44.862857');
INSERT INTO "public"."sensor_data" VALUES (5400, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778428064}', '2026-05-10 22:47:45.117161');
INSERT INTO "public"."sensor_data" VALUES (5401, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428064}', '2026-05-10 22:47:45.482862');
INSERT INTO "public"."sensor_data" VALUES (5402, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428069}', '2026-05-10 22:47:50.488748');
INSERT INTO "public"."sensor_data" VALUES (5403, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428074}', '2026-05-10 22:47:55.485639');
INSERT INTO "public"."sensor_data" VALUES (5404, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428079}', '2026-05-10 22:48:00.487137');
INSERT INTO "public"."sensor_data" VALUES (5405, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428084}', '2026-05-10 22:48:05.381072');
INSERT INTO "public"."sensor_data" VALUES (5406, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428084}', '2026-05-10 22:48:05.69777');
INSERT INTO "public"."sensor_data" VALUES (5407, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428089}', '2026-05-10 22:48:10.492525');
INSERT INTO "public"."sensor_data" VALUES (5408, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428094}', '2026-05-10 22:48:15.494275');
INSERT INTO "public"."sensor_data" VALUES (5409, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428099}', '2026-05-10 22:48:20.252648');
INSERT INTO "public"."sensor_data" VALUES (5410, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428099}', '2026-05-10 22:48:20.540479');
INSERT INTO "public"."sensor_data" VALUES (5411, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428104}', '2026-05-10 22:48:25.488669');
INSERT INTO "public"."sensor_data" VALUES (5412, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428105}', '2026-05-10 22:48:26.325821');
INSERT INTO "public"."sensor_data" VALUES (5413, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428109}', '2026-05-10 22:48:30.497173');
INSERT INTO "public"."sensor_data" VALUES (5414, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428114}', '2026-05-10 22:48:35.499054');
INSERT INTO "public"."sensor_data" VALUES (5415, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428119}', '2026-05-10 22:48:40.493115');
INSERT INTO "public"."sensor_data" VALUES (5416, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428124}', '2026-05-10 22:48:45.493716');
INSERT INTO "public"."sensor_data" VALUES (5417, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428129}', '2026-05-10 22:48:50.492653');
INSERT INTO "public"."sensor_data" VALUES (5418, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428134}', '2026-05-10 22:48:55.495423');
INSERT INTO "public"."sensor_data" VALUES (5419, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428139}', '2026-05-10 22:49:00.507439');
INSERT INTO "public"."sensor_data" VALUES (5420, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428144}', '2026-05-10 22:49:05.500542');
INSERT INTO "public"."sensor_data" VALUES (5421, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428149}', '2026-05-10 22:49:10.497235');
INSERT INTO "public"."sensor_data" VALUES (5422, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428154}', '2026-05-10 22:49:15.4995');
INSERT INTO "public"."sensor_data" VALUES (5423, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428155}', '2026-05-10 22:49:15.840105');
INSERT INTO "public"."sensor_data" VALUES (5424, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428159}', '2026-05-10 22:49:20.498482');
INSERT INTO "public"."sensor_data" VALUES (5425, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428164}', '2026-05-10 22:49:25.499916');
INSERT INTO "public"."sensor_data" VALUES (5426, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428169}', '2026-05-10 22:49:30.502084');
INSERT INTO "public"."sensor_data" VALUES (5427, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428174}', '2026-05-10 22:49:35.505116');
INSERT INTO "public"."sensor_data" VALUES (5428, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428179}', '2026-05-10 22:49:40.512821');
INSERT INTO "public"."sensor_data" VALUES (5429, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428184}', '2026-05-10 22:49:45.510356');
INSERT INTO "public"."sensor_data" VALUES (5430, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428189}', '2026-05-10 22:49:50.503341');
INSERT INTO "public"."sensor_data" VALUES (5431, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428194}', '2026-05-10 22:49:55.50177');
INSERT INTO "public"."sensor_data" VALUES (5432, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428199}', '2026-05-10 22:50:00.535911');
INSERT INTO "public"."sensor_data" VALUES (5433, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428204}', '2026-05-10 22:50:05.508293');
INSERT INTO "public"."sensor_data" VALUES (5434, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428209}', '2026-05-10 22:50:10.511483');
INSERT INTO "public"."sensor_data" VALUES (5435, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428214}', '2026-05-10 22:50:15.506165');
INSERT INTO "public"."sensor_data" VALUES (5436, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428218}', '2026-05-10 22:50:18.72892');
INSERT INTO "public"."sensor_data" VALUES (5437, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428219}', '2026-05-10 22:50:20.50808');
INSERT INTO "public"."sensor_data" VALUES (5438, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428224}', '2026-05-10 22:50:25.510261');
INSERT INTO "public"."sensor_data" VALUES (5439, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428229}', '2026-05-10 22:50:30.520911');
INSERT INTO "public"."sensor_data" VALUES (5440, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428234}', '2026-05-10 22:50:35.238567');
INSERT INTO "public"."sensor_data" VALUES (5441, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428234}', '2026-05-10 22:50:35.51088');
INSERT INTO "public"."sensor_data" VALUES (5442, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428239}', '2026-05-10 22:50:40.517026');
INSERT INTO "public"."sensor_data" VALUES (5443, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428244}', '2026-05-10 22:50:45.511668');
INSERT INTO "public"."sensor_data" VALUES (5444, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428248}', '2026-05-10 22:50:49.491854');
INSERT INTO "public"."sensor_data" VALUES (5445, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428249}', '2026-05-10 22:50:50.51221');
INSERT INTO "public"."sensor_data" VALUES (5446, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428254}', '2026-05-10 22:50:55.513174');
INSERT INTO "public"."sensor_data" VALUES (5447, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428260}', '2026-05-10 22:51:00.523161');
INSERT INTO "public"."sensor_data" VALUES (5448, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428265}', '2026-05-10 22:51:05.516847');
INSERT INTO "public"."sensor_data" VALUES (5449, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428270}', '2026-05-10 22:51:10.519331');
INSERT INTO "public"."sensor_data" VALUES (5450, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428271}', '2026-05-10 22:51:12.182109');
INSERT INTO "public"."sensor_data" VALUES (5451, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428275}', '2026-05-10 22:51:15.515799');
INSERT INTO "public"."sensor_data" VALUES (5452, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428280}', '2026-05-10 22:51:20.518524');
INSERT INTO "public"."sensor_data" VALUES (5453, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428285}', '2026-05-10 22:51:25.516592');
INSERT INTO "public"."sensor_data" VALUES (5454, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428290}', '2026-05-10 22:51:30.519099');
INSERT INTO "public"."sensor_data" VALUES (5455, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428295}', '2026-05-10 22:51:35.526945');
INSERT INTO "public"."sensor_data" VALUES (5456, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428300}', '2026-05-10 22:51:40.521372');
INSERT INTO "public"."sensor_data" VALUES (5457, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428305}', '2026-05-10 22:51:45.520749');
INSERT INTO "public"."sensor_data" VALUES (5458, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428310}', '2026-05-10 22:51:50.521155');
INSERT INTO "public"."sensor_data" VALUES (5459, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428311}', '2026-05-10 22:51:52.011727');
INSERT INTO "public"."sensor_data" VALUES (5460, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428315}', '2026-05-10 22:51:55.521215');
INSERT INTO "public"."sensor_data" VALUES (5461, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428320}', '2026-05-10 22:52:00.542743');
INSERT INTO "public"."sensor_data" VALUES (5462, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428325}', '2026-05-10 22:52:05.528042');
INSERT INTO "public"."sensor_data" VALUES (5463, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428330}', '2026-05-10 22:52:10.525211');
INSERT INTO "public"."sensor_data" VALUES (5464, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428335}', '2026-05-10 22:52:15.528275');
INSERT INTO "public"."sensor_data" VALUES (5465, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428335}', '2026-05-10 22:52:16.090749');
INSERT INTO "public"."sensor_data" VALUES (5466, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428340}', '2026-05-10 22:52:20.525522');
INSERT INTO "public"."sensor_data" VALUES (5467, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428345}', '2026-05-10 22:52:25.526159');
INSERT INTO "public"."sensor_data" VALUES (5468, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428350}', '2026-05-10 22:52:30.531933');
INSERT INTO "public"."sensor_data" VALUES (5469, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428355}', '2026-05-10 22:52:35.531977');
INSERT INTO "public"."sensor_data" VALUES (5470, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428360}', '2026-05-10 22:52:40.5308');
INSERT INTO "public"."sensor_data" VALUES (5471, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428363}', '2026-05-10 22:52:43.827814');
INSERT INTO "public"."sensor_data" VALUES (5472, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "37.4°C / 50.6%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778428364}', '2026-05-10 22:52:44.852373');
INSERT INTO "public"."sensor_data" VALUES (5473, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778428364}', '2026-05-10 22:52:45.138491');
INSERT INTO "public"."sensor_data" VALUES (5474, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "32 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428365}', '2026-05-10 22:52:45.532157');
INSERT INTO "public"."sensor_data" VALUES (5475, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428370}', '2026-05-10 22:52:50.533316');
INSERT INTO "public"."sensor_data" VALUES (5476, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428373}', '2026-05-10 22:52:54.251976');
INSERT INTO "public"."sensor_data" VALUES (5477, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428375}', '2026-05-10 22:52:55.53103');
INSERT INTO "public"."sensor_data" VALUES (5478, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428380}', '2026-05-10 22:53:00.54812');
INSERT INTO "public"."sensor_data" VALUES (5479, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428385}', '2026-05-10 22:53:05.534145');
INSERT INTO "public"."sensor_data" VALUES (5480, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428390}', '2026-05-10 22:53:10.535919');
INSERT INTO "public"."sensor_data" VALUES (5481, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428395}', '2026-05-10 22:53:15.537042');
INSERT INTO "public"."sensor_data" VALUES (5482, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428400}', '2026-05-10 22:53:20.53626');
INSERT INTO "public"."sensor_data" VALUES (5483, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428405}', '2026-05-10 22:53:25.534949');
INSERT INTO "public"."sensor_data" VALUES (5484, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428408}', '2026-05-10 22:53:28.615047');
INSERT INTO "public"."sensor_data" VALUES (5485, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428410}', '2026-05-10 22:53:30.535684');
INSERT INTO "public"."sensor_data" VALUES (5486, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428414}', '2026-05-10 22:53:34.969229');
INSERT INTO "public"."sensor_data" VALUES (5487, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428415}', '2026-05-10 22:53:35.538625');
INSERT INTO "public"."sensor_data" VALUES (5488, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428420}', '2026-05-10 22:53:40.536783');
INSERT INTO "public"."sensor_data" VALUES (5489, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428425}', '2026-05-10 22:53:45.562365');
INSERT INTO "public"."sensor_data" VALUES (5490, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428430}', '2026-05-10 22:53:50.540297');
INSERT INTO "public"."sensor_data" VALUES (5491, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.3, "timestamp": 1778428430}', '2026-05-10 22:53:50.775899');
INSERT INTO "public"."sensor_data" VALUES (5492, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428435}', '2026-05-10 22:53:55.541106');
INSERT INTO "public"."sensor_data" VALUES (5493, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428440}', '2026-05-10 22:54:00.547961');
INSERT INTO "public"."sensor_data" VALUES (5494, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428445}', '2026-05-10 22:54:05.540747');
INSERT INTO "public"."sensor_data" VALUES (5495, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428450}', '2026-05-10 22:54:10.546411');
INSERT INTO "public"."sensor_data" VALUES (5496, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428455}', '2026-05-10 22:54:15.542673');
INSERT INTO "public"."sensor_data" VALUES (5497, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428460}', '2026-05-10 22:54:20.54232');
INSERT INTO "public"."sensor_data" VALUES (5498, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428465}', '2026-05-10 22:54:25.544251');
INSERT INTO "public"."sensor_data" VALUES (5499, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428470}', '2026-05-10 22:54:30.544779');
INSERT INTO "public"."sensor_data" VALUES (5500, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428475}', '2026-05-10 22:54:35.545442');
INSERT INTO "public"."sensor_data" VALUES (5501, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428480}', '2026-05-10 22:54:40.548229');
INSERT INTO "public"."sensor_data" VALUES (5502, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428485}', '2026-05-10 22:54:45.566753');
INSERT INTO "public"."sensor_data" VALUES (5503, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428490}', '2026-05-10 22:54:50.559804');
INSERT INTO "public"."sensor_data" VALUES (5504, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428495}', '2026-05-10 22:54:55.567318');
INSERT INTO "public"."sensor_data" VALUES (5505, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428500}', '2026-05-10 22:55:00.563127');
INSERT INTO "public"."sensor_data" VALUES (5506, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428505}', '2026-05-10 22:55:05.566562');
INSERT INTO "public"."sensor_data" VALUES (5507, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428510}', '2026-05-10 22:55:10.567026');
INSERT INTO "public"."sensor_data" VALUES (5508, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428515}', '2026-05-10 22:55:15.571636');
INSERT INTO "public"."sensor_data" VALUES (5509, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428520}', '2026-05-10 22:55:20.564935');
INSERT INTO "public"."sensor_data" VALUES (5510, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428525}', '2026-05-10 22:55:25.565224');
INSERT INTO "public"."sensor_data" VALUES (5511, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428530}', '2026-05-10 22:55:30.568204');
INSERT INTO "public"."sensor_data" VALUES (5512, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428535}', '2026-05-10 22:55:35.605414');
INSERT INTO "public"."sensor_data" VALUES (5513, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428540}', '2026-05-10 22:55:40.569133');
INSERT INTO "public"."sensor_data" VALUES (5514, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428545}', '2026-05-10 22:55:45.584478');
INSERT INTO "public"."sensor_data" VALUES (5515, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428550}', '2026-05-10 22:55:50.580534');
INSERT INTO "public"."sensor_data" VALUES (5516, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428555}', '2026-05-10 22:55:55.569614');
INSERT INTO "public"."sensor_data" VALUES (5517, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428560}', '2026-05-10 22:56:00.577547');
INSERT INTO "public"."sensor_data" VALUES (5518, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428561}', '2026-05-10 22:56:01.828399');
INSERT INTO "public"."sensor_data" VALUES (5519, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428565}', '2026-05-10 22:56:05.571106');
INSERT INTO "public"."sensor_data" VALUES (5520, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428570}', '2026-05-10 22:56:10.57763');
INSERT INTO "public"."sensor_data" VALUES (5521, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428575}', '2026-05-10 22:56:15.589588');
INSERT INTO "public"."sensor_data" VALUES (5522, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428580}', '2026-05-10 22:56:20.580438');
INSERT INTO "public"."sensor_data" VALUES (5523, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428585}', '2026-05-10 22:56:25.579992');
INSERT INTO "public"."sensor_data" VALUES (5524, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428590}', '2026-05-10 22:56:30.574745');
INSERT INTO "public"."sensor_data" VALUES (5525, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428595}', '2026-05-10 22:56:35.577193');
INSERT INTO "public"."sensor_data" VALUES (5526, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428600}', '2026-05-10 22:56:40.581542');
INSERT INTO "public"."sensor_data" VALUES (5527, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428605}', '2026-05-10 22:56:45.584454');
INSERT INTO "public"."sensor_data" VALUES (5528, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428610}', '2026-05-10 22:56:50.583328');
INSERT INTO "public"."sensor_data" VALUES (5529, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428615}', '2026-05-10 22:56:55.58218');
INSERT INTO "public"."sensor_data" VALUES (5530, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428620}', '2026-05-10 22:57:00.596269');
INSERT INTO "public"."sensor_data" VALUES (5531, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428625}', '2026-05-10 22:57:05.579632');
INSERT INTO "public"."sensor_data" VALUES (5532, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428630}', '2026-05-10 22:57:10.582454');
INSERT INTO "public"."sensor_data" VALUES (5533, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428635}', '2026-05-10 22:57:15.584033');
INSERT INTO "public"."sensor_data" VALUES (5534, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428640}', '2026-05-10 22:57:20.585764');
INSERT INTO "public"."sensor_data" VALUES (5535, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428645}', '2026-05-10 22:57:25.58218');
INSERT INTO "public"."sensor_data" VALUES (5536, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428650}', '2026-05-10 22:57:30.583435');
INSERT INTO "public"."sensor_data" VALUES (5537, '46a4586a-e5d6-4d98-9890-4a919d9d0953', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "livingroom_sensor_pir", "timestamp": 1778428654}', '2026-05-10 22:57:35.468492');
INSERT INTO "public"."sensor_data" VALUES (5538, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428655}', '2026-05-10 22:57:35.757153');
INSERT INTO "public"."sensor_data" VALUES (5539, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428655}', '2026-05-10 22:57:36.386739');
INSERT INTO "public"."sensor_data" VALUES (5540, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428660}', '2026-05-10 22:57:40.5873');
INSERT INTO "public"."sensor_data" VALUES (5541, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "37.7°C / 50.1%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778428664}', '2026-05-10 22:57:44.868132');
INSERT INTO "public"."sensor_data" VALUES (5542, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778428664}', '2026-05-10 22:57:45.177862');
INSERT INTO "public"."sensor_data" VALUES (5543, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "32 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428665}', '2026-05-10 22:57:45.587081');
INSERT INTO "public"."sensor_data" VALUES (5544, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428670}', '2026-05-10 22:57:50.587127');
INSERT INTO "public"."sensor_data" VALUES (5545, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428675}', '2026-05-10 22:57:55.593205');
INSERT INTO "public"."sensor_data" VALUES (5546, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428675}', '2026-05-10 22:57:55.938766');
INSERT INTO "public"."sensor_data" VALUES (5547, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428680}', '2026-05-10 22:58:00.594031');
INSERT INTO "public"."sensor_data" VALUES (5548, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428685}', '2026-05-10 22:58:05.666984');
INSERT INTO "public"."sensor_data" VALUES (5549, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.3, "timestamp": 1778428685}', '2026-05-10 22:58:05.668955');
INSERT INTO "public"."sensor_data" VALUES (5550, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428690}', '2026-05-10 22:58:10.589482');
INSERT INTO "public"."sensor_data" VALUES (5551, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428694}', '2026-05-10 22:58:14.899632');
INSERT INTO "public"."sensor_data" VALUES (5552, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428695}', '2026-05-10 22:58:15.590734');
INSERT INTO "public"."sensor_data" VALUES (5553, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428700}', '2026-05-10 22:58:20.592323');
INSERT INTO "public"."sensor_data" VALUES (5554, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428702}', '2026-05-10 22:58:22.924139');
INSERT INTO "public"."sensor_data" VALUES (5555, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428705}', '2026-05-10 22:58:25.59083');
INSERT INTO "public"."sensor_data" VALUES (5556, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428710}', '2026-05-10 22:58:30.594293');
INSERT INTO "public"."sensor_data" VALUES (5557, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428715}', '2026-05-10 22:58:35.595296');
INSERT INTO "public"."sensor_data" VALUES (5558, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428715}', '2026-05-10 22:58:35.950419');
INSERT INTO "public"."sensor_data" VALUES (5559, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428720}', '2026-05-10 22:58:40.593236');
INSERT INTO "public"."sensor_data" VALUES (5560, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428725}', '2026-05-10 22:58:45.600119');
INSERT INTO "public"."sensor_data" VALUES (5561, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428727}', '2026-05-10 22:58:48.396547');
INSERT INTO "public"."sensor_data" VALUES (5562, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428730}', '2026-05-10 22:58:50.595699');
INSERT INTO "public"."sensor_data" VALUES (5563, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428735}', '2026-05-10 22:58:55.597289');
INSERT INTO "public"."sensor_data" VALUES (5564, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428735}', '2026-05-10 22:58:55.935689');
INSERT INTO "public"."sensor_data" VALUES (5565, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428740}', '2026-05-10 22:59:00.598858');
INSERT INTO "public"."sensor_data" VALUES (5566, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428743}', '2026-05-10 22:59:03.779293');
INSERT INTO "public"."sensor_data" VALUES (5567, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428745}', '2026-05-10 22:59:05.598871');
INSERT INTO "public"."sensor_data" VALUES (5568, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428749}', '2026-05-10 22:59:10.062751');
INSERT INTO "public"."sensor_data" VALUES (5569, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428750}', '2026-05-10 22:59:10.59799');
INSERT INTO "public"."sensor_data" VALUES (5570, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428755}', '2026-05-10 22:59:15.603872');
INSERT INTO "public"."sensor_data" VALUES (5571, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428758}', '2026-05-10 22:59:18.8204');
INSERT INTO "public"."sensor_data" VALUES (5572, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428760}', '2026-05-10 22:59:20.610199');
INSERT INTO "public"."sensor_data" VALUES (5573, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428765}', '2026-05-10 22:59:25.499473');
INSERT INTO "public"."sensor_data" VALUES (5574, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428765}', '2026-05-10 22:59:25.840369');
INSERT INTO "public"."sensor_data" VALUES (5575, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.3, "timestamp": 1778428765}', '2026-05-10 22:59:25.842371');
INSERT INTO "public"."sensor_data" VALUES (5576, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428770}', '2026-05-10 22:59:30.603545');
INSERT INTO "public"."sensor_data" VALUES (5577, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.3, "timestamp": 1778428770}', '2026-05-10 22:59:30.858494');
INSERT INTO "public"."sensor_data" VALUES (5578, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428774}', '2026-05-10 22:59:34.771562');
INSERT INTO "public"."sensor_data" VALUES (5579, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428775}', '2026-05-10 22:59:35.601999');
INSERT INTO "public"."sensor_data" VALUES (5580, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428780}', '2026-05-10 22:59:40.592936');
INSERT INTO "public"."sensor_data" VALUES (5581, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428782}', '2026-05-10 22:59:43.393447');
INSERT INTO "public"."sensor_data" VALUES (5582, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428785}', '2026-05-10 22:59:45.594077');
INSERT INTO "public"."sensor_data" VALUES (5583, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428790}', '2026-05-10 22:59:50.594535');
INSERT INTO "public"."sensor_data" VALUES (5584, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428795}', '2026-05-10 22:59:55.593441');
INSERT INTO "public"."sensor_data" VALUES (5585, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428798}', '2026-05-10 22:59:59.305867');
INSERT INTO "public"."sensor_data" VALUES (5586, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428800}', '2026-05-10 23:00:00.607502');
INSERT INTO "public"."sensor_data" VALUES (5587, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428805}', '2026-05-10 23:00:05.598804');
INSERT INTO "public"."sensor_data" VALUES (5588, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428810}', '2026-05-10 23:00:10.594');
INSERT INTO "public"."sensor_data" VALUES (5589, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428815}', '2026-05-10 23:00:15.510661');
INSERT INTO "public"."sensor_data" VALUES (5590, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428815}', '2026-05-10 23:00:15.797332');
INSERT INTO "public"."sensor_data" VALUES (5591, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428820}', '2026-05-10 23:00:20.594552');
INSERT INTO "public"."sensor_data" VALUES (5592, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428820}', '2026-05-10 23:00:21.185093');
INSERT INTO "public"."sensor_data" VALUES (5593, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428825}', '2026-05-10 23:00:25.595185');
INSERT INTO "public"."sensor_data" VALUES (5594, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428830}', '2026-05-10 23:00:30.596282');
INSERT INTO "public"."sensor_data" VALUES (5595, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428835}', '2026-05-10 23:00:35.599697');
INSERT INTO "public"."sensor_data" VALUES (5596, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428840}', '2026-05-10 23:00:40.597736');
INSERT INTO "public"."sensor_data" VALUES (5597, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428844}', '2026-05-10 23:00:44.778981');
INSERT INTO "public"."sensor_data" VALUES (5598, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428845}', '2026-05-10 23:00:45.601319');
INSERT INTO "public"."sensor_data" VALUES (5599, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428849}', '2026-05-10 23:00:50.300457');
INSERT INTO "public"."sensor_data" VALUES (5600, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428850}', '2026-05-10 23:00:50.608564');
INSERT INTO "public"."sensor_data" VALUES (5601, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428855}', '2026-05-10 23:00:55.60043');
INSERT INTO "public"."sensor_data" VALUES (5602, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428860}', '2026-05-10 23:01:00.608906');
INSERT INTO "public"."sensor_data" VALUES (5603, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428865}', '2026-05-10 23:01:05.603341');
INSERT INTO "public"."sensor_data" VALUES (5604, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428867}', '2026-05-10 23:01:07.791041');
INSERT INTO "public"."sensor_data" VALUES (5605, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428870}', '2026-05-10 23:01:10.602875');
INSERT INTO "public"."sensor_data" VALUES (5606, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428872}', '2026-05-10 23:01:13.068521');
INSERT INTO "public"."sensor_data" VALUES (5607, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428875}', '2026-05-10 23:01:15.604908');
INSERT INTO "public"."sensor_data" VALUES (5608, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428879}', '2026-05-10 23:01:19.552382');
INSERT INTO "public"."sensor_data" VALUES (5609, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428880}', '2026-05-10 23:01:20.606472');
INSERT INTO "public"."sensor_data" VALUES (5610, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428885}', '2026-05-10 23:01:25.614106');
INSERT INTO "public"."sensor_data" VALUES (5611, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428885}', '2026-05-10 23:01:25.939522');
INSERT INTO "public"."sensor_data" VALUES (5612, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428890}', '2026-05-10 23:01:30.605742');
INSERT INTO "public"."sensor_data" VALUES (5613, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428895}', '2026-05-10 23:01:35.606175');
INSERT INTO "public"."sensor_data" VALUES (5614, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428898}', '2026-05-10 23:01:39.024026');
INSERT INTO "public"."sensor_data" VALUES (5615, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428900}', '2026-05-10 23:01:40.606537');
INSERT INTO "public"."sensor_data" VALUES (5616, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428905}', '2026-05-10 23:01:45.611068');
INSERT INTO "public"."sensor_data" VALUES (5617, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428905}', '2026-05-10 23:01:45.971528');
INSERT INTO "public"."sensor_data" VALUES (5618, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428910}', '2026-05-10 23:01:50.609168');
INSERT INTO "public"."sensor_data" VALUES (5619, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428912}', '2026-05-10 23:01:53.257726');
INSERT INTO "public"."sensor_data" VALUES (5620, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428915}', '2026-05-10 23:01:55.641205');
INSERT INTO "public"."sensor_data" VALUES (5621, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428919}', '2026-05-10 23:01:59.970658');
INSERT INTO "public"."sensor_data" VALUES (5622, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428920}', '2026-05-10 23:02:00.632833');
INSERT INTO "public"."sensor_data" VALUES (5623, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428925}', '2026-05-10 23:02:05.611884');
INSERT INTO "public"."sensor_data" VALUES (5624, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428930}', '2026-05-10 23:02:10.610615');
INSERT INTO "public"."sensor_data" VALUES (5625, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428932}', '2026-05-10 23:02:12.588084');
INSERT INTO "public"."sensor_data" VALUES (5626, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428935}', '2026-05-10 23:02:15.61381');
INSERT INTO "public"."sensor_data" VALUES (5627, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428940}', '2026-05-10 23:02:20.612576');
INSERT INTO "public"."sensor_data" VALUES (5628, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428945}', '2026-05-10 23:02:25.843439');
INSERT INTO "public"."sensor_data" VALUES (5629, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428947}', '2026-05-10 23:02:28.305587');
INSERT INTO "public"."sensor_data" VALUES (5630, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428950}', '2026-05-10 23:02:30.615284');
INSERT INTO "public"."sensor_data" VALUES (5631, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428955}', '2026-05-10 23:02:35.614372');
INSERT INTO "public"."sensor_data" VALUES (5632, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428957}', '2026-05-10 23:02:38.280806');
INSERT INTO "public"."sensor_data" VALUES (5633, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428960}', '2026-05-10 23:02:40.616739');
INSERT INTO "public"."sensor_data" VALUES (5634, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428963}', '2026-05-10 23:02:44.225353');
INSERT INTO "public"."sensor_data" VALUES (5635, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "38.2°C / 48.5%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778428964}', '2026-05-10 23:02:44.842236');
INSERT INTO "public"."sensor_data" VALUES (5636, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778428964}', '2026-05-10 23:02:45.094318');
INSERT INTO "public"."sensor_data" VALUES (5637, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "32 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428965}', '2026-05-10 23:02:45.621228');
INSERT INTO "public"."sensor_data" VALUES (5638, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428970}', '2026-05-10 23:02:50.622841');
INSERT INTO "public"."sensor_data" VALUES (5639, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428973}', '2026-05-10 23:02:53.918615');
INSERT INTO "public"."sensor_data" VALUES (5640, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428975}', '2026-05-10 23:02:55.624165');
INSERT INTO "public"."sensor_data" VALUES (5641, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428978}', '2026-05-10 23:02:59.200083');
INSERT INTO "public"."sensor_data" VALUES (5642, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428980}', '2026-05-10 23:03:00.6228');
INSERT INTO "public"."sensor_data" VALUES (5643, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428984}', '2026-05-10 23:03:05.022895');
INSERT INTO "public"."sensor_data" VALUES (5644, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428985}', '2026-05-10 23:03:05.618483');
INSERT INTO "public"."sensor_data" VALUES (5645, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428990}', '2026-05-10 23:03:10.61928');
INSERT INTO "public"."sensor_data" VALUES (5646, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778428995}', '2026-05-10 23:03:15.626343');
INSERT INTO "public"."sensor_data" VALUES (5647, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778428998}', '2026-05-10 23:03:18.625965');
INSERT INTO "public"."sensor_data" VALUES (5648, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429000}', '2026-05-10 23:03:20.62186');
INSERT INTO "public"."sensor_data" VALUES (5649, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429005}', '2026-05-10 23:03:25.626139');
INSERT INTO "public"."sensor_data" VALUES (5650, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429010}', '2026-05-10 23:03:30.627906');
INSERT INTO "public"."sensor_data" VALUES (5651, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429014}', '2026-05-10 23:03:35.202936');
INSERT INTO "public"."sensor_data" VALUES (5652, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429015}', '2026-05-10 23:03:35.623249');
INSERT INTO "public"."sensor_data" VALUES (5653, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429020}', '2026-05-10 23:03:40.623645');
INSERT INTO "public"."sensor_data" VALUES (5654, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429025}', '2026-05-10 23:03:45.625338');
INSERT INTO "public"."sensor_data" VALUES (5655, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429027}', '2026-05-10 23:03:47.729732');
INSERT INTO "public"."sensor_data" VALUES (5656, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429030}', '2026-05-10 23:03:50.632393');
INSERT INTO "public"."sensor_data" VALUES (5657, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429032}', '2026-05-10 23:03:53.132632');
INSERT INTO "public"."sensor_data" VALUES (5658, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429035}', '2026-05-10 23:03:55.635555');
INSERT INTO "public"."sensor_data" VALUES (5659, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429040}', '2026-05-10 23:04:00.634607');
INSERT INTO "public"."sensor_data" VALUES (5660, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429045}', '2026-05-10 23:04:05.629467');
INSERT INTO "public"."sensor_data" VALUES (5661, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429050}', '2026-05-10 23:04:10.629051');
INSERT INTO "public"."sensor_data" VALUES (5662, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429055}', '2026-05-10 23:04:15.642');
INSERT INTO "public"."sensor_data" VALUES (5663, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429060}', '2026-05-10 23:04:20.635016');
INSERT INTO "public"."sensor_data" VALUES (5664, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429065}', '2026-05-10 23:04:25.632995');
INSERT INTO "public"."sensor_data" VALUES (5665, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429070}', '2026-05-10 23:04:30.646823');
INSERT INTO "public"."sensor_data" VALUES (5666, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429075}', '2026-05-10 23:04:35.632182');
INSERT INTO "public"."sensor_data" VALUES (5667, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429080}', '2026-05-10 23:04:40.633406');
INSERT INTO "public"."sensor_data" VALUES (5668, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429085}', '2026-05-10 23:04:45.636006');
INSERT INTO "public"."sensor_data" VALUES (5669, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429085}', '2026-05-10 23:04:45.921543');
INSERT INTO "public"."sensor_data" VALUES (5670, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429090}', '2026-05-10 23:04:50.636785');
INSERT INTO "public"."sensor_data" VALUES (5671, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429095}', '2026-05-10 23:04:55.634181');
INSERT INTO "public"."sensor_data" VALUES (5672, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429100}', '2026-05-10 23:05:00.652241');
INSERT INTO "public"."sensor_data" VALUES (5673, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429105}', '2026-05-10 23:05:05.642846');
INSERT INTO "public"."sensor_data" VALUES (5674, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429110}', '2026-05-10 23:05:10.641183');
INSERT INTO "public"."sensor_data" VALUES (5675, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429111}', '2026-05-10 23:05:11.485806');
INSERT INTO "public"."sensor_data" VALUES (5676, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429115}', '2026-05-10 23:05:15.63937');
INSERT INTO "public"."sensor_data" VALUES (5677, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429118}', '2026-05-10 23:05:19.375457');
INSERT INTO "public"."sensor_data" VALUES (5678, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429120}', '2026-05-10 23:05:20.64117');
INSERT INTO "public"."sensor_data" VALUES (5679, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429125}', '2026-05-10 23:05:25.640911');
INSERT INTO "public"."sensor_data" VALUES (5680, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429129}', '2026-05-10 23:05:30.124971');
INSERT INTO "public"."sensor_data" VALUES (5681, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429130}', '2026-05-10 23:05:30.650739');
INSERT INTO "public"."sensor_data" VALUES (5682, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429135}', '2026-05-10 23:05:35.642361');
INSERT INTO "public"."sensor_data" VALUES (5683, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429140}', '2026-05-10 23:05:40.646479');
INSERT INTO "public"."sensor_data" VALUES (5684, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429145}', '2026-05-10 23:05:45.648108');
INSERT INTO "public"."sensor_data" VALUES (5685, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429148}', '2026-05-10 23:05:48.969494');
INSERT INTO "public"."sensor_data" VALUES (5686, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429150}', '2026-05-10 23:05:50.650324');
INSERT INTO "public"."sensor_data" VALUES (5687, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429155}', '2026-05-10 23:05:55.649892');
INSERT INTO "public"."sensor_data" VALUES (5688, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429160}', '2026-05-10 23:06:00.651262');
INSERT INTO "public"."sensor_data" VALUES (5689, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429165}', '2026-05-10 23:06:05.646025');
INSERT INTO "public"."sensor_data" VALUES (5690, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429166}', '2026-05-10 23:06:07.432722');
INSERT INTO "public"."sensor_data" VALUES (5691, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429170}', '2026-05-10 23:06:10.6493');
INSERT INTO "public"."sensor_data" VALUES (5692, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429175}', '2026-05-10 23:06:15.648043');
INSERT INTO "public"."sensor_data" VALUES (5693, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429180}', '2026-05-10 23:06:20.648277');
INSERT INTO "public"."sensor_data" VALUES (5694, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429185}', '2026-05-10 23:06:25.655563');
INSERT INTO "public"."sensor_data" VALUES (5695, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429190}', '2026-05-10 23:06:30.656736');
INSERT INTO "public"."sensor_data" VALUES (5696, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429195}', '2026-05-10 23:06:35.654899');
INSERT INTO "public"."sensor_data" VALUES (5697, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429200}', '2026-05-10 23:06:40.65085');
INSERT INTO "public"."sensor_data" VALUES (5698, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429205}', '2026-05-10 23:06:45.655864');
INSERT INTO "public"."sensor_data" VALUES (5699, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429210}', '2026-05-10 23:06:50.658765');
INSERT INTO "public"."sensor_data" VALUES (5700, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429215}', '2026-05-10 23:06:55.655642');
INSERT INTO "public"."sensor_data" VALUES (5701, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429220}', '2026-05-10 23:07:00.884877');
INSERT INTO "public"."sensor_data" VALUES (5702, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429225}', '2026-05-10 23:07:05.655384');
INSERT INTO "public"."sensor_data" VALUES (5703, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429228}', '2026-05-10 23:07:09.283784');
INSERT INTO "public"."sensor_data" VALUES (5704, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429230}', '2026-05-10 23:07:10.6552');
INSERT INTO "public"."sensor_data" VALUES (5705, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429235}', '2026-05-10 23:07:15.660227');
INSERT INTO "public"."sensor_data" VALUES (5706, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429240}', '2026-05-10 23:07:20.660004');
INSERT INTO "public"."sensor_data" VALUES (5707, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429245}', '2026-05-10 23:07:25.666751');
INSERT INTO "public"."sensor_data" VALUES (5708, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429250}', '2026-05-10 23:07:30.661017');
INSERT INTO "public"."sensor_data" VALUES (5709, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429255}', '2026-05-10 23:07:35.659279');
INSERT INTO "public"."sensor_data" VALUES (5710, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429260}', '2026-05-10 23:07:40.659539');
INSERT INTO "public"."sensor_data" VALUES (5711, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429262}', '2026-05-10 23:07:43.007667');
INSERT INTO "public"."sensor_data" VALUES (5712, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "38.0°C / 49.0%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778429264}', '2026-05-10 23:07:44.828521');
INSERT INTO "public"."sensor_data" VALUES (5713, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778429264}', '2026-05-10 23:07:45.122539');
INSERT INTO "public"."sensor_data" VALUES (5714, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429265}', '2026-05-10 23:07:45.669883');
INSERT INTO "public"."sensor_data" VALUES (5715, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429270}', '2026-05-10 23:07:50.661853');
INSERT INTO "public"."sensor_data" VALUES (5716, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429271}', '2026-05-10 23:07:52.169517');
INSERT INTO "public"."sensor_data" VALUES (5717, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429275}', '2026-05-10 23:07:55.673979');
INSERT INTO "public"."sensor_data" VALUES (5718, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429280}', '2026-05-10 23:08:00.675804');
INSERT INTO "public"."sensor_data" VALUES (5719, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429282}', '2026-05-10 23:08:02.943403');
INSERT INTO "public"."sensor_data" VALUES (5720, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429285}', '2026-05-10 23:08:05.666448');
INSERT INTO "public"."sensor_data" VALUES (5721, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429290}', '2026-05-10 23:08:10.668728');
INSERT INTO "public"."sensor_data" VALUES (5722, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429295}', '2026-05-10 23:08:15.66908');
INSERT INTO "public"."sensor_data" VALUES (5723, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429300}', '2026-05-10 23:08:20.677777');
INSERT INTO "public"."sensor_data" VALUES (5724, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429305}', '2026-05-10 23:08:25.6727');
INSERT INTO "public"."sensor_data" VALUES (5725, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429310}', '2026-05-10 23:08:30.670727');
INSERT INTO "public"."sensor_data" VALUES (5726, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429315}', '2026-05-10 23:08:35.673152');
INSERT INTO "public"."sensor_data" VALUES (5727, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429320}', '2026-05-10 23:08:40.668862');
INSERT INTO "public"."sensor_data" VALUES (5728, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429325}', '2026-05-10 23:08:45.672982');
INSERT INTO "public"."sensor_data" VALUES (5729, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429327}', '2026-05-10 23:08:47.955844');
INSERT INTO "public"."sensor_data" VALUES (5730, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429330}', '2026-05-10 23:08:50.670682');
INSERT INTO "public"."sensor_data" VALUES (5731, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429335}', '2026-05-10 23:08:55.673293');
INSERT INTO "public"."sensor_data" VALUES (5732, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429340}', '2026-05-10 23:09:00.707525');
INSERT INTO "public"."sensor_data" VALUES (5733, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429345}', '2026-05-10 23:09:05.674734');
INSERT INTO "public"."sensor_data" VALUES (5734, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429350}', '2026-05-10 23:09:10.680015');
INSERT INTO "public"."sensor_data" VALUES (5735, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429355}', '2026-05-10 23:09:15.676022');
INSERT INTO "public"."sensor_data" VALUES (5736, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429360}', '2026-05-10 23:09:20.716127');
INSERT INTO "public"."sensor_data" VALUES (5737, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429365}', '2026-05-10 23:09:25.679016');
INSERT INTO "public"."sensor_data" VALUES (5738, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429370}', '2026-05-10 23:09:30.679898');
INSERT INTO "public"."sensor_data" VALUES (5739, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429375}', '2026-05-10 23:09:35.676893');
INSERT INTO "public"."sensor_data" VALUES (5740, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429380}', '2026-05-10 23:09:40.680861');
INSERT INTO "public"."sensor_data" VALUES (5741, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429385}', '2026-05-10 23:09:45.679896');
INSERT INTO "public"."sensor_data" VALUES (5742, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429390}', '2026-05-10 23:09:50.685218');
INSERT INTO "public"."sensor_data" VALUES (5743, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429395}', '2026-05-10 23:09:55.683402');
INSERT INTO "public"."sensor_data" VALUES (5744, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429400}', '2026-05-10 23:10:00.691204');
INSERT INTO "public"."sensor_data" VALUES (5745, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429405}', '2026-05-10 23:10:05.681085');
INSERT INTO "public"."sensor_data" VALUES (5746, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429410}', '2026-05-10 23:10:10.681949');
INSERT INTO "public"."sensor_data" VALUES (5747, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429411}', '2026-05-10 23:10:11.953867');
INSERT INTO "public"."sensor_data" VALUES (5748, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429415}', '2026-05-10 23:10:15.687884');
INSERT INTO "public"."sensor_data" VALUES (5749, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429420}', '2026-05-10 23:10:20.688798');
INSERT INTO "public"."sensor_data" VALUES (5750, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429425}', '2026-05-10 23:10:25.69894');
INSERT INTO "public"."sensor_data" VALUES (5751, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429426}', '2026-05-10 23:10:26.674105');
INSERT INTO "public"."sensor_data" VALUES (5752, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429430}', '2026-05-10 23:10:30.693746');
INSERT INTO "public"."sensor_data" VALUES (5753, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429435}', '2026-05-10 23:10:35.690257');
INSERT INTO "public"."sensor_data" VALUES (5754, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429440}', '2026-05-10 23:10:40.686228');
INSERT INTO "public"."sensor_data" VALUES (5755, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429445}', '2026-05-10 23:10:45.686705');
INSERT INTO "public"."sensor_data" VALUES (5756, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429450}', '2026-05-10 23:10:50.688713');
INSERT INTO "public"."sensor_data" VALUES (5757, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429453}', '2026-05-10 23:10:53.648767');
INSERT INTO "public"."sensor_data" VALUES (5758, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429455}', '2026-05-10 23:10:55.690489');
INSERT INTO "public"."sensor_data" VALUES (5759, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429460}', '2026-05-10 23:11:00.707514');
INSERT INTO "public"."sensor_data" VALUES (5760, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429465}', '2026-05-10 23:11:05.695602');
INSERT INTO "public"."sensor_data" VALUES (5761, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429470}', '2026-05-10 23:11:10.690854');
INSERT INTO "public"."sensor_data" VALUES (5762, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429475}', '2026-05-10 23:11:15.691431');
INSERT INTO "public"."sensor_data" VALUES (5763, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429480}', '2026-05-10 23:11:20.719706');
INSERT INTO "public"."sensor_data" VALUES (5764, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429485}', '2026-05-10 23:11:25.693067');
INSERT INTO "public"."sensor_data" VALUES (5765, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429489}', '2026-05-10 23:11:30.275187');
INSERT INTO "public"."sensor_data" VALUES (5766, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429490}', '2026-05-10 23:11:30.696464');
INSERT INTO "public"."sensor_data" VALUES (5767, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429495}', '2026-05-10 23:11:35.9262');
INSERT INTO "public"."sensor_data" VALUES (5768, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429500}', '2026-05-10 23:11:40.703069');
INSERT INTO "public"."sensor_data" VALUES (5769, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429505}', '2026-05-10 23:11:45.698786');
INSERT INTO "public"."sensor_data" VALUES (5770, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429510}', '2026-05-10 23:11:50.696336');
INSERT INTO "public"."sensor_data" VALUES (5771, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429515}', '2026-05-10 23:11:55.696731');
INSERT INTO "public"."sensor_data" VALUES (5772, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429515}', '2026-05-10 23:11:55.998302');
INSERT INTO "public"."sensor_data" VALUES (5773, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429520}', '2026-05-10 23:12:00.711786');
INSERT INTO "public"."sensor_data" VALUES (5774, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429521}', '2026-05-10 23:12:01.894936');
INSERT INTO "public"."sensor_data" VALUES (5775, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429525}', '2026-05-10 23:12:05.700766');
INSERT INTO "public"."sensor_data" VALUES (5776, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429528}', '2026-05-10 23:12:09.280089');
INSERT INTO "public"."sensor_data" VALUES (5777, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429530}', '2026-05-10 23:12:10.69846');
INSERT INTO "public"."sensor_data" VALUES (5778, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429535}', '2026-05-10 23:12:15.698011');
INSERT INTO "public"."sensor_data" VALUES (5779, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429536}', '2026-05-10 23:12:16.656584');
INSERT INTO "public"."sensor_data" VALUES (5780, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429540}', '2026-05-10 23:12:20.698692');
INSERT INTO "public"."sensor_data" VALUES (5781, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429541}', '2026-05-10 23:12:22.266014');
INSERT INTO "public"."sensor_data" VALUES (5782, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429545}', '2026-05-10 23:12:25.702608');
INSERT INTO "public"."sensor_data" VALUES (5783, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429550}', '2026-05-10 23:12:30.703475');
INSERT INTO "public"."sensor_data" VALUES (5784, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429554}', '2026-05-10 23:12:34.983514');
INSERT INTO "public"."sensor_data" VALUES (5785, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429555}', '2026-05-10 23:12:35.703424');
INSERT INTO "public"."sensor_data" VALUES (5786, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429560}', '2026-05-10 23:12:40.702707');
INSERT INTO "public"."sensor_data" VALUES (5787, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429560}', '2026-05-10 23:12:41.118863');
INSERT INTO "public"."sensor_data" VALUES (5788, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "38.0°C / 48.7%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778429564}', '2026-05-10 23:12:44.811107');
INSERT INTO "public"."sensor_data" VALUES (5789, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778429564}', '2026-05-10 23:12:45.144422');
INSERT INTO "public"."sensor_data" VALUES (5790, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429565}', '2026-05-10 23:12:45.70301');
INSERT INTO "public"."sensor_data" VALUES (5791, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429570}', '2026-05-10 23:12:50.703519');
INSERT INTO "public"."sensor_data" VALUES (5792, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429575}', '2026-05-10 23:12:55.706466');
INSERT INTO "public"."sensor_data" VALUES (5793, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429578}', '2026-05-10 23:12:59.261897');
INSERT INTO "public"."sensor_data" VALUES (5794, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429580}', '2026-05-10 23:13:00.722771');
INSERT INTO "public"."sensor_data" VALUES (5795, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429585}', '2026-05-10 23:13:05.521215');
INSERT INTO "public"."sensor_data" VALUES (5796, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429585}', '2026-05-10 23:13:05.828592');
INSERT INTO "public"."sensor_data" VALUES (5797, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429590}', '2026-05-10 23:13:10.706447');
INSERT INTO "public"."sensor_data" VALUES (5798, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429590}', '2026-05-10 23:13:11.077936');
INSERT INTO "public"."sensor_data" VALUES (5799, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429595}', '2026-05-10 23:13:15.711345');
INSERT INTO "public"."sensor_data" VALUES (5800, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429600}', '2026-05-10 23:13:20.709548');
INSERT INTO "public"."sensor_data" VALUES (5801, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429602}', '2026-05-10 23:13:22.474965');
INSERT INTO "public"."sensor_data" VALUES (5802, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429605}', '2026-05-10 23:13:25.716488');
INSERT INTO "public"."sensor_data" VALUES (5803, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429610}', '2026-05-10 23:13:30.712727');
INSERT INTO "public"."sensor_data" VALUES (5804, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429615}', '2026-05-10 23:13:35.713097');
INSERT INTO "public"."sensor_data" VALUES (5805, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429619}', '2026-05-10 23:13:39.812606');
INSERT INTO "public"."sensor_data" VALUES (5806, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429620}', '2026-05-10 23:13:40.711282');
INSERT INTO "public"."sensor_data" VALUES (5807, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429625}', '2026-05-10 23:13:45.714765');
INSERT INTO "public"."sensor_data" VALUES (5808, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429625}', '2026-05-10 23:13:46.329712');
INSERT INTO "public"."sensor_data" VALUES (5809, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429630}', '2026-05-10 23:13:50.765323');
INSERT INTO "public"."sensor_data" VALUES (5810, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429634}', '2026-05-10 23:13:54.95429');
INSERT INTO "public"."sensor_data" VALUES (5811, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429635}', '2026-05-10 23:13:55.718998');
INSERT INTO "public"."sensor_data" VALUES (5812, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429640}', '2026-05-10 23:14:00.735317');
INSERT INTO "public"."sensor_data" VALUES (5813, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429641}', '2026-05-10 23:14:01.473749');
INSERT INTO "public"."sensor_data" VALUES (5814, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429645}', '2026-05-10 23:14:05.714757');
INSERT INTO "public"."sensor_data" VALUES (5815, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429647}', '2026-05-10 23:14:07.59164');
INSERT INTO "public"."sensor_data" VALUES (5816, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429650}', '2026-05-10 23:14:10.763472');
INSERT INTO "public"."sensor_data" VALUES (5817, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429652}', '2026-05-10 23:14:13.153548');
INSERT INTO "public"."sensor_data" VALUES (5818, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429655}', '2026-05-10 23:14:15.719211');
INSERT INTO "public"."sensor_data" VALUES (5819, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429660}', '2026-05-10 23:14:20.511897');
INSERT INTO "public"."sensor_data" VALUES (5820, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429660}', '2026-05-10 23:14:20.792008');
INSERT INTO "public"."sensor_data" VALUES (5821, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429665}', '2026-05-10 23:14:25.721191');
INSERT INTO "public"."sensor_data" VALUES (5822, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429670}', '2026-05-10 23:14:30.720546');
INSERT INTO "public"."sensor_data" VALUES (5823, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429670}', '2026-05-10 23:14:31.131817');
INSERT INTO "public"."sensor_data" VALUES (5824, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429675}', '2026-05-10 23:14:35.719535');
INSERT INTO "public"."sensor_data" VALUES (5825, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429680}', '2026-05-10 23:14:40.718992');
INSERT INTO "public"."sensor_data" VALUES (5826, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429684}', '2026-05-10 23:14:44.926286');
INSERT INTO "public"."sensor_data" VALUES (5827, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429685}', '2026-05-10 23:14:45.730688');
INSERT INTO "public"."sensor_data" VALUES (5828, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429690}', '2026-05-10 23:14:50.720985');
INSERT INTO "public"."sensor_data" VALUES (5829, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429690}', '2026-05-10 23:14:51.099286');
INSERT INTO "public"."sensor_data" VALUES (5830, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429695}', '2026-05-10 23:14:55.722828');
INSERT INTO "public"."sensor_data" VALUES (5831, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429700}', '2026-05-10 23:15:00.5123');
INSERT INTO "public"."sensor_data" VALUES (5832, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429700}', '2026-05-10 23:15:00.853581');
INSERT INTO "public"."sensor_data" VALUES (5833, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429705}', '2026-05-10 23:15:05.731747');
INSERT INTO "public"."sensor_data" VALUES (5834, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429705}', '2026-05-10 23:15:06.054437');
INSERT INTO "public"."sensor_data" VALUES (5835, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429710}', '2026-05-10 23:15:10.74069');
INSERT INTO "public"."sensor_data" VALUES (5836, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429711}', '2026-05-10 23:15:11.536564');
INSERT INTO "public"."sensor_data" VALUES (5837, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429715}', '2026-05-10 23:15:15.724703');
INSERT INTO "public"."sensor_data" VALUES (5838, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429718}', '2026-05-10 23:15:18.948336');
INSERT INTO "public"."sensor_data" VALUES (5839, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429720}', '2026-05-10 23:15:20.725852');
INSERT INTO "public"."sensor_data" VALUES (5840, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429725}', '2026-05-10 23:15:25.726183');
INSERT INTO "public"."sensor_data" VALUES (5841, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429730}', '2026-05-10 23:15:30.728973');
INSERT INTO "public"."sensor_data" VALUES (5842, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429735}', '2026-05-10 23:15:35.734072');
INSERT INTO "public"."sensor_data" VALUES (5843, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429740}', '2026-05-10 23:15:40.760441');
INSERT INTO "public"."sensor_data" VALUES (5844, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429745}', '2026-05-10 23:15:45.730294');
INSERT INTO "public"."sensor_data" VALUES (5845, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429750}', '2026-05-10 23:15:50.732383');
INSERT INTO "public"."sensor_data" VALUES (5846, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429755}', '2026-05-10 23:15:55.734417');
INSERT INTO "public"."sensor_data" VALUES (5847, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429760}', '2026-05-10 23:16:00.750146');
INSERT INTO "public"."sensor_data" VALUES (5848, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429765}', '2026-05-10 23:16:05.736349');
INSERT INTO "public"."sensor_data" VALUES (5849, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429770}', '2026-05-10 23:16:10.733621');
INSERT INTO "public"."sensor_data" VALUES (5850, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.4, "timestamp": 1778429770}', '2026-05-10 23:16:11.071573');
INSERT INTO "public"."sensor_data" VALUES (5851, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429772}', '2026-05-10 23:16:12.865317');
INSERT INTO "public"."sensor_data" VALUES (5852, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429775}', '2026-05-10 23:16:15.761506');
INSERT INTO "public"."sensor_data" VALUES (5853, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429778}', '2026-05-10 23:16:18.761435');
INSERT INTO "public"."sensor_data" VALUES (5854, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429780}', '2026-05-10 23:16:20.736576');
INSERT INTO "public"."sensor_data" VALUES (5855, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429785}', '2026-05-10 23:16:25.750731');
INSERT INTO "public"."sensor_data" VALUES (5856, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429790}', '2026-05-10 23:16:30.737579');
INSERT INTO "public"."sensor_data" VALUES (5857, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429795}', '2026-05-10 23:16:35.74002');
INSERT INTO "public"."sensor_data" VALUES (5858, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429800}', '2026-05-10 23:16:40.737929');
INSERT INTO "public"."sensor_data" VALUES (5859, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429805}', '2026-05-10 23:16:45.739054');
INSERT INTO "public"."sensor_data" VALUES (5860, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429810}', '2026-05-10 23:16:50.740152');
INSERT INTO "public"."sensor_data" VALUES (5861, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429815}', '2026-05-10 23:16:55.741067');
INSERT INTO "public"."sensor_data" VALUES (5862, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429820}', '2026-05-10 23:17:00.745092');
INSERT INTO "public"."sensor_data" VALUES (5863, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429825}', '2026-05-10 23:17:05.743894');
INSERT INTO "public"."sensor_data" VALUES (5864, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429830}', '2026-05-10 23:17:10.743115');
INSERT INTO "public"."sensor_data" VALUES (5865, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429835}', '2026-05-10 23:17:15.743456');
INSERT INTO "public"."sensor_data" VALUES (5866, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429840}', '2026-05-10 23:17:20.74305');
INSERT INTO "public"."sensor_data" VALUES (5867, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429845}', '2026-05-10 23:17:25.745929');
INSERT INTO "public"."sensor_data" VALUES (5868, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429850}', '2026-05-10 23:17:30.745667');
INSERT INTO "public"."sensor_data" VALUES (5869, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429855}', '2026-05-10 23:17:35.745614');
INSERT INTO "public"."sensor_data" VALUES (5870, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429860}', '2026-05-10 23:17:40.747865');
INSERT INTO "public"."sensor_data" VALUES (5871, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "36.0°C / 53.9%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778429864}', '2026-05-10 23:17:44.79402');
INSERT INTO "public"."sensor_data" VALUES (5872, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778429864}', '2026-05-10 23:17:45.068129');
INSERT INTO "public"."sensor_data" VALUES (5873, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429865}', '2026-05-10 23:17:45.748898');
INSERT INTO "public"."sensor_data" VALUES (5874, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429870}', '2026-05-10 23:17:50.749731');
INSERT INTO "public"."sensor_data" VALUES (5875, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429875}', '2026-05-10 23:17:55.757065');
INSERT INTO "public"."sensor_data" VALUES (5876, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429880}', '2026-05-10 23:18:00.750824');
INSERT INTO "public"."sensor_data" VALUES (5877, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429885}', '2026-05-10 23:18:05.755021');
INSERT INTO "public"."sensor_data" VALUES (5878, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429890}', '2026-05-10 23:18:10.757408');
INSERT INTO "public"."sensor_data" VALUES (5879, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.4, "timestamp": 1778429890}', '2026-05-10 23:18:11.083982');
INSERT INTO "public"."sensor_data" VALUES (5880, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429895}', '2026-05-10 23:18:15.752758');
INSERT INTO "public"."sensor_data" VALUES (5881, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429900}', '2026-05-10 23:18:20.7563');
INSERT INTO "public"."sensor_data" VALUES (5882, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429905}', '2026-05-10 23:18:25.754521');
INSERT INTO "public"."sensor_data" VALUES (5883, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429910}', '2026-05-10 23:18:30.758229');
INSERT INTO "public"."sensor_data" VALUES (5884, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429915}', '2026-05-10 23:18:35.761482');
INSERT INTO "public"."sensor_data" VALUES (5885, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429920}', '2026-05-10 23:18:40.766479');
INSERT INTO "public"."sensor_data" VALUES (5886, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778429924}', '2026-05-10 23:18:44.947823');
INSERT INTO "public"."sensor_data" VALUES (5887, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429925}', '2026-05-10 23:18:45.757712');
INSERT INTO "public"."sensor_data" VALUES (5888, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429930}', '2026-05-10 23:18:50.757734');
INSERT INTO "public"."sensor_data" VALUES (5889, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429935}', '2026-05-10 23:18:55.758892');
INSERT INTO "public"."sensor_data" VALUES (5890, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429940}', '2026-05-10 23:19:00.760462');
INSERT INTO "public"."sensor_data" VALUES (5891, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429945}', '2026-05-10 23:19:05.760034');
INSERT INTO "public"."sensor_data" VALUES (5892, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429950}', '2026-05-10 23:19:10.761396');
INSERT INTO "public"."sensor_data" VALUES (5893, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429955}', '2026-05-10 23:19:15.765014');
INSERT INTO "public"."sensor_data" VALUES (5894, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429960}', '2026-05-10 23:19:20.76165');
INSERT INTO "public"."sensor_data" VALUES (5895, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429965}', '2026-05-10 23:19:25.762774');
INSERT INTO "public"."sensor_data" VALUES (5896, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429970}', '2026-05-10 23:19:30.763372');
INSERT INTO "public"."sensor_data" VALUES (5897, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429975}', '2026-05-10 23:19:35.767958');
INSERT INTO "public"."sensor_data" VALUES (5898, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429980}', '2026-05-10 23:19:40.772853');
INSERT INTO "public"."sensor_data" VALUES (5899, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429985}', '2026-05-10 23:19:45.799095');
INSERT INTO "public"."sensor_data" VALUES (5900, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429990}', '2026-05-10 23:19:50.772915');
INSERT INTO "public"."sensor_data" VALUES (5901, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778429995}', '2026-05-10 23:19:55.776748');
INSERT INTO "public"."sensor_data" VALUES (5902, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430000}', '2026-05-10 23:20:00.797816');
INSERT INTO "public"."sensor_data" VALUES (5903, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430005}', '2026-05-10 23:20:05.772576');
INSERT INTO "public"."sensor_data" VALUES (5904, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430010}', '2026-05-10 23:20:10.77855');
INSERT INTO "public"."sensor_data" VALUES (5905, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430011}', '2026-05-10 23:20:12.329623');
INSERT INTO "public"."sensor_data" VALUES (5906, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430015}', '2026-05-10 23:20:15.782693');
INSERT INTO "public"."sensor_data" VALUES (5907, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430020}', '2026-05-10 23:20:20.774015');
INSERT INTO "public"."sensor_data" VALUES (5908, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430025}', '2026-05-10 23:20:25.778072');
INSERT INTO "public"."sensor_data" VALUES (5909, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430030}', '2026-05-10 23:20:30.772725');
INSERT INTO "public"."sensor_data" VALUES (5910, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430035}', '2026-05-10 23:20:35.776612');
INSERT INTO "public"."sensor_data" VALUES (5911, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430040}', '2026-05-10 23:20:40.781663');
INSERT INTO "public"."sensor_data" VALUES (5912, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430041}', '2026-05-10 23:20:41.68808');
INSERT INTO "public"."sensor_data" VALUES (5913, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430045}', '2026-05-10 23:20:45.77563');
INSERT INTO "public"."sensor_data" VALUES (5914, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430050}', '2026-05-10 23:20:50.777927');
INSERT INTO "public"."sensor_data" VALUES (5915, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430055}', '2026-05-10 23:20:55.786108');
INSERT INTO "public"."sensor_data" VALUES (5916, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430058}', '2026-05-10 23:20:58.94349');
INSERT INTO "public"."sensor_data" VALUES (5917, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430060}', '2026-05-10 23:21:00.777796');
INSERT INTO "public"."sensor_data" VALUES (5918, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430065}', '2026-05-10 23:21:05.78068');
INSERT INTO "public"."sensor_data" VALUES (5919, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430070}', '2026-05-10 23:21:10.794416');
INSERT INTO "public"."sensor_data" VALUES (5920, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430075}', '2026-05-10 23:21:15.783829');
INSERT INTO "public"."sensor_data" VALUES (5921, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430080}', '2026-05-10 23:21:20.780364');
INSERT INTO "public"."sensor_data" VALUES (5922, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430084}', '2026-05-10 23:21:24.945189');
INSERT INTO "public"."sensor_data" VALUES (5923, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430085}', '2026-05-10 23:21:25.782073');
INSERT INTO "public"."sensor_data" VALUES (5924, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430090}', '2026-05-10 23:21:30.783993');
INSERT INTO "public"."sensor_data" VALUES (5925, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430094}', '2026-05-10 23:21:35.063514');
INSERT INTO "public"."sensor_data" VALUES (5926, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430095}', '2026-05-10 23:21:35.782986');
INSERT INTO "public"."sensor_data" VALUES (5927, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430100}', '2026-05-10 23:21:40.788558');
INSERT INTO "public"."sensor_data" VALUES (5928, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430105}', '2026-05-10 23:21:45.7917');
INSERT INTO "public"."sensor_data" VALUES (5929, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430110}', '2026-05-10 23:21:50.785372');
INSERT INTO "public"."sensor_data" VALUES (5930, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430115}', '2026-05-10 23:21:55.788154');
INSERT INTO "public"."sensor_data" VALUES (5931, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430120}', '2026-05-10 23:22:00.786331');
INSERT INTO "public"."sensor_data" VALUES (5932, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430125}', '2026-05-10 23:22:05.790124');
INSERT INTO "public"."sensor_data" VALUES (5933, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430127}', '2026-05-10 23:22:07.681669');
INSERT INTO "public"."sensor_data" VALUES (5934, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430130}', '2026-05-10 23:22:10.790606');
INSERT INTO "public"."sensor_data" VALUES (5935, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430135}', '2026-05-10 23:22:15.552932');
INSERT INTO "public"."sensor_data" VALUES (5936, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430135}', '2026-05-10 23:22:15.814059');
INSERT INTO "public"."sensor_data" VALUES (5937, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430140}', '2026-05-10 23:22:20.825777');
INSERT INTO "public"."sensor_data" VALUES (5938, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430142}', '2026-05-10 23:22:22.996189');
INSERT INTO "public"."sensor_data" VALUES (5939, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430145}', '2026-05-10 23:22:25.79067');
INSERT INTO "public"."sensor_data" VALUES (5940, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430150}', '2026-05-10 23:22:30.789535');
INSERT INTO "public"."sensor_data" VALUES (5941, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430155}', '2026-05-10 23:22:35.793675');
INSERT INTO "public"."sensor_data" VALUES (5942, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430160}', '2026-05-10 23:22:40.793857');
INSERT INTO "public"."sensor_data" VALUES (5943, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "36.4°C / 53.0%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778430164}', '2026-05-10 23:22:44.793321');
INSERT INTO "public"."sensor_data" VALUES (5944, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778430164}', '2026-05-10 23:22:45.104152');
INSERT INTO "public"."sensor_data" VALUES (5945, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430165}', '2026-05-10 23:22:48.36572');
INSERT INTO "public"."sensor_data" VALUES (5946, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430170}', '2026-05-10 23:22:50.79429');
INSERT INTO "public"."sensor_data" VALUES (5947, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430174}', '2026-05-10 23:22:54.650907');
INSERT INTO "public"."sensor_data" VALUES (5948, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430175}', '2026-05-10 23:22:55.797262');
INSERT INTO "public"."sensor_data" VALUES (5949, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430180}', '2026-05-10 23:23:00.794577');
INSERT INTO "public"."sensor_data" VALUES (5950, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430185}', '2026-05-10 23:23:05.79757');
INSERT INTO "public"."sensor_data" VALUES (5951, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430190}', '2026-05-10 23:23:10.803298');
INSERT INTO "public"."sensor_data" VALUES (5952, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430195}', '2026-05-10 23:23:15.801243');
INSERT INTO "public"."sensor_data" VALUES (5953, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430196}', '2026-05-10 23:23:16.755779');
INSERT INTO "public"."sensor_data" VALUES (5954, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430200}', '2026-05-10 23:23:20.804389');
INSERT INTO "public"."sensor_data" VALUES (5955, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430205}', '2026-05-10 23:23:25.801185');
INSERT INTO "public"."sensor_data" VALUES (5956, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430210}', '2026-05-10 23:23:30.803102');
INSERT INTO "public"."sensor_data" VALUES (5957, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430215}', '2026-05-10 23:23:35.801133');
INSERT INTO "public"."sensor_data" VALUES (5958, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430220}', '2026-05-10 23:23:40.807526');
INSERT INTO "public"."sensor_data" VALUES (5959, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430225}', '2026-05-10 23:23:45.804161');
INSERT INTO "public"."sensor_data" VALUES (5960, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430230}', '2026-05-10 23:23:50.809038');
INSERT INTO "public"."sensor_data" VALUES (5961, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430235}', '2026-05-10 23:23:55.805738');
INSERT INTO "public"."sensor_data" VALUES (5962, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430240}', '2026-05-10 23:24:00.821789');
INSERT INTO "public"."sensor_data" VALUES (5963, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430245}', '2026-05-10 23:24:05.809185');
INSERT INTO "public"."sensor_data" VALUES (5964, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430250}', '2026-05-10 23:24:10.810146');
INSERT INTO "public"."sensor_data" VALUES (5965, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430255}', '2026-05-10 23:24:15.818725');
INSERT INTO "public"."sensor_data" VALUES (5966, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430260}', '2026-05-10 23:24:20.81465');
INSERT INTO "public"."sensor_data" VALUES (5967, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430265}', '2026-05-10 23:24:25.808834');
INSERT INTO "public"."sensor_data" VALUES (5968, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430270}', '2026-05-10 23:24:30.808956');
INSERT INTO "public"."sensor_data" VALUES (5969, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430273}', '2026-05-10 23:24:33.539634');
INSERT INTO "public"."sensor_data" VALUES (5970, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430275}', '2026-05-10 23:24:35.809542');
INSERT INTO "public"."sensor_data" VALUES (5971, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430280}', '2026-05-10 23:24:40.813662');
INSERT INTO "public"."sensor_data" VALUES (5972, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430285}', '2026-05-10 23:24:45.863814');
INSERT INTO "public"."sensor_data" VALUES (5973, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430290}', '2026-05-10 23:24:50.827909');
INSERT INTO "public"."sensor_data" VALUES (5974, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430295}', '2026-05-10 23:24:55.813541');
INSERT INTO "public"."sensor_data" VALUES (5975, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430300}', '2026-05-10 23:25:00.813213');
INSERT INTO "public"."sensor_data" VALUES (5976, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430302}', '2026-05-10 23:25:03.215239');
INSERT INTO "public"."sensor_data" VALUES (5977, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430305}', '2026-05-10 23:25:05.815912');
INSERT INTO "public"."sensor_data" VALUES (5978, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430310}', '2026-05-10 23:25:10.815185');
INSERT INTO "public"."sensor_data" VALUES (5979, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430315}', '2026-05-10 23:25:15.847346');
INSERT INTO "public"."sensor_data" VALUES (5980, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430320}', '2026-05-10 23:25:20.835096');
INSERT INTO "public"."sensor_data" VALUES (5981, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430325}', '2026-05-10 23:25:25.817468');
INSERT INTO "public"."sensor_data" VALUES (5982, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430330}', '2026-05-10 23:25:30.817676');
INSERT INTO "public"."sensor_data" VALUES (5983, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430335}', '2026-05-10 23:25:35.818606');
INSERT INTO "public"."sensor_data" VALUES (5984, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430340}', '2026-05-10 23:25:40.825132');
INSERT INTO "public"."sensor_data" VALUES (5985, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430345}', '2026-05-10 23:25:45.825696');
INSERT INTO "public"."sensor_data" VALUES (5986, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430350}', '2026-05-10 23:25:50.826414');
INSERT INTO "public"."sensor_data" VALUES (5987, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430355}', '2026-05-10 23:25:55.821776');
INSERT INTO "public"."sensor_data" VALUES (5988, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430356}', '2026-05-10 23:25:56.871305');
INSERT INTO "public"."sensor_data" VALUES (5989, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430360}', '2026-05-10 23:26:00.824554');
INSERT INTO "public"."sensor_data" VALUES (5990, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430365}', '2026-05-10 23:26:05.890805');
INSERT INTO "public"."sensor_data" VALUES (5991, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430370}', '2026-05-10 23:26:10.835027');
INSERT INTO "public"."sensor_data" VALUES (5992, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430375}', '2026-05-10 23:26:15.830975');
INSERT INTO "public"."sensor_data" VALUES (5993, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430378}', '2026-05-10 23:26:18.748907');
INSERT INTO "public"."sensor_data" VALUES (5994, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430380}', '2026-05-10 23:26:20.829189');
INSERT INTO "public"."sensor_data" VALUES (5995, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430385}', '2026-05-10 23:26:25.827187');
INSERT INTO "public"."sensor_data" VALUES (5996, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430390}', '2026-05-10 23:26:30.826578');
INSERT INTO "public"."sensor_data" VALUES (5997, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430395}', '2026-05-10 23:26:35.82769');
INSERT INTO "public"."sensor_data" VALUES (5998, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430400}', '2026-05-10 23:26:40.831658');
INSERT INTO "public"."sensor_data" VALUES (5999, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430404}', '2026-05-10 23:26:44.779111');
INSERT INTO "public"."sensor_data" VALUES (6000, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430405}', '2026-05-10 23:26:45.841404');
INSERT INTO "public"."sensor_data" VALUES (6001, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430410}', '2026-05-10 23:26:50.838743');
INSERT INTO "public"."sensor_data" VALUES (6002, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430415}', '2026-05-10 23:26:55.838514');
INSERT INTO "public"."sensor_data" VALUES (6003, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430420}', '2026-05-10 23:27:00.83598');
INSERT INTO "public"."sensor_data" VALUES (6004, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430421}', '2026-05-10 23:27:01.667041');
INSERT INTO "public"."sensor_data" VALUES (6005, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430425}', '2026-05-10 23:27:05.832251');
INSERT INTO "public"."sensor_data" VALUES (6006, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430430}', '2026-05-10 23:27:10.836194');
INSERT INTO "public"."sensor_data" VALUES (6007, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430435}', '2026-05-10 23:27:15.837324');
INSERT INTO "public"."sensor_data" VALUES (6008, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430440}', '2026-05-10 23:27:20.842546');
INSERT INTO "public"."sensor_data" VALUES (6009, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430444}', '2026-05-10 23:27:24.859647');
INSERT INTO "public"."sensor_data" VALUES (6010, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430445}', '2026-05-10 23:27:25.841627');
INSERT INTO "public"."sensor_data" VALUES (6011, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430449}', '2026-05-10 23:27:30.112061');
INSERT INTO "public"."sensor_data" VALUES (6012, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430450}', '2026-05-10 23:27:30.837009');
INSERT INTO "public"."sensor_data" VALUES (6013, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430455}', '2026-05-10 23:27:35.839969');
INSERT INTO "public"."sensor_data" VALUES (6014, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430460}', '2026-05-10 23:27:40.838106');
INSERT INTO "public"."sensor_data" VALUES (6015, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430462}', '2026-05-10 23:27:43.336631');
INSERT INTO "public"."sensor_data" VALUES (6016, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.5°C / 54.9%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778430464}', '2026-05-10 23:27:44.771536');
INSERT INTO "public"."sensor_data" VALUES (6017, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778430464}', '2026-05-10 23:27:45.03052');
INSERT INTO "public"."sensor_data" VALUES (6018, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "33 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430465}', '2026-05-10 23:27:45.85174');
INSERT INTO "public"."sensor_data" VALUES (6019, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430470}', '2026-05-10 23:27:50.844153');
INSERT INTO "public"."sensor_data" VALUES (6020, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430472}', '2026-05-10 23:27:53.125651');
INSERT INTO "public"."sensor_data" VALUES (6021, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430475}', '2026-05-10 23:27:55.865013');
INSERT INTO "public"."sensor_data" VALUES (6022, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430480}', '2026-05-10 23:28:00.847274');
INSERT INTO "public"."sensor_data" VALUES (6023, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430485}', '2026-05-10 23:28:05.841372');
INSERT INTO "public"."sensor_data" VALUES (6024, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430490}', '2026-05-10 23:28:10.84053');
INSERT INTO "public"."sensor_data" VALUES (6025, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430495}', '2026-05-10 23:28:15.852455');
INSERT INTO "public"."sensor_data" VALUES (6026, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430500}', '2026-05-10 23:28:20.847102');
INSERT INTO "public"."sensor_data" VALUES (6027, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430504}', '2026-05-10 23:28:24.620929');
INSERT INTO "public"."sensor_data" VALUES (6028, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430505}', '2026-05-10 23:28:25.887569');
INSERT INTO "public"."sensor_data" VALUES (6029, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430510}', '2026-05-10 23:28:30.844083');
INSERT INTO "public"."sensor_data" VALUES (6030, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430515}', '2026-05-10 23:28:35.846564');
INSERT INTO "public"."sensor_data" VALUES (6031, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430520}', '2026-05-10 23:28:40.848573');
INSERT INTO "public"."sensor_data" VALUES (6032, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430525}', '2026-05-10 23:28:45.849728');
INSERT INTO "public"."sensor_data" VALUES (6033, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430530}', '2026-05-10 23:28:50.849129');
INSERT INTO "public"."sensor_data" VALUES (6034, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430535}', '2026-05-10 23:28:55.847444');
INSERT INTO "public"."sensor_data" VALUES (6035, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430540}', '2026-05-10 23:29:00.847029');
INSERT INTO "public"."sensor_data" VALUES (6036, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430545}', '2026-05-10 23:29:05.847348');
INSERT INTO "public"."sensor_data" VALUES (6037, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430550}', '2026-05-10 23:29:10.847863');
INSERT INTO "public"."sensor_data" VALUES (6038, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430555}', '2026-05-10 23:29:15.84916');
INSERT INTO "public"."sensor_data" VALUES (6039, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430560}', '2026-05-10 23:29:20.858433');
INSERT INTO "public"."sensor_data" VALUES (6040, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430560}', '2026-05-10 23:29:21.171414');
INSERT INTO "public"."sensor_data" VALUES (6041, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430565}', '2026-05-10 23:29:25.851645');
INSERT INTO "public"."sensor_data" VALUES (6042, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430570}', '2026-05-10 23:29:30.852039');
INSERT INTO "public"."sensor_data" VALUES (6043, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430573}', '2026-05-10 23:29:33.409296');
INSERT INTO "public"."sensor_data" VALUES (6044, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430575}', '2026-05-10 23:29:35.852343');
INSERT INTO "public"."sensor_data" VALUES (6045, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430580}', '2026-05-10 23:29:40.853371');
INSERT INTO "public"."sensor_data" VALUES (6046, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430585}', '2026-05-10 23:29:45.853991');
INSERT INTO "public"."sensor_data" VALUES (6047, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430590}', '2026-05-10 23:29:50.854362');
INSERT INTO "public"."sensor_data" VALUES (6048, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430595}', '2026-05-10 23:29:55.85514');
INSERT INTO "public"."sensor_data" VALUES (6049, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430600}', '2026-05-10 23:30:00.881049');
INSERT INTO "public"."sensor_data" VALUES (6050, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430605}', '2026-05-10 23:30:05.855991');
INSERT INTO "public"."sensor_data" VALUES (6051, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430610}', '2026-05-10 23:30:10.858354');
INSERT INTO "public"."sensor_data" VALUES (6052, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430615}', '2026-05-10 23:30:15.858377');
INSERT INTO "public"."sensor_data" VALUES (6053, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430620}', '2026-05-10 23:30:20.862215');
INSERT INTO "public"."sensor_data" VALUES (6054, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430625}', '2026-05-10 23:30:25.859607');
INSERT INTO "public"."sensor_data" VALUES (6055, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430630}', '2026-05-10 23:30:30.863957');
INSERT INTO "public"."sensor_data" VALUES (6056, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430635}', '2026-05-10 23:30:35.447336');
INSERT INTO "public"."sensor_data" VALUES (6057, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430635}', '2026-05-10 23:30:35.860244');
INSERT INTO "public"."sensor_data" VALUES (6058, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430640}', '2026-05-10 23:30:40.86422');
INSERT INTO "public"."sensor_data" VALUES (6059, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430645}', '2026-05-10 23:30:45.86342');
INSERT INTO "public"."sensor_data" VALUES (6060, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430650}', '2026-05-10 23:30:50.867419');
INSERT INTO "public"."sensor_data" VALUES (6061, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430655}', '2026-05-10 23:30:55.863883');
INSERT INTO "public"."sensor_data" VALUES (6062, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430660}', '2026-05-10 23:31:00.864541');
INSERT INTO "public"."sensor_data" VALUES (6063, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430665}', '2026-05-10 23:31:05.86565');
INSERT INTO "public"."sensor_data" VALUES (6064, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430670}', '2026-05-10 23:31:10.866491');
INSERT INTO "public"."sensor_data" VALUES (6065, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430675}', '2026-05-10 23:31:15.866634');
INSERT INTO "public"."sensor_data" VALUES (6066, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430680}', '2026-05-10 23:31:20.89209');
INSERT INTO "public"."sensor_data" VALUES (6067, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430685}', '2026-05-10 23:31:25.868244');
INSERT INTO "public"."sensor_data" VALUES (6068, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430690}', '2026-05-10 23:31:30.870078');
INSERT INTO "public"."sensor_data" VALUES (6069, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430695}', '2026-05-10 23:31:35.876');
INSERT INTO "public"."sensor_data" VALUES (6070, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430700}', '2026-05-10 23:31:40.883791');
INSERT INTO "public"."sensor_data" VALUES (6071, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430705}', '2026-05-10 23:31:45.871415');
INSERT INTO "public"."sensor_data" VALUES (6072, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430710}', '2026-05-10 23:31:50.873739');
INSERT INTO "public"."sensor_data" VALUES (6073, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430715}', '2026-05-10 23:31:55.874816');
INSERT INTO "public"."sensor_data" VALUES (6074, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430720}', '2026-05-10 23:32:00.877941');
INSERT INTO "public"."sensor_data" VALUES (6075, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430725}', '2026-05-10 23:32:05.874331');
INSERT INTO "public"."sensor_data" VALUES (6076, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430730}', '2026-05-10 23:32:10.874776');
INSERT INTO "public"."sensor_data" VALUES (6077, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430735}', '2026-05-10 23:32:15.876522');
INSERT INTO "public"."sensor_data" VALUES (6078, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430740}', '2026-05-10 23:32:20.876749');
INSERT INTO "public"."sensor_data" VALUES (6079, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430745}', '2026-05-10 23:32:25.877874');
INSERT INTO "public"."sensor_data" VALUES (6080, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778430746}', '2026-05-10 23:32:27.227313');
INSERT INTO "public"."sensor_data" VALUES (6081, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430750}', '2026-05-10 23:32:30.876318');
INSERT INTO "public"."sensor_data" VALUES (6082, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430755}', '2026-05-10 23:32:35.877271');
INSERT INTO "public"."sensor_data" VALUES (6083, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430760}', '2026-05-10 23:32:40.878617');
INSERT INTO "public"."sensor_data" VALUES (6084, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.2, "timestamp": 1778430761}', '2026-05-10 23:32:41.812166');
INSERT INTO "public"."sensor_data" VALUES (6085, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "35.9°C / 54.3%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778430764}', '2026-05-10 23:32:44.747432');
INSERT INTO "public"."sensor_data" VALUES (6086, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778430764}', '2026-05-10 23:32:45.043898');
INSERT INTO "public"."sensor_data" VALUES (6087, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778430765}', '2026-05-10 23:32:45.879437');
INSERT INTO "public"."sensor_data" VALUES (6088, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437338}', '2026-05-11 01:22:19.929839');
INSERT INTO "public"."sensor_data" VALUES (6089, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437338}', '2026-05-11 01:22:19.992935');
INSERT INTO "public"."sensor_data" VALUES (6090, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "32.8°C / 60.6%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778437338}', '2026-05-11 01:22:19.997449');
INSERT INTO "public"."sensor_data" VALUES (6091, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778437338}', '2026-05-11 01:22:20.001447');
INSERT INTO "public"."sensor_data" VALUES (6092, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437343}', '2026-05-11 01:22:23.944538');
INSERT INTO "public"."sensor_data" VALUES (6093, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437344}', '2026-05-11 01:22:25.119083');
INSERT INTO "public"."sensor_data" VALUES (6094, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437348}', '2026-05-11 01:22:28.943012');
INSERT INTO "public"."sensor_data" VALUES (6095, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437353}', '2026-05-11 01:22:33.946191');
INSERT INTO "public"."sensor_data" VALUES (6096, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437355}', '2026-05-11 01:22:35.519309');
INSERT INTO "public"."sensor_data" VALUES (6097, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437358}', '2026-05-11 01:22:38.944615');
INSERT INTO "public"."sensor_data" VALUES (6098, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437363}', '2026-05-11 01:22:43.944259');
INSERT INTO "public"."sensor_data" VALUES (6099, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437368}', '2026-05-11 01:22:48.95225');
INSERT INTO "public"."sensor_data" VALUES (6100, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437373}', '2026-05-11 01:22:53.947053');
INSERT INTO "public"."sensor_data" VALUES (6101, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437378}', '2026-05-11 01:22:58.948628');
INSERT INTO "public"."sensor_data" VALUES (6102, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437383}', '2026-05-11 01:23:03.949361');
INSERT INTO "public"."sensor_data" VALUES (6103, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437388}', '2026-05-11 01:23:08.949393');
INSERT INTO "public"."sensor_data" VALUES (6104, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437393}', '2026-05-11 01:23:13.950238');
INSERT INTO "public"."sensor_data" VALUES (6105, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437398}', '2026-05-11 01:23:18.95325');
INSERT INTO "public"."sensor_data" VALUES (6106, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437401}', '2026-05-11 01:23:21.608537');
INSERT INTO "public"."sensor_data" VALUES (6107, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437403}', '2026-05-11 01:23:23.951256');
INSERT INTO "public"."sensor_data" VALUES (6108, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437408}', '2026-05-11 01:23:28.954672');
INSERT INTO "public"."sensor_data" VALUES (6109, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437413}', '2026-05-11 01:23:33.53192');
INSERT INTO "public"."sensor_data" VALUES (6110, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437413}', '2026-05-11 01:23:33.952191');
INSERT INTO "public"."sensor_data" VALUES (6111, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437418}', '2026-05-11 01:23:38.953764');
INSERT INTO "public"."sensor_data" VALUES (6112, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437423}', '2026-05-11 01:23:43.426022');
INSERT INTO "public"."sensor_data" VALUES (6113, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437423}', '2026-05-11 01:23:43.953546');
INSERT INTO "public"."sensor_data" VALUES (6114, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437428}', '2026-05-11 01:23:48.954416');
INSERT INTO "public"."sensor_data" VALUES (6115, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437433}', '2026-05-11 01:23:53.926076');
INSERT INTO "public"."sensor_data" VALUES (6116, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437433}', '2026-05-11 01:23:54.245081');
INSERT INTO "public"."sensor_data" VALUES (6117, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437438}', '2026-05-11 01:23:58.973351');
INSERT INTO "public"."sensor_data" VALUES (6118, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437439}', '2026-05-11 01:24:00.37957');
INSERT INTO "public"."sensor_data" VALUES (6119, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437443}', '2026-05-11 01:24:03.974687');
INSERT INTO "public"."sensor_data" VALUES (6120, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437446}', '2026-05-11 01:24:07.072799');
INSERT INTO "public"."sensor_data" VALUES (6121, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437448}', '2026-05-11 01:24:08.975199');
INSERT INTO "public"."sensor_data" VALUES (6122, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437453}', '2026-05-11 01:24:13.977431');
INSERT INTO "public"."sensor_data" VALUES (6123, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437457}', '2026-05-11 01:24:17.534735');
INSERT INTO "public"."sensor_data" VALUES (6124, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437458}', '2026-05-11 01:24:18.977608');
INSERT INTO "public"."sensor_data" VALUES (6125, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437462}', '2026-05-11 01:24:22.974051');
INSERT INTO "public"."sensor_data" VALUES (6126, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437463}', '2026-05-11 01:24:23.980381');
INSERT INTO "public"."sensor_data" VALUES (6127, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437468}', '2026-05-11 01:24:28.980023');
INSERT INTO "public"."sensor_data" VALUES (6128, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437473}', '2026-05-11 01:24:33.980792');
INSERT INTO "public"."sensor_data" VALUES (6129, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437475}', '2026-05-11 01:24:35.839743');
INSERT INTO "public"."sensor_data" VALUES (6130, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437478}', '2026-05-11 01:24:38.980259');
INSERT INTO "public"."sensor_data" VALUES (6131, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437483}', '2026-05-11 01:24:43.980683');
INSERT INTO "public"."sensor_data" VALUES (6132, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437484}', '2026-05-11 01:24:44.7064');
INSERT INTO "public"."sensor_data" VALUES (6133, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437488}', '2026-05-11 01:24:48.981771');
INSERT INTO "public"."sensor_data" VALUES (6134, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437490}', '2026-05-11 01:24:50.935463');
INSERT INTO "public"."sensor_data" VALUES (6135, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437493}', '2026-05-11 01:24:53.982824');
INSERT INTO "public"."sensor_data" VALUES (6136, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437496}', '2026-05-11 01:24:56.899232');
INSERT INTO "public"."sensor_data" VALUES (6137, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437498}', '2026-05-11 01:24:58.983217');
INSERT INTO "public"."sensor_data" VALUES (6138, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437503}', '2026-05-11 01:25:03.983919');
INSERT INTO "public"."sensor_data" VALUES (6139, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437505}', '2026-05-11 01:25:05.887335');
INSERT INTO "public"."sensor_data" VALUES (6140, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437508}', '2026-05-11 01:25:08.985264');
INSERT INTO "public"."sensor_data" VALUES (6141, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437512}', '2026-05-11 01:25:12.451196');
INSERT INTO "public"."sensor_data" VALUES (6142, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437513}', '2026-05-11 01:25:13.984611');
INSERT INTO "public"."sensor_data" VALUES (6143, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437517}', '2026-05-11 01:25:17.850565');
INSERT INTO "public"."sensor_data" VALUES (6144, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437518}', '2026-05-11 01:25:18.989286');
INSERT INTO "public"."sensor_data" VALUES (6145, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437523}', '2026-05-11 01:25:23.986309');
INSERT INTO "public"."sensor_data" VALUES (6146, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437523}', '2026-05-11 01:25:24.361175');
INSERT INTO "public"."sensor_data" VALUES (6147, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437528}', '2026-05-11 01:25:28.986646');
INSERT INTO "public"."sensor_data" VALUES (6148, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437530}', '2026-05-11 01:25:30.40047');
INSERT INTO "public"."sensor_data" VALUES (6149, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437533}', '2026-05-11 01:25:33.988848');
INSERT INTO "public"."sensor_data" VALUES (6150, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437538}', '2026-05-11 01:25:38.990646');
INSERT INTO "public"."sensor_data" VALUES (6151, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437541}', '2026-05-11 01:25:41.790711');
INSERT INTO "public"."sensor_data" VALUES (6152, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437543}', '2026-05-11 01:25:43.989976');
INSERT INTO "public"."sensor_data" VALUES (6153, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437548}', '2026-05-11 01:25:48.992297');
INSERT INTO "public"."sensor_data" VALUES (6154, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437551}', '2026-05-11 01:25:51.864007');
INSERT INTO "public"."sensor_data" VALUES (6155, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437553}', '2026-05-11 01:25:53.990726');
INSERT INTO "public"."sensor_data" VALUES (6156, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437558}', '2026-05-11 01:25:58.992715');
INSERT INTO "public"."sensor_data" VALUES (6157, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437563}', '2026-05-11 01:26:03.991619');
INSERT INTO "public"."sensor_data" VALUES (6158, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437564}', '2026-05-11 01:26:05.170678');
INSERT INTO "public"."sensor_data" VALUES (6159, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437568}', '2026-05-11 01:26:08.996948');
INSERT INTO "public"."sensor_data" VALUES (6160, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437573}', '2026-05-11 01:26:13.994613');
INSERT INTO "public"."sensor_data" VALUES (6161, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437576}', '2026-05-11 01:26:17.028933');
INSERT INTO "public"."sensor_data" VALUES (6162, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437578}', '2026-05-11 01:26:18.995521');
INSERT INTO "public"."sensor_data" VALUES (6163, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437582}', '2026-05-11 01:26:22.318391');
INSERT INTO "public"."sensor_data" VALUES (6164, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437583}', '2026-05-11 01:26:23.995042');
INSERT INTO "public"."sensor_data" VALUES (6165, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437588}', '2026-05-11 01:26:28.995757');
INSERT INTO "public"."sensor_data" VALUES (6166, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437588}', '2026-05-11 01:26:29.278077');
INSERT INTO "public"."sensor_data" VALUES (6167, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437593}', '2026-05-11 01:26:33.996638');
INSERT INTO "public"."sensor_data" VALUES (6168, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437596}', '2026-05-11 01:26:36.518064');
INSERT INTO "public"."sensor_data" VALUES (6169, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437598}', '2026-05-11 01:26:39.210602');
INSERT INTO "public"."sensor_data" VALUES (6170, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437603}', '2026-05-11 01:26:43.998014');
INSERT INTO "public"."sensor_data" VALUES (6171, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437605}', '2026-05-11 01:26:45.765799');
INSERT INTO "public"."sensor_data" VALUES (6172, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437608}', '2026-05-11 01:26:48.998293');
INSERT INTO "public"."sensor_data" VALUES (6173, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437610}', '2026-05-11 01:26:51.290254');
INSERT INTO "public"."sensor_data" VALUES (6174, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437613}', '2026-05-11 01:26:54.033698');
INSERT INTO "public"."sensor_data" VALUES (6175, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437618}', '2026-05-11 01:26:59.003924');
INSERT INTO "public"."sensor_data" VALUES (6176, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437618}', '2026-05-11 01:26:59.381329');
INSERT INTO "public"."sensor_data" VALUES (6177, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437623}', '2026-05-11 01:27:04.000485');
INSERT INTO "public"."sensor_data" VALUES (6178, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437624}', '2026-05-11 01:27:04.410937');
INSERT INTO "public"."sensor_data" VALUES (6179, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437628}', '2026-05-11 01:27:09.007645');
INSERT INTO "public"."sensor_data" VALUES (6180, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437630}', '2026-05-11 01:27:10.334062');
INSERT INTO "public"."sensor_data" VALUES (6181, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437633}', '2026-05-11 01:27:14.002364');
INSERT INTO "public"."sensor_data" VALUES (6182, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "36.4°C / 51.1%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778437638}', '2026-05-11 01:27:18.912612');
INSERT INTO "public"."sensor_data" VALUES (6183, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778437638}', '2026-05-11 01:27:19.248557');
INSERT INTO "public"."sensor_data" VALUES (6184, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "31 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437638}', '2026-05-11 01:27:19.251524');
INSERT INTO "public"."sensor_data" VALUES (6185, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437639}', '2026-05-11 01:27:19.715649');
INSERT INTO "public"."sensor_data" VALUES (6186, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437643}', '2026-05-11 01:27:24.004452');
INSERT INTO "public"."sensor_data" VALUES (6187, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437647}', '2026-05-11 01:27:27.792416');
INSERT INTO "public"."sensor_data" VALUES (6188, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437648}', '2026-05-11 01:27:29.007062');
INSERT INTO "public"."sensor_data" VALUES (6189, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437653}', '2026-05-11 01:27:34.006701');
INSERT INTO "public"."sensor_data" VALUES (6190, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437653}', '2026-05-11 01:27:34.299624');
INSERT INTO "public"."sensor_data" VALUES (6191, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437658}', '2026-05-11 01:27:39.006647');
INSERT INTO "public"."sensor_data" VALUES (6192, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437659}', '2026-05-11 01:27:39.763473');
INSERT INTO "public"."sensor_data" VALUES (6193, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437663}', '2026-05-11 01:27:44.00644');
INSERT INTO "public"."sensor_data" VALUES (6194, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437664}', '2026-05-11 01:27:45.05141');
INSERT INTO "public"."sensor_data" VALUES (6195, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437668}', '2026-05-11 01:27:49.007858');
INSERT INTO "public"."sensor_data" VALUES (6196, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437670}', '2026-05-11 01:27:50.415642');
INSERT INTO "public"."sensor_data" VALUES (6197, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437673}', '2026-05-11 01:27:54.008146');
INSERT INTO "public"."sensor_data" VALUES (6198, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437676}', '2026-05-11 01:27:56.868348');
INSERT INTO "public"."sensor_data" VALUES (6199, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437678}', '2026-05-11 01:27:59.009635');
INSERT INTO "public"."sensor_data" VALUES (6200, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437682}', '2026-05-11 01:28:02.744005');
INSERT INTO "public"."sensor_data" VALUES (6201, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437683}', '2026-05-11 01:28:04.009668');
INSERT INTO "public"."sensor_data" VALUES (6202, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437687}', '2026-05-11 01:28:08.15063');
INSERT INTO "public"."sensor_data" VALUES (6203, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437688}', '2026-05-11 01:28:09.012524');
INSERT INTO "public"."sensor_data" VALUES (6204, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437693}', '2026-05-11 01:28:13.756662');
INSERT INTO "public"."sensor_data" VALUES (6205, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437693}', '2026-05-11 01:28:14.132462');
INSERT INTO "public"."sensor_data" VALUES (6206, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437698}', '2026-05-11 01:28:19.012355');
INSERT INTO "public"."sensor_data" VALUES (6207, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437703}', '2026-05-11 01:28:24.012732');
INSERT INTO "public"."sensor_data" VALUES (6208, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437704}', '2026-05-11 01:28:24.515261');
INSERT INTO "public"."sensor_data" VALUES (6209, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437708}', '2026-05-11 01:28:29.013756');
INSERT INTO "public"."sensor_data" VALUES (6210, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437709}', '2026-05-11 01:28:29.987015');
INSERT INTO "public"."sensor_data" VALUES (6211, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437713}', '2026-05-11 01:28:34.016252');
INSERT INTO "public"."sensor_data" VALUES (6212, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437717}', '2026-05-11 01:28:38.025236');
INSERT INTO "public"."sensor_data" VALUES (6213, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437718}', '2026-05-11 01:28:39.017155');
INSERT INTO "public"."sensor_data" VALUES (6214, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437723}', '2026-05-11 01:28:43.327937');
INSERT INTO "public"."sensor_data" VALUES (6215, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437723}', '2026-05-11 01:28:44.018427');
INSERT INTO "public"."sensor_data" VALUES (6216, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437728}', '2026-05-11 01:28:49.01846');
INSERT INTO "public"."sensor_data" VALUES (6217, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437731}', '2026-05-11 01:28:51.486088');
INSERT INTO "public"."sensor_data" VALUES (6218, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437733}', '2026-05-11 01:28:54.021457');
INSERT INTO "public"."sensor_data" VALUES (6219, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437738}', '2026-05-11 01:28:58.402432');
INSERT INTO "public"."sensor_data" VALUES (6220, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437738}', '2026-05-11 01:28:59.019396');
INSERT INTO "public"."sensor_data" VALUES (6221, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437743}', '2026-05-11 01:29:03.798134');
INSERT INTO "public"."sensor_data" VALUES (6222, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437743}', '2026-05-11 01:29:04.105792');
INSERT INTO "public"."sensor_data" VALUES (6223, '06368676-6cd6-4013-9316-92f2825d1325', '{"zone": "Block 1", "value": "Có vật thể tại Block 1", "status": "Cảnh báo", "deviceId": "hallway_sensor_radar", "distance": 8.4, "timestamp": 1778437743}', '2026-05-11 01:29:04.123835');
INSERT INTO "public"."sensor_data" VALUES (6224, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437748}', '2026-05-11 01:29:09.021226');
INSERT INTO "public"."sensor_data" VALUES (6225, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437748}', '2026-05-11 01:29:09.326395');
INSERT INTO "public"."sensor_data" VALUES (6226, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437753}', '2026-05-11 01:29:14.024294');
INSERT INTO "public"."sensor_data" VALUES (6227, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437757}', '2026-05-11 01:29:17.845791');
INSERT INTO "public"."sensor_data" VALUES (6228, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437758}', '2026-05-11 01:29:19.022569');
INSERT INTO "public"."sensor_data" VALUES (6229, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437763}', '2026-05-11 01:29:24.02275');
INSERT INTO "public"."sensor_data" VALUES (6230, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437764}', '2026-05-11 01:29:24.303701');
INSERT INTO "public"."sensor_data" VALUES (6231, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437768}', '2026-05-11 01:29:29.023914');
INSERT INTO "public"."sensor_data" VALUES (6232, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437773}', '2026-05-11 01:29:34.024611');
INSERT INTO "public"."sensor_data" VALUES (6233, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437775}', '2026-05-11 01:29:35.354091');
INSERT INTO "public"."sensor_data" VALUES (6234, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437778}', '2026-05-11 01:29:39.02626');
INSERT INTO "public"."sensor_data" VALUES (6235, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437781}', '2026-05-11 01:29:41.511565');
INSERT INTO "public"."sensor_data" VALUES (6236, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437783}', '2026-05-11 01:29:44.026138');
INSERT INTO "public"."sensor_data" VALUES (6237, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437786}', '2026-05-11 01:29:47.272779');
INSERT INTO "public"."sensor_data" VALUES (6238, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437788}', '2026-05-11 01:29:49.027613');
INSERT INTO "public"."sensor_data" VALUES (6239, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437793}', '2026-05-11 01:29:53.578168');
INSERT INTO "public"."sensor_data" VALUES (6240, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437793}', '2026-05-11 01:29:54.029017');
INSERT INTO "public"."sensor_data" VALUES (6241, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437798}', '2026-05-11 01:29:58.854396');
INSERT INTO "public"."sensor_data" VALUES (6242, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437798}', '2026-05-11 01:29:59.197156');
INSERT INTO "public"."sensor_data" VALUES (6243, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437803}', '2026-05-11 01:30:04.030034');
INSERT INTO "public"."sensor_data" VALUES (6244, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437806}', '2026-05-11 01:30:06.620932');
INSERT INTO "public"."sensor_data" VALUES (6245, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437808}', '2026-05-11 01:30:09.031748');
INSERT INTO "public"."sensor_data" VALUES (6246, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437811}', '2026-05-11 01:30:12.107269');
INSERT INTO "public"."sensor_data" VALUES (6247, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437813}', '2026-05-11 01:30:14.030806');
INSERT INTO "public"."sensor_data" VALUES (6248, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437817}', '2026-05-11 01:30:18.011736');
INSERT INTO "public"."sensor_data" VALUES (6249, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437818}', '2026-05-11 01:30:19.030817');
INSERT INTO "public"."sensor_data" VALUES (6250, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437823}', '2026-05-11 01:30:24.032984');
INSERT INTO "public"."sensor_data" VALUES (6251, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437828}', '2026-05-11 01:30:29.03226');
INSERT INTO "public"."sensor_data" VALUES (6252, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437833}', '2026-05-11 01:30:33.713033');
INSERT INTO "public"."sensor_data" VALUES (6253, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437833}', '2026-05-11 01:30:34.03097');
INSERT INTO "public"."sensor_data" VALUES (6254, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437838}', '2026-05-11 01:30:39.034675');
INSERT INTO "public"."sensor_data" VALUES (6255, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437838}', '2026-05-11 01:30:39.334175');
INSERT INTO "public"."sensor_data" VALUES (6256, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437843}', '2026-05-11 01:30:44.250348');
INSERT INTO "public"."sensor_data" VALUES (6257, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437846}', '2026-05-11 01:30:46.499005');
INSERT INTO "public"."sensor_data" VALUES (6258, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437848}', '2026-05-11 01:30:49.037011');
INSERT INTO "public"."sensor_data" VALUES (6259, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437851}', '2026-05-11 01:30:51.954865');
INSERT INTO "public"."sensor_data" VALUES (6260, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437853}', '2026-05-11 01:30:54.039479');
INSERT INTO "public"."sensor_data" VALUES (6261, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437857}', '2026-05-11 01:30:58.117831');
INSERT INTO "public"."sensor_data" VALUES (6262, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437858}', '2026-05-11 01:30:59.037714');
INSERT INTO "public"."sensor_data" VALUES (6263, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437863}', '2026-05-11 01:31:04.038108');
INSERT INTO "public"."sensor_data" VALUES (6264, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437867}', '2026-05-11 01:31:07.30751');
INSERT INTO "public"."sensor_data" VALUES (6265, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437868}', '2026-05-11 01:31:09.040608');
INSERT INTO "public"."sensor_data" VALUES (6266, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437873}', '2026-05-11 01:31:14.047222');
INSERT INTO "public"."sensor_data" VALUES (6267, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437874}', '2026-05-11 01:31:15.149534');
INSERT INTO "public"."sensor_data" VALUES (6268, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437878}', '2026-05-11 01:31:19.040059');
INSERT INTO "public"."sensor_data" VALUES (6269, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437880}', '2026-05-11 01:31:20.504709');
INSERT INTO "public"."sensor_data" VALUES (6270, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437883}', '2026-05-11 01:31:24.039954');
INSERT INTO "public"."sensor_data" VALUES (6271, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437886}', '2026-05-11 01:31:26.8441');
INSERT INTO "public"."sensor_data" VALUES (6272, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437888}', '2026-05-11 01:31:29.0418');
INSERT INTO "public"."sensor_data" VALUES (6273, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437893}', '2026-05-11 01:31:34.048527');
INSERT INTO "public"."sensor_data" VALUES (6274, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437894}', '2026-05-11 01:31:34.959224');
INSERT INTO "public"."sensor_data" VALUES (6275, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437898}', '2026-05-11 01:31:39.042838');
INSERT INTO "public"."sensor_data" VALUES (6276, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437900}', '2026-05-11 01:31:40.309504');
INSERT INTO "public"."sensor_data" VALUES (6277, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437903}', '2026-05-11 01:31:44.047395');
INSERT INTO "public"."sensor_data" VALUES (6278, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437906}', '2026-05-11 01:31:46.662851');
INSERT INTO "public"."sensor_data" VALUES (6279, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437908}', '2026-05-11 01:31:49.047086');
INSERT INTO "public"."sensor_data" VALUES (6280, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437912}', '2026-05-11 01:31:52.585193');
INSERT INTO "public"."sensor_data" VALUES (6281, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437913}', '2026-05-11 01:31:54.048353');
INSERT INTO "public"."sensor_data" VALUES (6282, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437918}', '2026-05-11 01:31:59.046375');
INSERT INTO "public"."sensor_data" VALUES (6283, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437922}', '2026-05-11 01:32:02.725749');
INSERT INTO "public"."sensor_data" VALUES (6284, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437923}', '2026-05-11 01:32:04.050725');
INSERT INTO "public"."sensor_data" VALUES (6285, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437928}', '2026-05-11 01:32:09.048054');
INSERT INTO "public"."sensor_data" VALUES (6286, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437928}', '2026-05-11 01:32:09.343946');
INSERT INTO "public"."sensor_data" VALUES (6287, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437933}', '2026-05-11 01:32:14.051318');
INSERT INTO "public"."sensor_data" VALUES (6288, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437934}', '2026-05-11 01:32:14.367217');
INSERT INTO "public"."sensor_data" VALUES (6289, '85703520-fb82-4ca5-9325-cd041ccbb2e1', '{"value": "37.5°C / 47.7%", "status": "Bình thường", "deviceId": "livingroom_sensor_dht22", "timestamp": 1778437938}', '2026-05-11 01:32:18.898732');
INSERT INTO "public"."sensor_data" VALUES (6290, '2b1fa08c-0bdc-4428-81d2-61949ba8c0cb', '{"value": "Khí độc", "status": "Nguy hiểm", "deviceId": "kitchen_sensor_mq135", "timestamp": 1778437938}', '2026-05-11 01:32:19.27809');
INSERT INTO "public"."sensor_data" VALUES (6291, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "32 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437938}', '2026-05-11 01:32:19.281091');
INSERT INTO "public"."sensor_data" VALUES (6292, '07f9dbb5-b63a-4e5b-ab96-c5b00c0af9b6', '{"value": "Có người", "motion": true, "status": "Cảnh báo", "deviceId": "entrance_sensor_pir", "timestamp": 1778437942}', '2026-05-11 01:32:23.213175');
INSERT INTO "public"."sensor_data" VALUES (6293, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437943}', '2026-05-11 01:32:24.049961');
INSERT INTO "public"."sensor_data" VALUES (6294, '3f989385-f8be-482f-a91f-3496f8934871', '{"value": "30 dB", "status": "Yên tĩnh", "deviceId": "livingroom_sensor_audio", "timestamp": 1778437948}', '2026-05-11 01:32:29.050976');

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
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES ('268800e9-702b-4cb2-b6eb-295befaca239', 'han', 'trung', 'hant@gmail.com', '$2a$10$eVk5A.p.zjrl7XttXepIvuth3p5ZFs/qwL7YOkRVbVuQcbRMyh2GG', 'f', '2026-04-18 07:30:29.071599', '2026-04-18 07:30:29.071599');
INSERT INTO "public"."users" VALUES ('c40fc44a-ec9c-4789-ad35-41c07d082d3a', 'han', 'trung', 'hant1@gmail.com', '$2a$10$omNQXZaoM06oOq/BWeBbi.DRAHXyYMTFIsfly4aExGUEvPtnZ/qIa', 'f', '2026-04-18 09:53:25.602707', '2026-04-18 09:53:25.602707');
INSERT INTO "public"."users" VALUES ('fb8cc7c1-f1f1-4be3-976b-c2e7b6f88a6f', 'Hán', 'Trung', 'h@gmail.com', '$2a$10$QgKkewXarKtW3.OlRkdlD.tBLC4wDwodUil647uE4BEqlfx52cSEa', 'f', '2026-04-18 15:52:31.27387', '2026-04-18 15:52:31.27387');
INSERT INTO "public"."users" VALUES ('87738872-3ce7-449d-89bf-175384e1f8f8', 'Hán', 'Trung', 'ht@gmail.com', '$2a$10$wapkqGdaJqiDwR/BPauBm.VXiAd5zd5e3KMN0AYzYXHZ.3kXelFR.', 'f', '2026-04-18 16:24:07.38781', '2026-04-18 16:24:07.38781');
INSERT INTO "public"."users" VALUES ('c1e0c1c8-16ef-4724-b8d7-89d242ea4d76', 'Hán', 'Trung', 'hrt@gmail.com', '$2a$10$emNkZ1AneBqzUekXsiYPyuuJgNDXqXd35rMXzEauERJua/IDYf01S', 'f', '2026-04-18 16:24:23.471318', '2026-04-18 16:24:23.471318');
INSERT INTO "public"."users" VALUES ('1d8d985c-ccbb-454f-a9b1-3c7bc4dd2e10', 'Hán', 'Trung', 'hrt4@gmail.com', '$2a$10$Ygyc0yEu5EYhDDmtMEnYuezeuCKs7GMkkR4zQL1hJPOrSd2gRBBEq', 'f', '2026-04-18 16:26:47.989555', '2026-04-18 16:26:47.989555');
INSERT INTO "public"."users" VALUES ('1f0385a0-da98-49ad-907d-f1c880c0dfad', 'Hán', 'Trung', 'hantrung453@gmail.com', '$2a$10$eeS7wfsrrhs27r4lgEQN0OAgRsmYqCjJjYBRWOdeB6c.AHFYXuogK', 'f', '2026-04-18 14:07:47.042061', '2026-04-20 12:59:04.282089');

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
SELECT setval('"public"."device_logs_id_seq"', 280, true);

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
SELECT setval('"public"."sensor_data_id_seq"', 6294, true);

-- ----------------------------
-- Primary Key structure for table automation_rules
-- ----------------------------
ALTER TABLE "public"."automation_rules" ADD CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table device_logs
-- ----------------------------
ALTER TABLE "public"."device_logs" ADD CONSTRAINT "device_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table device_states
-- ----------------------------
CREATE INDEX "idx_device_state_json" ON "public"."device_states" USING gin (
  "state" "pg_catalog"."jsonb_ops"
);

-- ----------------------------
-- Primary Key structure for table device_states
-- ----------------------------
ALTER TABLE "public"."device_states" ADD CONSTRAINT "device_states_pkey" PRIMARY KEY ("device_id");

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
-- Primary Key structure for table user_homes
-- ----------------------------
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_pkey" PRIMARY KEY ("user_id", "home_id");

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
-- Foreign Keys structure for table device_logs
-- ----------------------------
ALTER TABLE "public"."device_logs" ADD CONSTRAINT "device_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

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
-- Foreign Keys structure for table user_homes
-- ----------------------------
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."homes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_homes" ADD CONSTRAINT "user_homes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- 1. Cập nhật chủ sở hữu thử nghiệm cho Home có sẵn
UPDATE homes SET user_id = '1f0385a0-da98-49ad-907d-f1c880c0dfad' WHERE id = '11111111-1111-1111-1111-111111111111';

-- 2. Gán mối quan hệ trong bảng user_homes để cấp quyền điều khiển/thao tác
INSERT INTO user_homes (user_id, home_id, role)
VALUES ('1f0385a0-da98-49ad-907d-f1c880c0dfad', '11111111-1111-1111-1111-111111111111', 'owner')
ON CONFLICT (user_id, home_id) DO NOTHING;

-- 3. Tạo profile thử nghiệm cho user để test thông báo Telegram
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY,
    phone_number VARCHAR(20),
    region VARCHAR(100),
    avatar_url VARCHAR(255),
    telegram_chat_id VARCHAR(100),
    updated_at TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO user_profiles (user_id, phone_number, region, avatar_url, telegram_chat_id, updated_at)
VALUES (
    '1f0385a0-da98-49ad-907d-f1c880c0dfad', 
    '0335625672', 
    'Việt Nam', 
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', 
    '5715975017', 
    NOW()
)
ON CONFLICT (user_id) DO UPDATE 
SET phone_number = EXCLUDED.phone_number,
    region = EXCLUDED.region,
    telegram_chat_id = EXCLUDED.telegram_chat_id,
    updated_at = NOW();

-- 4. Tạo bảng camera_captures lưu trữ hình ảnh cảnh báo khi phát hiện người
CREATE TABLE IF NOT EXISTS camera_captures (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL,
    home_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_camera_captures_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT fk_camera_captures_home FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE
);

-- 5. Cấu hình bảng cho tính năng liên kết Telegram tự động
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(100);

CREATE TABLE IF NOT EXISTS telegram_link_codes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_telegram_link_codes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



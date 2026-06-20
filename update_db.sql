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


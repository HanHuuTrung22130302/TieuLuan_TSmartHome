package com.tsmarthome.be.dto.device.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class CameraStreamResponse {
    private UUID deviceId; // Dùng UUID của Device để FE dễ tìm kiếm và nối dữ liệu
    private String streamUrl;
}
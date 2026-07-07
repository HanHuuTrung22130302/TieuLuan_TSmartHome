package com.tsmarthome.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String region;
    private String role;
    private String status; // "Hoạt động" or "Bị khóa"
}

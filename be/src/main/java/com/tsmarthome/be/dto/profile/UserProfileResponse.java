package com.tsmarthome.be.dto.profile;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String region;
    private String avatarUrl;
    private String telegramChatId;
    private String telegramUsername;
    private java.time.LocalDateTime createdAt;
}


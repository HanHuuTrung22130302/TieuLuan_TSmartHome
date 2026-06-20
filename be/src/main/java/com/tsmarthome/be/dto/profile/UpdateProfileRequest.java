package com.tsmarthome.be.dto.profile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String region;
    private String avatarUrl;
    private String telegramChatId;
}

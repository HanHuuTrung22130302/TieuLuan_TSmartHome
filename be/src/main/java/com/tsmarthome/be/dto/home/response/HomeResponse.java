package com.tsmarthome.be.dto.home.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class HomeResponse {
    private UUID id;
    private String name;
    private String role;
}

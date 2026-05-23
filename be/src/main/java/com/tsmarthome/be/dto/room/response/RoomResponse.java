package com.tsmarthome.be.dto.room.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class RoomResponse {
    private UUID id;
    private String name;
}
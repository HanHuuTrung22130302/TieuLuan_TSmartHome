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
public class AdminHomeResponse {
    private UUID id;
    private String name;
    private String address;
    private String owner;
    private String ownerEmail;
    private String ownerPhone;
    private boolean linked;
    private long devices;
    private String connectionStatus;
}

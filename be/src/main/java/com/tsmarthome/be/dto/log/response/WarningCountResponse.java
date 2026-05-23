package com.tsmarthome.be.dto.log.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WarningCountResponse {
    private long warningCount;
    private long dangerCount;
}
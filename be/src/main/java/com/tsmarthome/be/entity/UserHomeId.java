package com.tsmarthome.be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserHomeId implements Serializable {
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "home_id")
    private UUID homeId;
}
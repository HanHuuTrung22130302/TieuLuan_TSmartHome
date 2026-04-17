package com.tsmarthome.be.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_homes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserHome {
    @EmbeddedId
    private UserHomeId id = new UserHomeId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("homeId")
    @JoinColumn(name = "home_id")
    private Home home;

    @Column(length = 20)
    private String role; // Mặc định 'member'
}
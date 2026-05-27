package com.tsmarthome.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "camera_streams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CameraStream {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "stream_url", nullable = false)
    private String streamUrl;
}
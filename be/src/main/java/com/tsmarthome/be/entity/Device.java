package com.tsmarthome.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Mapping khóa ngoại tới bảng rooms
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    private String name;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "mqtt_topic")
    private String mqttTopic;

    @Column(name = "is_fake")
    private Boolean isFake;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "label", length = 100)
    private String label;

    @Column(name = "icon", length = 50)
    private String icon;

    @Column(name = "pos_2d_x")
    private Double pos2dX;

    @Column(name = "pos_2d_y")
    private Double pos2dY;

    // THÊM 3 CỘT CHO BẢN ĐỒ 3D
    @Column(name = "pos_3d_x")
    private Double pos3dX;

    @Column(name = "pos_3d_y")
    private Double pos3dY;

    @Column(name = "pos_3d_z")
    private Double pos3dZ;

    @Column(length = 50)
    private String status;

    @Column(name = "state")
    private Boolean state;
}
package com.project.roommanagement.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "room_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RoomImage extends  BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "room_id",
            referencedColumnName = "id"
    )
    private Room room;

    @Column(name = "public_id")
    private String publicId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;


}

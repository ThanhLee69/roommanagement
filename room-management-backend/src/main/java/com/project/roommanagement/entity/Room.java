package com.project.roommanagement.entity;

import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Room extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "room_name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type")
    private RoomType roomType;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Column(name = "area")
    private Double area;

    @Column(name = "rental_price")
    private Double rentalPrice;

    @Column(name = "max_occupancy")
    private Integer maxOccupancy = 5;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(
            name = "building_id",
            referencedColumnName = "id")
    private Building building;

    @ManyToMany
    @JoinTable(
            name = "room_amenities",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    private Set<RoomImage> images;
}

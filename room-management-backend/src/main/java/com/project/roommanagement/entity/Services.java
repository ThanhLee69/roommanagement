package com.project.roommanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "services")
public class Services extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "default_price")
    private Double defaultPrice;

    @Column(name = "unit")
    private String unit;

    @Column(name = "description")
    private String description;

}

package com.project.roommanagement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BuildingResponse {

    private Long id;
    private String name;
    private String address;
    private long totalRooms;
    private String description;
    private int numberOfFloors;
    private double area;
    private Set<String> amenityNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

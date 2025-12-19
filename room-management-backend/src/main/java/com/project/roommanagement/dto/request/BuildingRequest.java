package com.project.roommanagement.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BuildingRequest {
    private String name;
    private String address;
    private String description;
    private Integer numberOfFloors;
    private Double area;
    private Set<Long> amenityIds;

}

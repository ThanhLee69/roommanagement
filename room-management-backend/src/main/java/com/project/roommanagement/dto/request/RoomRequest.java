package com.project.roommanagement.dto.request;

import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoomRequest {
    private String name;
    private RoomType roomType;
    private Integer floor;
    private Double area;
    private Double rentalPrice;
    private Integer maxOccupancy;
    private RoomStatus status;
    private String description;
    private Long buildingId;
    private Set<Long> amenityIds;
}

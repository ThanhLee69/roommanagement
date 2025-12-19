package com.project.roommanagement.dto.response;

import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private Long id;
    private String name;
    private String buildingName;
    private RoomType roomType;
    private Integer floor;
    private Double area;
    private Double rentalPrice;
    private Integer maxOccupancy;
    private RoomStatus status;
    private String description;
    private Set<String> amenityNames;
    private List<RoomImageResponse> images;

}

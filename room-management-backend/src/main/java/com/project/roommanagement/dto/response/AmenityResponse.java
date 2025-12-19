package com.project.roommanagement.dto.response;

import com.project.roommanagement.enums.AmenityScope;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Builder
public class AmenityResponse {

    private Long id;
    private String name;
    private String description;
    private AmenityScope scope;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

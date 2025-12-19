package com.project.roommanagement.dto.response;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceResponse {

    private Long id;

    private String name;

    private Double defaultPrice;

    private String unit;

    private String description;
}

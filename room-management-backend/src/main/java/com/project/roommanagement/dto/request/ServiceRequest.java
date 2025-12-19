package com.project.roommanagement.dto.request;


import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceRequest {

    private String name;

    private Double defaultPrice;

    private String unit;

    private String description;
}


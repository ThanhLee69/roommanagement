package com.project.roommanagement.dto.request;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeterReadingRequest {

    private Long roomId;

    private Integer month;

    private Integer year;

    private Integer oldElectric;

    private Integer newElectric;

    private Integer oldWater ;

    private Integer newWater;

    private String note;
}

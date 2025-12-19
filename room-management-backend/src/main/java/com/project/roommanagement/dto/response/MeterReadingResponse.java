package com.project.roommanagement.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MeterReadingResponse {

    private Long id;
    private Long roomId;
    private String roomName;

    private Integer month;
    private Integer year;

    private Integer oldElectric;
    private Integer newElectric;
    private Integer electricUsed;

    private Integer oldWater;
    private Integer newWater;
    private Integer waterUsed;

    private String note;
}

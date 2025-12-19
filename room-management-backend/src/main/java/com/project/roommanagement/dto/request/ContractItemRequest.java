package com.project.roommanagement.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContractItemRequest {


    private Long serviceId;

    private Double price;

}

package com.project.roommanagement.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContractItemResponse {

    private Long id;
    private Long serviceId;
    private String name;
    private Double price;
}

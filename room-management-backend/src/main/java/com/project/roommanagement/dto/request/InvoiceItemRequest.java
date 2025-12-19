package com.project.roommanagement.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class InvoiceItemRequest {
    private Long serviceId;
    private String serviceName;
    private Double price;
    private Integer quantity;
}


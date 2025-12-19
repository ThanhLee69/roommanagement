package com.project.roommanagement.dto.response;

import com.project.roommanagement.enums.PaymentMethod;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PaymentResponse {

    private Long id;

    private Long invoiceId;

    private String invoiceCode;

    private Double paymentAmount;

    private PaymentMethod paymentMethod;

    private LocalDate paymentDate;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

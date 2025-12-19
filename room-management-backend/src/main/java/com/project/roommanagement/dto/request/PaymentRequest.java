package com.project.roommanagement.dto.request;

import com.project.roommanagement.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class PaymentRequest {

    private Long invoiceId;

    private Double paymentAmount;

    private PaymentMethod paymentMethod;

    private LocalDate paymentDate;

    private String note;
}

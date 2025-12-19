package com.project.roommanagement.dto.request;

import com.project.roommanagement.entity.Room;
import com.project.roommanagement.entity.Tenant;
import com.project.roommanagement.enums.ContractStatus;
import com.project.roommanagement.enums.PaymentCycle;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContractRequest {

    private String contractCode;

    private Long roomId;

    private Long tenantId;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double rentPrice;

    private Double deposit;

    @Enumerated(EnumType.STRING)
    private PaymentCycle paymentCycle;

    private Integer maxOccupants;

    private Double electricityPrice;

    private Double waterPrice;

    private Integer paymentDay;

    private String notes;

    private String contractFile ;

    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    List<ContractItemRequest> contractItems;
}

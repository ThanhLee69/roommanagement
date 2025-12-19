package com.project.roommanagement.dto.response;

import com.project.roommanagement.entity.Room;
import com.project.roommanagement.entity.Tenant;
import com.project.roommanagement.enums.ContractStatus;
import com.project.roommanagement.enums.PaymentCycle;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContractResponse {

    private Long id;

    private String contractCode;

    private RoomResponse room;

    private TenantResponse tenant;

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

    private List<ContractItemResponse> contractItems;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoomResponse {
        private Long roomId;
        private String roomName;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TenantResponse {
        private Long tenantId;
        private String tenantName;
    }
}

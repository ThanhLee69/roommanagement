package com.project.roommanagement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {

    // ĐỊNH DANH
    private Long id;

    private String invoiceCode;

    private Long contractId;
    private String contractCode;
    private String roomName;
    private String tenantName;

    // KỲ HÓA ĐƠN
    private Integer year;
    private Integer month;


    // ĐIỆN
    private Integer electricStart;
    private Integer electricEnd;
    private Double electricPrice;
    private Double electricAmount;

    // NƯỚC
    private Integer waterStart;
    private Integer waterEnd;
    private Double waterPrice;
    private Double waterAmount;

    // TIỀN THUÊ
    private Double rentAmount;

    // PHỤ PHÍ
    private Double extraFee;

    // TỔNG TIỀN
    private Double totalServiceAmount;
    private Double totalAmount;

    // THANH TOÁN
    private Double paidAmount;
    private Double remainingAmount;

    // KHÁC
    private LocalDate dueDate;

    private String invoiceStatus;

    private String note;

    private LocalDate createdAt;
    private LocalDate updatedAt;

    private List<InvoiceItemResponse> invoiceItems;

    @Data
    public static class InvoiceItemResponse {
        private Long serviceId;
        private String serviceName;
        private Double price;
        private Integer quantity;
    }
}

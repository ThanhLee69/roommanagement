package com.project.roommanagement.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class InvoiceRequest {

    private String invoiceCode;

    private Long contractId;

    private Integer year;
    private Integer month;

    // Chỉ số điện & nước
    private Integer electricStart;
    private Integer electricEnd;
    private Integer waterStart;
    private Integer waterEnd;

    // Phụ phí
    private Double extraFee;
    private Double rentAmount;
    // Ngày hết hạn & ghi chú
    private LocalDate dueDate;
    private String note;

    // Danh sách dịch vụ chọn
    private List<InvoiceItemRequest> invoiceItems;
}

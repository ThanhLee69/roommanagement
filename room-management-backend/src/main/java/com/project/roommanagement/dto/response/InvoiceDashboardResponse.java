package com.project.roommanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvoiceDashboardResponse {

    private Long totalInvoice;     // Tổng hóa đơn
    private Long unpaidInvoice;    // Chưa thanh toán
    private Long paidInvoice;      // Đã thanh toán
    private Long overdueInvoice;   // Quá hạn
    private Double outstandingAmount; // Tổng tiền cần thu
}

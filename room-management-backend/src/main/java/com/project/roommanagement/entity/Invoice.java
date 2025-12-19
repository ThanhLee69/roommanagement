package com.project.roommanagement.entity;

import com.project.roommanagement.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoices")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_code", nullable = false, unique = true)
    private String invoiceCode;

    //KHÓA LIÊN KẾT
    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    //ĐỊNH DANH
    @Column(name = "tenant_name")
    private String tenantName;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "contract_code")
    private String contractCode;

    //KỲ HÓA ĐƠN
    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month;

    // CHỈ SỐ ĐIỆN
    @Column(name = "electric_start", nullable = false)
    private Integer electricStart;

    @Column(name = "electric_end", nullable = false)
    private Integer electricEnd;

    // GIÁ ĐIỆN
    @Column(name = "electric_price")
    private Double electricPrice;

    @Column(name = "electric_amount")
    private Double electricAmount;

    // CHỈ SỐ NƯỚC
    @Column(name = "water_start", nullable = false)
    private Integer waterStart;

    @Column(name = "water_end", nullable = false)
    private Integer waterEnd;

    // GIÁ NƯỚC
    @Column(name = "water_price")
    private Double waterPrice;

    @Column(name = "water_amount")
    private Double waterAmount;

    // TIỀN THUÊ
    @Column(name = "rent_amount")
    private Double rentAmount;

    // PHỤ PHÍ PHÁT SINH
    @Column(name = "extra_fee")
    private Double extraFee;

    // TỔNG TIỀN DỊCH VỤ
    @Column(name = "total_service_amount")
    private Double totalServiceAmount;

    // TỔNG TIỀN
    @Column(name = "total_amount")
    private Double totalAmount;

    //ĐÃ THANH TOÁN
    @Column(name = "paid_amount")
    private Double paidAmount;

    //CÒN LẠI
    @Column(name = "remaining_amount")
    private Double remainingAmount;

    // HẠN THANH TOÁN
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;


    // TRẠNG THÁI HÓA ĐƠN
    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_status")
    private InvoiceStatus invoiceStatus;

    // GHI CHÚ
    @Column(name = "note", length = 1000)
    private String note;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> invoiceItems;
}

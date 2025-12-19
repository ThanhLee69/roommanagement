package com.project.roommanagement.entity;

import com.project.roommanagement.enums.PaymentCycle;
import com.project.roommanagement.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Contract extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_code", nullable = false)
    private String contractCode;

    @ManyToOne
    @JoinColumn(
            name = "room_id",
            referencedColumnName = "id")
    private Room room;

    @ManyToOne
    @JoinColumn(
            name = "tenant_id",
            referencedColumnName = "id")

    private Tenant tenant;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "rent_price")
    private Double rentPrice;

    @Column(name = "deposit")
    private Double deposit;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_cycle")
    private PaymentCycle paymentCycle;

    @Column(name = "max_occupants")
    private Integer maxOccupants;

    @Column(name = "electricity_price")
    private Double electricityPrice;

    @Column(name = "water_price")
    private Double waterPrice;

    @Column(name = "payment_day")
    private Integer paymentDay  ;

    @Column(name = "notes ", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "contract_file")
    private String contractFile ;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status")
    private ContractStatus  status;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContractItem> contractItems;
}

package com.project.roommanagement.dto.request;
import com.project.roommanagement.enums.InvoiceStatus;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceFilterRequest {

    private String keyword;
    private Integer month;
    private Integer year;
    private InvoiceStatus invoiceStatus;
    private LocalDate dueDateFrom;
    private LocalDate dueDateTo;
    private Integer page;
    private Integer size;
}

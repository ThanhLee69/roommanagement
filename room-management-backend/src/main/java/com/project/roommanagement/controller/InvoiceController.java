package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.InvoiceRequest;
import com.project.roommanagement.dto.request.InvoiceFilterRequest;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.InvoiceDashboardResponse;
import com.project.roommanagement.dto.response.InvoiceResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.enums.InvoiceStatus;
import com.project.roommanagement.service.InvoiceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Slf4j(topic = "INVOICE-CONTROLLER")
@Validated
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ApiResponse<InvoiceResponse> createInvoice(@Valid @RequestBody InvoiceRequest request) {

        InvoiceResponse invoice = invoiceService.createInvoice(request);

        return ApiResponse.<InvoiceResponse>builder()
                .code(201)
                .message("Invoice created successfully")
                .result(invoice)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<InvoiceResponse> updateInvoice(@PathVariable Long id,
                                                      @Valid @RequestBody InvoiceRequest request) {

        InvoiceResponse invoice = invoiceService.updateInvoice(id, request);

        return ApiResponse.<InvoiceResponse>builder()
                .code(200)
                .message("Invoice updated successfully")
                .result(invoice)
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<InvoiceResponse>>getInvoices(@RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) Integer month,
                                         @RequestParam(required = false) Integer year,
                                         @RequestParam(required = false) InvoiceStatus invoiceStatus,
                                         @RequestParam(required = false) LocalDate dueDateFrom,
                                         @RequestParam(required = false) LocalDate dueDateTo,
                                         @RequestParam(defaultValue = "1") @Min(1) int page,
                                         @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {

        InvoiceFilterRequest invoiceFilterRequest = InvoiceFilterRequest.builder()
                .keyword(keyword)
                .month(month)
                .year(year)
                .invoiceStatus(invoiceStatus)
                .dueDateFrom(dueDateFrom)
                .dueDateTo(dueDateTo)
                .page(page)
                .size(size)
                .build();

        PageResponse<InvoiceResponse> invoices = invoiceService.getInvoices(invoiceFilterRequest);

        return ApiResponse.<PageResponse<InvoiceResponse>>builder()
                .code(200)
                .message("Get invoices successfully")
                .result(invoices)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse invoice = invoiceService.getInvoiceById(id);
        return ApiResponse.<InvoiceResponse>builder()
                .code(200)
                .message("Get invoice successfully")
                .result(invoice)
                .build();
    }

    @GetMapping("/payment/all")
    public ApiResponse<List<InvoiceResponse>> getAllInvoicesForPayment() {
        List<InvoiceResponse> invoices = invoiceService.getAllInvoicesForPayment();
        return ApiResponse.<List<InvoiceResponse>>builder()
                .code(200)
                .message("Get invoices for payment successfully")
                .result(invoices)
                .build();

    }

    @GetMapping("/dashboard")
    public ApiResponse<InvoiceDashboardResponse> getInvoiceDashboard() {
        InvoiceDashboardResponse dashboard = invoiceService.getDashboard();
        return ApiResponse.<InvoiceDashboardResponse>builder()
                .code(200)
                .message("Get invoices dashboard successfully")
                .result(dashboard)
                .build();
    }
}

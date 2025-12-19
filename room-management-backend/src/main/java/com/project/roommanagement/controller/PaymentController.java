package com.project.roommanagement.controller;



import com.project.roommanagement.dto.request.PaymentRequest;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.PaymentResponse;
import com.project.roommanagement.enums.PaymentMethod;
import com.project.roommanagement.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j(topic = "PAYMENT-CONTROLLER")
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ApiResponse<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request){
        PaymentResponse payment = paymentService.createPayment(request);
        return ApiResponse.<PaymentResponse>builder()
                .code(201)
                .message("Payment created successfully")
                .result(payment)
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<PaymentResponse>> getPayments(
                                                    @RequestParam(required = false) String keyword,
                                                    @RequestParam(required = false) PaymentMethod paymentMethod,
                                                    @RequestParam(required = false) LocalDate payDateFrom,
                                                    @RequestParam(required = false) LocalDate payDateTo,
                                                    @RequestParam(defaultValue = "1") @Min(1) int page,
                                                    @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size){
        PageResponse<PaymentResponse> payments = paymentService.getPayments(keyword, paymentMethod, payDateFrom, payDateTo, page, size);

        return ApiResponse.<PageResponse<PaymentResponse>>builder()
                .code(200)
                .message("Get payments successfully")
                .result(payments)
                .build();
    }

    @GetMapping("/{invoiceId}")
    public ApiResponse<List<PaymentResponse>> getPaymentByInvoiceId(@PathVariable Long invoiceId){
        List<PaymentResponse> payment = paymentService.getPaymentByInvoiceId(invoiceId);
        return ApiResponse.<List<PaymentResponse>>builder()
                .code(200)
                .message("Get payment successfully")
                .result(payment)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PaymentResponse> updatePayment(@PathVariable Long id,@Valid @RequestBody PaymentRequest request){
        PaymentResponse payment = paymentService.updatePayment(id,request);
        return ApiResponse.<PaymentResponse>builder()
                .code(200)
                .message("Payment updated successfully")
                .result(payment)
                .build();
    }

}

package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.PaymentRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.PaymentResponse;
import com.project.roommanagement.entity.Payment;
import com.project.roommanagement.enums.PaymentMethod;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    PaymentResponse updatePayment(Long id, PaymentRequest request);

    PageResponse<PaymentResponse> getPayments(String keyword,
                                              PaymentMethod paymentMethod,
                                              LocalDate dateFrom,
                                              LocalDate dateTo,
                                              int page,
                                              int size);

    List<PaymentResponse> getPaymentByInvoiceId(Long invoiceId);

}

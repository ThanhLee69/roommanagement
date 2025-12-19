package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.PaymentRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.PaymentResponse;
import com.project.roommanagement.entity.Invoice;
import com.project.roommanagement.entity.Payment;
import com.project.roommanagement.enums.InvoiceStatus;
import com.project.roommanagement.enums.PaymentMethod;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.PaymentMapper;
import com.project.roommanagement.repository.InvoiceRepository;
import com.project.roommanagement.repository.PaymentRepository;
import com.project.roommanagement.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public PaymentResponse createPayment(PaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(()-> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        Payment payment = paymentMapper.toPayment(request);
        payment.setInvoice(invoice);

        paymentRepository.save(payment);

        Double paidAmount = payment.getPaymentAmount();
        invoice.setPaidAmount(paidAmount);

        Double totalAmount = invoice.getTotalAmount();
        invoice.setRemainingAmount(totalAmount - paidAmount);
        if (request.getPaymentAmount() == 0) return null;
        if (paidAmount > 0 && paidAmount<totalAmount) {
            invoice.setInvoiceStatus(InvoiceStatus.PARTIALLY_PAID);
        }else if(paidAmount.equals(totalAmount)){
            invoice.setInvoiceStatus(InvoiceStatus.PAID);
        }else {
            invoice.setInvoiceStatus(InvoiceStatus.UNPAID);
        }

        invoiceRepository.save(invoice);

        return paymentMapper.toPaymentResponse(payment);
    }

    @Override
    public PaymentResponse updatePayment(Long id, PaymentRequest request) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(()-> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        paymentMapper.updatePayment(payment,request);
        payment.setInvoice(invoice);

        paymentRepository.save(payment);

        Double paidAmount = payment.getPaymentAmount();
        invoice.setPaidAmount(paidAmount);

        Double totalAmount = invoice.getTotalAmount();
        invoice.setRemainingAmount(totalAmount - paidAmount);
        if (request.getPaymentAmount() == 0) return null;
        if (paidAmount > 0 && paidAmount<totalAmount) {
            invoice.setInvoiceStatus(InvoiceStatus.PARTIALLY_PAID);
        }else if(paidAmount.equals(totalAmount)){
            invoice.setInvoiceStatus(InvoiceStatus.PAID);
        }else {
            invoice.setInvoiceStatus(InvoiceStatus.UNPAID);
        }

        invoiceRepository.save(invoice);

        return paymentMapper.toPaymentResponse(payment);
    }


    @Override
    public PageResponse<PaymentResponse> getPayments(String keyword,
                                                     PaymentMethod paymentMethod,
                                                     LocalDate dateFrom,
                                                     LocalDate dateTo,
                                                     int page,
                                                     int size) {

        Pageable pageable =   PageRequest.of(page - 1,size, Sort.by("createdAt").descending());

        Page<Payment> responsePage = paymentRepository.searchPayments(keyword,paymentMethod,dateFrom,dateTo,pageable);

        List<PaymentResponse> responseList = responsePage.stream().map(paymentMapper::toPaymentResponse).toList();

        return PageResponse.<PaymentResponse>builder()
                .items(responseList)
                .pageSize(responsePage.getSize())
                .currentPage(responsePage.getNumber()+1)
                .totalPages(responsePage.getTotalPages())
                .totalItems(responsePage.getTotalElements())
                .build();
    }

    @Override
    public List<PaymentResponse> getPaymentByInvoiceId(Long invoiceId) {

        List<Payment> responseList = paymentRepository.findByInvoiceId(invoiceId);
        return responseList.stream()
                .map(paymentMapper::toPaymentResponse)
                .toList();
    }

}

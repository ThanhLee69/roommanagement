package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.PaymentRequest;
import com.project.roommanagement.dto.response.PaymentResponse;
import com.project.roommanagement.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "invoice",ignore = true)
    Payment toPayment (PaymentRequest paymentRequest);

    @Mapping(target = "invoice",ignore = true)
    Payment updatePayment (@MappingTarget Payment payment, PaymentRequest paymentRequest);

    @Mapping(target = "invoiceId",source = "invoice.id")
    @Mapping(target = "invoiceCode",source = "invoice.invoiceCode")
    PaymentResponse toPaymentResponse (Payment payment);
}

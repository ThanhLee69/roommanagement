package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.InvoiceRequest;
import com.project.roommanagement.dto.response.InvoiceResponse;
import com.project.roommanagement.entity.Invoice;
import com.project.roommanagement.entity.InvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface InvoiceMapper {

    // Tạo mới hóa đơn
    @Mapping(target = "contract", ignore = true)
    @Mapping(target = "invoiceStatus", ignore = true)
    @Mapping(target = "paidAmount", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "contractCode", ignore = true)
    @Mapping(target = "invoiceItems", ignore = true)
    Invoice toInvoice(InvoiceRequest request);

    // Update hóa đơn
    @Mapping(target = "contract", ignore = true)
    @Mapping(target = "invoiceStatus", ignore = true)
    @Mapping(target = "paidAmount", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceItems", ignore = true)
    void updateInvoice(InvoiceRequest request, @MappingTarget Invoice invoice);

    // Response
    @Mapping(target = "contractId", source = "contract.id")
    @Mapping(target = "invoiceItems", source = "invoiceItems")
    InvoiceResponse toInvoiceResponse(Invoice invoice);

    @Mapping(target = "serviceId", expression = "java(item.getService().getId())")

    @Mapping(target = "serviceName", source = "itemName")
    @Mapping(target = "price", source = "unitPrice")
    @Mapping(target = "quantity", source = "quantity")
    InvoiceResponse.InvoiceItemResponse
    toInvoiceItemResponse(InvoiceItem item);

    // Map list InvoiceItem sang list InvoiceItemResponse
    List<InvoiceResponse.InvoiceItemResponse> toInvoiceItemResponseList(List<InvoiceItem> items);
}

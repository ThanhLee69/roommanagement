package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.InvoiceRequest;
import com.project.roommanagement.dto.request.InvoiceFilterRequest;
import com.project.roommanagement.dto.response.InvoiceDashboardResponse;
import com.project.roommanagement.dto.response.InvoiceResponse;
import com.project.roommanagement.dto.response.PageResponse;

import java.util.List;

public interface InvoiceService {

    InvoiceResponse createInvoice(InvoiceRequest request);

    InvoiceResponse updateInvoice(Long id, InvoiceRequest request);

    PageResponse<InvoiceResponse> getInvoices(InvoiceFilterRequest filterRequest);

    void deleteInvoice(Long id);

    InvoiceResponse getInvoiceById(Long id);

    InvoiceDashboardResponse getDashboard();

    List<InvoiceResponse> getAllInvoicesForPayment();

}

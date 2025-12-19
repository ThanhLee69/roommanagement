package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.InvoiceItemRequest;
import com.project.roommanagement.dto.request.InvoiceRequest;
import com.project.roommanagement.dto.request.InvoiceFilterRequest;
import com.project.roommanagement.dto.response.InvoiceDashboardResponse;
import com.project.roommanagement.dto.response.InvoiceResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.entity.*;
import com.project.roommanagement.enums.InvoiceStatus;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.InvoiceMapper;
import com.project.roommanagement.repository.ContractRepository;
import com.project.roommanagement.repository.InvoiceItemRepository;
import com.project.roommanagement.repository.InvoiceRepository;
import com.project.roommanagement.repository.ServiceRepository;
import com.project.roommanagement.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final ContractRepository contractRepository;
    private final ServiceRepository serviceRepository;
    private final InvoiceItemRepository invoiceItemRepository;

    @Override
    public InvoiceResponse createInvoice(InvoiceRequest invoiceRequest) {
        // Lấy hợp đồng
        Contract contract = contractRepository.findById(invoiceRequest.getContractId())
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        // Map request sang entity
        Invoice invoice = invoiceMapper.toInvoice(invoiceRequest);
        invoice.setContract(contract);
        invoice.setContractCode(contract.getContractCode());
        invoice.setTenantName(contract.getTenant().getFullName());
        invoice.setRoomName(contract.getRoom().getName());
        invoice.setElectricPrice(contract.getElectricityPrice());
        invoice.setWaterPrice(contract.getWaterPrice());
        // Tính chỉ số điện
        Integer electricUsage = invoiceRequest.getElectricEnd() - invoiceRequest.getElectricStart();
        Double electricAmount = electricUsage * contract.getElectricityPrice();
        invoice.setElectricAmount(electricAmount);

        // Tính chỉ số nước
        Integer waterUsage = invoiceRequest.getWaterEnd() - invoiceRequest.getWaterStart();
        Double waterAmount = waterUsage * contract.getWaterPrice();
        invoice.setWaterAmount(waterAmount);

        // Tính tổng tiền dịch vụ
        Double totalServiceAmount = 0.0;
        if (invoiceRequest.getInvoiceItems() != null && !invoiceRequest.getInvoiceItems().isEmpty()) {
            totalServiceAmount = invoiceRequest.getInvoiceItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        }
        invoice.setTotalServiceAmount(totalServiceAmount);

        // Tiền thuê
        Double rentAmount = invoiceRequest.getRentAmount();

        // Tổng tiền
        Double totalAmount = rentAmount
                + electricAmount
                + (invoiceRequest.getExtraFee() != null ? invoiceRequest.getExtraFee() : 0.0)
                + waterAmount
                + totalServiceAmount;
        invoice.setTotalAmount(totalAmount);

        invoice.setPaidAmount(0.0);
        invoice.setRemainingAmount(totalAmount);
        invoice.setInvoiceStatus(InvoiceStatus.UNPAID);

        invoiceRepository.save(invoice);

        // Lưu chi tiết dịch vụ kèm hóa đơn
        if (invoiceRequest.getInvoiceItems() != null && !invoiceRequest.getInvoiceItems().isEmpty()) {

            List<InvoiceItem> invoiceItems = new ArrayList<>();

            for (InvoiceItemRequest item : invoiceRequest.getInvoiceItems()) {

                Services service = serviceRepository.findById(item.getServiceId())
                        .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

                InvoiceItem invoiceItem = InvoiceItem.builder()
                        .invoice(invoice)
                        .service(service)
                        .itemName(item.getServiceName())
                        .unitPrice(item.getPrice())
                        .quantity(item.getQuantity())
                        .amount(item.getPrice() * item.getQuantity())
                        .build();

                invoiceItems.add(invoiceItem);
            }
            invoiceItemRepository.saveAll(invoiceItems);
        }

        return invoiceMapper.toInvoiceResponse(invoice);
    }


    @Transactional
    @Override
    public InvoiceResponse updateInvoice(Long id, InvoiceRequest request) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        // CẬP NHẬT CONTRACT
        if (!invoice.getContract().getId().equals(request.getContractId())) {
            Contract contract = contractRepository.findById(request.getContractId())
                    .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

            invoice.setContract(contract);
            invoice.setContractCode(contract.getContractCode());
            invoice.setTenantName(contract.getTenant().getFullName());
            invoice.setRoomName(contract.getRoom().getName());
            invoice.setElectricPrice(contract.getElectricityPrice());
            invoice.setWaterPrice(contract.getWaterPrice());
        }

        // MAP CÁC FIELD KHÁC
        invoiceMapper.updateInvoice(request, invoice);

        // TÍNH TIỀN ĐIỆN NƯỚC
        Integer electricUsage = request.getElectricEnd() - request.getElectricStart();
        invoice.setElectricAmount(electricUsage * invoice.getElectricPrice());

        Integer waterUsage = request.getWaterEnd() - request.getWaterStart();
        invoice.setWaterAmount(waterUsage * invoice.getWaterPrice());

        Double rentAmount = request.getRentAmount() != null ? request.getRentAmount() : 0.0;
        Double extraFee = request.getExtraFee() != null ? request.getExtraFee() : 0.0;


        // UPDATE INVOICE ITEMS
        List<InvoiceItemRequest> feItems = request.getInvoiceItems();
        if (feItems != null && !feItems.isEmpty()) {

            // Lấy danh sách từ DB
            List<InvoiceItem> dbItems = invoiceItemRepository.findByInvoiceId(invoice.getId());

            // Map serviceId -> InvoiceItem (DB)
            Map<Long, InvoiceItem> dbMap = dbItems.stream()
                    .collect(Collectors.toMap(
                            item -> item.getService().getId(),
                            item -> item
                    ));

            // Map serviceId -> InvoiceItemRequest (FE)
            Map<Long, InvoiceItemRequest> feMap = feItems.stream()
                    .collect(Collectors.toMap(
                            InvoiceItemRequest::getServiceId,
                            item -> item,
                            (a, b) -> a
                    ));


            // DELETE (DB có - FE không có)

            List<InvoiceItem> toDelete = dbItems.stream()
                    .filter(item -> !feMap.containsKey(item.getService().getId()))
                    .collect(Collectors.toList());

            if (!toDelete.isEmpty()) {
                invoiceItemRepository.deleteAll(toDelete);
            }

            // ADD (FE có - DB không có)
            List<InvoiceItem> toAdd = feItems.stream()
                    .filter(item -> !dbMap.containsKey(item.getServiceId()))
                    .map(req -> {

                        Services service = serviceRepository.findById(req.getServiceId())
                                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

                        return InvoiceItem.builder()
                                .invoice(invoice)
                                .service(service)
                                .itemName(req.getServiceName())
                                .unitPrice(req.getPrice())
                                .quantity(req.getQuantity())
                                .amount(req.getPrice() * req.getQuantity())
                                .build();
                    })
                    .collect(Collectors.toList());

            if (!toAdd.isEmpty()) {
                invoiceItemRepository.saveAll(toAdd);
            }

            // UPDATE (cùng serviceId)
            dbItems.forEach(item -> {
                InvoiceItemRequest fe = feMap.get(item.getService().getId());
                if (fe != null) {
                    item.setQuantity(fe.getQuantity());
                    item.setUnitPrice(fe.getPrice());
                    item.setAmount(fe.getPrice() * fe.getQuantity());
                }
            });
        }

        // TÍNH TỔNG TIỀN

        List<InvoiceItem> finalItems = invoiceItemRepository.findByInvoiceId(invoice.getId());

        Double totalServiceAmount = finalItems.stream()
                .mapToDouble(InvoiceItem::getAmount)
                .sum();

        invoice.setTotalServiceAmount(totalServiceAmount);

        Double totalAmount = rentAmount
                + invoice.getElectricAmount()
                + invoice.getWaterAmount()
                + extraFee
                + totalServiceAmount;

        invoice.setTotalAmount(totalAmount);
        invoice.setRemainingAmount(totalAmount - invoice.getPaidAmount());
        invoiceRepository.save(invoice);

        return invoiceMapper.toInvoiceResponse(invoice);
    }



    @Override
    public PageResponse<InvoiceResponse> getInvoices(InvoiceFilterRequest filterRequest) {

        PageRequest pageRequest = PageRequest.of(filterRequest.getPage() - 1, filterRequest.getSize(),Sort.by("createdAt").descending());

        Page<Invoice> invoicePage = invoiceRepository.filterInvoices(
                filterRequest.getKeyword(),
                filterRequest.getMonth(),
                filterRequest.getYear(),
                filterRequest.getInvoiceStatus(),
                filterRequest.getDueDateFrom(),
                filterRequest.getDueDateTo(),
                pageRequest);

        List<InvoiceResponse> invoiceResponseList =  invoicePage.stream()
                .map(invoiceMapper::toInvoiceResponse)
                .toList();


        return PageResponse.<InvoiceResponse>builder()
                .items(invoiceResponseList)
                .pageSize(invoicePage.getSize())
                .currentPage(invoicePage.getNumber()+1)
                .totalPages(invoicePage.getTotalPages())
                .totalItems(invoicePage.getTotalElements())
                .build();
    }

    @Override
    public void deleteInvoice(Long id) {

    }

    @Override
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->  new AppException(ErrorCode.SERVICE_NOT_FOUND));

        return invoiceMapper.toInvoiceResponse(invoice);
    }

    @Override
    public InvoiceDashboardResponse getDashboard() {
        return InvoiceDashboardResponse.builder()
                .totalInvoice(invoiceRepository.countAll())
                .unpaidInvoice(invoiceRepository.countUnpaid())
                .paidInvoice(invoiceRepository.countPaid())
                .overdueInvoice(invoiceRepository.countOverdue())
                .outstandingAmount(invoiceRepository.totalOutstanding())
                .build();
    }

    @Override
    public List<InvoiceResponse> getAllInvoicesForPayment() {
        List<Invoice>  invoiceList = invoiceRepository.findAllInvoicesForPayment();
        return invoiceList.stream()
                .map(invoiceMapper::toInvoiceResponse)
                .toList();
    }
}

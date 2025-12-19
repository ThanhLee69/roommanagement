package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.ContractItemRequest;
import com.project.roommanagement.dto.request.ContractRequest;
import com.project.roommanagement.dto.response.ContractDashboardResponse;
import com.project.roommanagement.dto.response.ContractResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.entity.*;
import com.project.roommanagement.enums.ContractStatus;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.TenantStatus;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.ContractMapper;
import com.project.roommanagement.repository.*;
import com.project.roommanagement.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;
    private final TenantRepository tenantRepository;
    private final RoomRepository roomRepository;
    private final ContractItemRepository contractItemRepository;
    private final ServiceRepository serviceRepository;

    @Transactional
    @Override
    public ContractResponse createContract(ContractRequest contractRequest) {

        Contract contract = contractMapper.toContract(contractRequest);

        Room room = roomRepository.findById(contractRequest.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        Tenant tenant = tenantRepository.findById(contractRequest.getTenantId())
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        tenant.setStatus(TenantStatus.RENTING);
        tenantRepository.save(tenant);

        contract.setRoom(room);
        contract.setTenant(tenant);

        contract = contractRepository.save(contract);


        if (contractRequest.getContractItems() != null  && !contractRequest.getContractItems().isEmpty()) {

            List<ContractItem> items = new ArrayList<>();

            for (ContractItemRequest itemRequest : contractRequest.getContractItems()) {

                Services service = serviceRepository.findById(itemRequest.getServiceId())
                        .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

                ContractItem item = ContractItem.builder()
                        .contract(contract)
                        .service(service)
                        .price(itemRequest.getPrice())
                        .build();

                items.add(item);
            }

            contractItemRepository.saveAll(items);
        }

        return contractMapper.toContractResponse(contract);
    }

    @Transactional
    @Override
    public ContractResponse updateContract(Long id, ContractRequest contractRequest) {

        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));

        contractMapper.updateContract(contract, contractRequest);

        Room room = roomRepository.findById(contractRequest.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        Tenant tenant = tenantRepository.findById(contractRequest.getTenantId())
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        tenant.setStatus(TenantStatus.RENTING);
        tenantRepository.save(tenant);

        contract.setRoom(room);
        contract.setTenant(tenant);

        contractRepository.save(contract);

        // Cập nhật danh sách dịch vụ đi kèm
        List<ContractItemRequest> feItems = contractRequest.getContractItems();
        if (contractRequest.getContractItems() != null && !contractRequest.getContractItems().isEmpty()) {

            List<ContractItem> dbItems = contractItemRepository.findByContractId(contract.getId());

            // Map theo serviceId
            Map<Long, ContractItem> dbMap = dbItems.stream()
                    .collect(Collectors.toMap(item -> item.getService().getId(), item -> item));

            Map<Long, ContractItemRequest> feMap = feItems.stream()
                    .collect(Collectors.toMap(ContractItemRequest::getServiceId, item -> item, (a,b) -> a));

            // Xóa những item DB không còn trong FE
            List<ContractItem> toDelete = dbItems.stream()
                    .filter(item -> !feMap.containsKey(item.getService().getId()))
                    .toList();
            if (!toDelete.isEmpty()) {
                contractItemRepository.deleteAll(toDelete);
            }

            // Thêm mới những item FE mà DB chưa có
            List<ContractItem> toAdd = feItems.stream()
                    .filter(item -> !dbMap.containsKey(item.getServiceId()))
                    .map(itemRequest -> {
                        Services service = serviceRepository.findById(itemRequest.getServiceId())
                                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

                        return ContractItem.builder()
                                .contract(contract)
                                .service(service)
                                .price(itemRequest.getPrice())
                                .build();
                    })
                    .toList();

            if (!toAdd.isEmpty()) {
                contractItemRepository.saveAll(toAdd);
            }
        }

        return contractMapper.toContractResponse(contract);
    }



    @Override
    public PageResponse<ContractResponse> getContracts(String keyword,
                                                       ContractStatus status,
                                                       Long buildingId,
                                                       Long roomId,
                                                       int page,
                                                       int size) {

        PageRequest pageRequest =  PageRequest.of(page - 1 , size, Sort.by("createdAt").descending());

        Page<Contract> contractPage = contractRepository.findContracts(keyword,status,buildingId,roomId, pageRequest);

        List<ContractResponse> content = contractPage.stream()
                .map(contractMapper::mapContractWithItems)
                .collect(Collectors.toList());


        return PageResponse.<ContractResponse>builder()
                .items(content)
                .pageSize(contractPage.getSize())
                .currentPage(contractPage.getNumber()+1)
                .totalItems(contractPage.getTotalElements())
                .totalPages(contractPage.getTotalPages())
                .build();
    }

    @Override
    public List<ContractResponse> getActiveContracts() {
        List<Contract> contracts =
                contractRepository.findByStatusOrderByCreatedAtDesc(ContractStatus.ACTIVE);

        return contracts.stream()
                .map(contractMapper::mapContractWithItems)
                .toList();
    }

    @Override
    public ContractDashboardResponse getContractDashboard() {
        Long total = contractRepository.countBy();
        Long active = contractRepository.countByStatus(ContractStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        LocalDate next7Days = today.plusDays(7);
        Long expiringSoon = contractRepository.countByStatusAndEndDateBetween(ContractStatus.ACTIVE, today, next7Days);

        Long expired = contractRepository.countByStatus(ContractStatus.EXPIRED);
        return  ContractDashboardResponse.builder()
                .totalContracts(total)
                .activeContracts(active)
                .expiringSoonContracts(expiringSoon)
                .expiredContracts(expired)
                .build();
    }

    @Override
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
        contractRepository.delete(contract);
    }

}

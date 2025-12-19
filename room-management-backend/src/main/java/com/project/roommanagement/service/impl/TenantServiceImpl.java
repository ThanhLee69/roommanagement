package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.TenantRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.TenantDashboardResponse;
import com.project.roommanagement.dto.response.TenantResponse;
import com.project.roommanagement.entity.Tenant;
import com.project.roommanagement.enums.TenantStatus;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.TenantMapper;
import com.project.roommanagement.repository.TenantRepository;
import com.project.roommanagement.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;

    @Override
    public TenantResponse createTenant(TenantRequest tenantRequest) {

        Tenant tenant = tenantMapper.toTenant(tenantRequest);

        tenantRepository.save(tenant);

        return tenantMapper.toTenantResponse(tenant);
    }

    @Override
    public TenantResponse updateTenant(Long id, TenantRequest tenantRequest) {

        Tenant tenant = tenantRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        tenantMapper.updateTenant(tenant, tenantRequest);

        tenantRepository.save(tenant);

        return tenantMapper.toTenantResponse(tenant);
    }

    @Override
    public void deleteTenant(Long id) {

        Tenant tenant = tenantRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));
        tenantRepository.delete(tenant);
    }

    @Override
    public PageResponse<TenantResponse> getTenants(String keyword,
                                                   TenantStatus status,
                                                   int page,
                                                   int size) {
        PageRequest pageRequest = PageRequest.of(page - 1 , size, Sort.by("createdAt").descending());
        Page<Tenant> tenantPage = tenantRepository.searchTenant(keyword, status, pageRequest);
        List<TenantResponse> content = tenantPage.getContent()
                .stream()
                .map(tenantMapper::toTenantResponse)
                .toList();

        return PageResponse.<TenantResponse>builder()
                .items(content)
                .currentPage(tenantPage.getNumber()+1)
                .pageSize(tenantPage.getSize())
                .totalItems(tenantPage.getTotalElements())
                .totalPages(tenantPage.getTotalPages())
                .build();
    }

    @Override
    public List<TenantResponse> getTenants() {
        List<Tenant> tenants = tenantRepository.findAll();

        return tenants.stream()
                .map(tenantMapper::toTenantResponse)
                .toList();
    }

    @Override
    public List<TenantResponse> getAvailableTenants() {
        List<Tenant> tenants = tenantRepository.findByStatusIn(List.of(TenantStatus.NOT_RENTED, TenantStatus.CHECKED_OUT));

        return tenants.stream()
                .map(tenantMapper::toTenantResponse)
                .toList();
    }

    @Override
    public TenantDashboardResponse getTenantDashboard() {
        return TenantDashboardResponse.builder()
                .totalTenants(tenantRepository.countAllTenants())
                .rentingTenants(tenantRepository.countRentingTenants())
                .checkedOutTenants(tenantRepository.countCheckedOutTenants())
                .notRentedTenants(tenantRepository.countNotRentedTenants())
                .build();
    }
}

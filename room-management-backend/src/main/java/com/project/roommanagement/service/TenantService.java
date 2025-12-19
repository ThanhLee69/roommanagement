package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.RoomRequest;
import com.project.roommanagement.dto.request.TenantRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.RoomResponse;
import com.project.roommanagement.dto.response.TenantDashboardResponse;
import com.project.roommanagement.dto.response.TenantResponse;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import com.project.roommanagement.enums.TenantStatus;

import java.util.List;

public interface TenantService {

    TenantResponse createTenant(TenantRequest tenantRequest);

    TenantResponse updateTenant(Long id,TenantRequest tenantRequest);

    void deleteTenant(Long id);

    PageResponse<TenantResponse> getTenants(String keyword, TenantStatus status, int page,int size);

    List<TenantResponse> getTenants();

    List<TenantResponse> getAvailableTenants();

    TenantDashboardResponse getTenantDashboard();
}

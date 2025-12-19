package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.TenantRequest;
import com.project.roommanagement.dto.response.*;
import com.project.roommanagement.enums.TenantStatus;
import com.project.roommanagement.service.TenantService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tenants")
@Slf4j(topic = "TENANT-CONTROLLER")
@Validated
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ApiResponse<TenantResponse> createTenant(@Valid @RequestBody TenantRequest request) {
        TenantResponse tenant = tenantService.createTenant(request);
        return ApiResponse.<TenantResponse>builder()
                        .code(201)
                        .message("Tenant created successfully")
                        .result(tenant)
                        .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<TenantResponse> updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody TenantRequest request
    ) {
        TenantResponse response = tenantService.updateTenant(id, request);
        return ApiResponse.<TenantResponse>builder()
                        .code(200)
                        .message("Tenant updated  successfully")
                        .result(response)
                        .build();

    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Tenant deleted successfully")
                        .result(null)
                        .build();
    }



    @GetMapping("/all")
    public ApiResponse<List<TenantResponse>> getAllTenants() {
        List<TenantResponse> responses = tenantService.getTenants();
        return ApiResponse.<List<TenantResponse>>builder()
                        .code(200)
                        .message("Get all tenants successfully")
                        .result(responses)
                        .build();
    }
    @GetMapping("/available")
    public ApiResponse<List<TenantResponse>> getTenants() {
        List<TenantResponse> responses = tenantService.getAvailableTenants();
        return ApiResponse.<List<TenantResponse>>builder()
                .code(200)
                .message("Get available tenants successfully")
                .result(responses)
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<TenantResponse>> getTenants(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TenantStatus status,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        PageResponse<TenantResponse> tenants = tenantService.getTenants(keyword, status, page, size);
        return ApiResponse.<PageResponse<TenantResponse>>builder()
                        .code(200)
                        .message("Get tenants successfully")
                        .result(tenants)
                        .build();
    }
    @GetMapping("/dashboard")
    public ApiResponse<TenantDashboardResponse> getTenantDashboard() {
        TenantDashboardResponse dashboard = tenantService.getTenantDashboard();
        return ApiResponse.<TenantDashboardResponse>builder()
                .code(200)
                .message("Get tenant dashboard successfully")
                .result(dashboard)
                .build();
    }
}

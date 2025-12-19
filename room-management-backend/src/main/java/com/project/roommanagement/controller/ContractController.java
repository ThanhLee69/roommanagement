package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.ContractRequest;
import com.project.roommanagement.dto.response.*;
import com.project.roommanagement.enums.ContractStatus;
import com.project.roommanagement.service.ContractService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
@Slf4j(topic = "CONTRACT-CONTROLLER")
@Validated
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    public ApiResponse<PageResponse<ContractResponse>> getContracts(
                                          @RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) ContractStatus status,
                                          @RequestParam(required = false) Long buildingId,
                                          @RequestParam(required = false) Long roomId,
                                          @RequestParam(defaultValue = "1") @Min(1) Integer page,
                                          @RequestParam(defaultValue = "10") @Min(1) @Max(100) Integer size) {


        PageResponse<ContractResponse> contracts =
                contractService.getContracts(keyword, status, buildingId, roomId, page, size);

        return ApiResponse.<PageResponse<ContractResponse>>builder()
                        .code(200)
                        .message("Get contracts successfully")
                        .result(contracts)
                        .build();
    }
    @GetMapping("/active")
    public ApiResponse<List<ContractResponse>> getActiveNewest() {
        List<ContractResponse> contracts = contractService.getActiveContracts();
        return ApiResponse.<List<ContractResponse>>builder()
                        .code(200)
                        .message("Get contracts active successfully")
                        .result(contracts)
                        .build();
    }

    @PostMapping
    public ApiResponse<ContractResponse>createContract(@Valid @RequestBody ContractRequest request) {
        ContractResponse contract = contractService.createContract(request);
        return ApiResponse.<ContractResponse>builder()
                        .code(201)
                        .message("Contract created successfully")
                        .result(contract)
                        .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ContractResponse> updateContract(@PathVariable Long id,@RequestBody ContractRequest request) {
        ContractResponse contract = contractService.updateContract(id,request);
        return ApiResponse.<ContractResponse>builder()
                        .code(200)
                        .message("Contract updated successfully")
                        .result(contract)
                        .build();
    }

    @GetMapping("/dashboard")
    public ApiResponse<ContractDashboardResponse> getContractDashboard() {
        ContractDashboardResponse dashboard = contractService.getContractDashboard();
        return ApiResponse.<ContractDashboardResponse>builder()
                .code(200)
                .message("Get contract dashboard successfully")
                .result(dashboard)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Contract deleted successfully")
                .build();
    }
}

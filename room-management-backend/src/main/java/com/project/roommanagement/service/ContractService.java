package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.ContractRequest;
import com.project.roommanagement.dto.response.ContractDashboardResponse;
import com.project.roommanagement.dto.response.ContractResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.enums.ContractStatus;

import java.util.List;


public interface ContractService {

    ContractResponse createContract (ContractRequest contractRequest);

    ContractResponse updateContract (Long id, ContractRequest contractRequest);

    PageResponse<ContractResponse> getContracts(String keyword, ContractStatus status,Long buildingId,Long roomId, int page, int size);

    List<ContractResponse> getActiveContracts();

    ContractDashboardResponse getContractDashboard();

    void deleteContract(Long id);
}

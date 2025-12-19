package com.project.roommanagement.service;


import com.project.roommanagement.dto.request.ServiceRequest;
import com.project.roommanagement.dto.response.ServiceResponse;

import java.util.List;

public interface ServiceService {

    ServiceResponse createService(ServiceRequest request);

    ServiceResponse updateService(Long id, ServiceRequest request);

    void deleteService(Long id);
    List<ServiceResponse> getServices();
}

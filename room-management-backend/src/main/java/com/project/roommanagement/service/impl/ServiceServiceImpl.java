package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.ServiceRequest;
import com.project.roommanagement.dto.response.ServiceResponse;
import com.project.roommanagement.entity.Services;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.ServiceMapper;
import com.project.roommanagement.repository.ServiceRepository;
import com.project.roommanagement.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    private final ServiceMapper serviceMapper;

    @Override
    public ServiceResponse createService(ServiceRequest request) {
       Services service = serviceMapper.toService(request);

       serviceRepository.save(service);

        return serviceMapper.toServiceResponse(service);
    }

    @Override
    public ServiceResponse updateService(Long id, ServiceRequest request) {

        Services service = serviceRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SERVICE_NOT_FOUND));

        serviceMapper.updateService(service, request);

        serviceRepository.save(service);

        return serviceMapper.toServiceResponse(service);
    }

    @Override
    public void deleteService(Long id) {
        Services service = serviceRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        serviceRepository.delete(service);
    }

    @Override
    public List<ServiceResponse> getServices() {

        List<Services> services = serviceRepository.findAll();

        return services.stream()
                .map(serviceMapper::toServiceResponse)
                .toList();
    }
}

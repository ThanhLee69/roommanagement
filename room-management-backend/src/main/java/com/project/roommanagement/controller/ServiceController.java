package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.ServiceRequest;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.ServiceResponse;
import com.project.roommanagement.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
@Slf4j(topic = "SERVICE-CONTROLLER")
@Validated
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping
    public ApiResponse<ServiceResponse> createdService(
            @Valid @RequestBody ServiceRequest request) {

        ServiceResponse service = serviceService.createService(request);

        return ApiResponse.<ServiceResponse>builder()
                        .code(201)
                        .message("Service created successfully")
                        .result(service)
                        .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceResponse> updatedService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {

        ServiceResponse service = serviceService.updateService(id,request);

        return ApiResponse.<ServiceResponse>builder()
                        .code(200)
                        .message("Service updated successfully")
                        .result(service)
                        .build();
    }


    @GetMapping
    public ApiResponse<List<ServiceResponse>> getServices() {

        List<ServiceResponse> services =
                serviceService.getServices();

        return ApiResponse.<List<ServiceResponse>>builder()
                        .code(200)
                        .message("Success")
                        .result(services)
                        .build();
    }


    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);

        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Services deleted successfully")
                        .build();
    }
}

package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.ServiceRequest;
import com.project.roommanagement.dto.response.ServiceResponse;
import com.project.roommanagement.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceMapper {


    Services toService(ServiceRequest request);

    ServiceResponse toServiceResponse(Services service);

    @Mapping(target = "id", ignore = true)
    void updateService(@MappingTarget Services service, ServiceRequest request);
}

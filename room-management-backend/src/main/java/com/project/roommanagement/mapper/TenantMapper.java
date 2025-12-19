package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.TenantRequest;
import com.project.roommanagement.dto.response.TenantResponse;
import com.project.roommanagement.entity.Tenant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TenantMapper {

    Tenant toTenant(TenantRequest tenantRequest);

    @Mapping(target = "roomName", expression = "java(tenant.getContract() != null ? tenant.getContract().getRoom().getName() : null)")
    @Mapping(target = "buildingName", expression = "java(tenant.getContract() != null ? tenant.getContract().getRoom().getBuilding().getName() : null)")
    TenantResponse toTenantResponse(Tenant tenant);

    @Mapping(target = "id", ignore = true)
    void updateTenant(@MappingTarget Tenant tenant, TenantRequest tenantRequest);
}

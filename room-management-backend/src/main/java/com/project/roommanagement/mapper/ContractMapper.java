package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.ContractRequest;
import com.project.roommanagement.dto.response.ContractItemResponse;
import com.project.roommanagement.dto.response.ContractResponse;
import com.project.roommanagement.entity.Contract;
import com.project.roommanagement.entity.ContractItem;
import com.project.roommanagement.entity.Room;
import com.project.roommanagement.entity.Tenant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    Contract toContract(ContractRequest contractRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    void updateContract(@MappingTarget Contract contract, ContractRequest contractRequest);


    @Mapping(target = "room", source = "room")
    @Mapping(target = "tenant", source = "tenant")
    @Mapping(target = "contractItems", ignore = true)
    ContractResponse toContractResponse(Contract contract);

     default ContractResponse.RoomResponse mapRoom(Room room) {
        if (room == null) return null;
        return new ContractResponse.RoomResponse(room.getId(), room.getName());
    }

     default ContractResponse.TenantResponse mapTenant(Tenant tenant) {
        if (tenant == null) return null;
        return new ContractResponse.TenantResponse(tenant.getId(), tenant.getFullName());
    }

    default ContractItemResponse mapItemResponse(ContractItem item) {
        if (item == null) return null;

        ContractItemResponse response = new ContractItemResponse();
        response.setId(item.getId());
        response.setServiceId(item.getService().getId());
        response.setName(item.getService().getName());
        response.setPrice(item.getPrice());

        return response;
    }
    default ContractResponse mapContractWithItems(Contract contract) {
        ContractResponse response = toContractResponse(contract);

        if (contract.getContractItems() != null) {
            List<ContractItemResponse> items = contract.getContractItems()
                    .stream()
                    .map(this::mapItemResponse)
                    .collect(Collectors.toList());

            response.setContractItems(items);
        }

        return response;
    }
}

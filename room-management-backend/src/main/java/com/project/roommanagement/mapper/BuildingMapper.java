package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.AmenityRequest;
import com.project.roommanagement.dto.request.BuildingRequest;
import com.project.roommanagement.dto.response.BuildingResponse;
import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.entity.Building;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BuildingMapper {

    @Mapping(target = "amenities", ignore = true)
    Building toBuilding(BuildingRequest buildingRequest);

    @Mapping(target = "amenityNames", expression = "java(mapAmenitiesToNames(building.getAmenities()))")
    @Mapping(target = "totalRooms", ignore = true)
    BuildingResponse toBuildingResponse(Building building);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    void updateBuilding(@MappingTarget Building building, BuildingRequest request);

    default Set<String> mapAmenitiesToNames(Set<Amenity> amenities) {
        if (amenities == null) return null;
        return amenities.stream()
                .map(Amenity::getName)
                .collect(Collectors.toSet());
    }
}

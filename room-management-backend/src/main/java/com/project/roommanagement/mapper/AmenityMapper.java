package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.AmenityRequest;
import com.project.roommanagement.dto.response.AmenityResponse;
import com.project.roommanagement.entity.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AmenityMapper {

    Amenity toAmenity(AmenityRequest amenityRequest);

    @Mapping(target = "id", ignore = true)
    void updateAmenity(@MappingTarget Amenity amenity, AmenityRequest request);

    AmenityResponse  toAmenityResponse(Amenity amenity);
}

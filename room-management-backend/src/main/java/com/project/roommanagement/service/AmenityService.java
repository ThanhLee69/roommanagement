package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.AmenityRequest;
import com.project.roommanagement.dto.response.AmenityResponse;
import com.project.roommanagement.enums.AmenityScope;

import java.util.List;

public interface AmenityService {

    AmenityResponse createAmenity(AmenityRequest amenityRequest);

    AmenityResponse updateAmenity(Long id, AmenityRequest amenityRequest);

    List<AmenityResponse> getAmenitiesForBuilding();

    List<AmenityResponse> getAmenitiesForRoom();

    List<AmenityResponse> getAmenities();

    void deleteAmenity(Long id);
}

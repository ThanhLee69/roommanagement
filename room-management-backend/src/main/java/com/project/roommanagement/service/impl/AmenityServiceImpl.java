package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.AmenityRequest;
import com.project.roommanagement.dto.response.AmenityResponse;
import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.enums.AmenityScope;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.AmenityMapper;
import com.project.roommanagement.repository.AmenityRepository;
import com.project.roommanagement.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;

    @Override
    public AmenityResponse createAmenity(AmenityRequest amenityRequest) {
        Amenity amenity =amenityMapper.toAmenity(amenityRequest);
        amenityRepository.save(amenity);

        return amenityMapper.toAmenityResponse(amenity);
    }

    @Override
    public AmenityResponse updateAmenity(Long id,AmenityRequest amenityRequest) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.AMENITY_NOT_FOUND));

        amenityMapper.updateAmenity(amenity,amenityRequest);

        amenityRepository.save(amenity);

        return amenityMapper.toAmenityResponse(amenity);
    }

    @Override
    public List<AmenityResponse> getAmenitiesForBuilding() {
        List<Amenity> amenities = amenityRepository.findByScopeIn(
                List.of(AmenityScope.BUILDING, AmenityScope.BOTH));

        return amenities.stream().map(
                amenityMapper::toAmenityResponse).toList();
    }

    @Override
    public List<AmenityResponse> getAmenitiesForRoom() {
        List<Amenity> amenities = amenityRepository.findByScopeIn(
                List.of(AmenityScope.ROOM, AmenityScope.BOTH));

        return amenities.stream().map(
                amenityMapper::toAmenityResponse).toList();
    }

    @Override
    public List<AmenityResponse> getAmenities() {

        List<Amenity> amenities = amenityRepository.findAll();

        return amenities.stream().map(
                amenityMapper::toAmenityResponse).toList();
    }

    @Override
    public void deleteAmenity(Long id) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.AMENITY_NOT_FOUND));
        amenityRepository.delete(amenity);

    }
}

package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.BuildingRequest;
import com.project.roommanagement.dto.response.BuildingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.RoomResponse;
import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.entity.Building;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.BuildingMapper;
import com.project.roommanagement.repository.AmenityRepository;
import com.project.roommanagement.repository.BuildingRepository;
import com.project.roommanagement.repository.RoomRepository;
import com.project.roommanagement.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BuildingServiceImpl implements BuildingService {


    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;

    private final AmenityRepository amenityRepository;

    private  final BuildingMapper buildingMapper;

    @Override
    public BuildingResponse createBuilding(BuildingRequest request) {

        Building building = buildingMapper.toBuilding(request);

        var amenities = amenityRepository.findAllById(request.getAmenityIds());

        Set<Amenity> amenitySet = new HashSet<>(amenities);

        building.setAmenities(amenitySet);

        buildingRepository.save(building);

        return buildingMapper.toBuildingResponse(building);
    }

    @Override
    public PageResponse<BuildingResponse> getBuildings(String keyword, int page, int size) {

        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        var buildingPage =  buildingRepository.searchByKeyword(keyword,pageRequest);

        List<BuildingResponse> content = buildingPage.stream()
                .map(building -> {
                    BuildingResponse response = buildingMapper.toBuildingResponse(building);
                    long totalRooms = roomRepository.countByBuildingId(building.getId());
                    response.setTotalRooms(totalRooms);
                    return response;
                })
                .collect(Collectors.toList());

        return PageResponse.<BuildingResponse>builder()
                .items(content)
                .currentPage(buildingPage.getNumber() + 1)
                .pageSize(buildingPage.getSize())
                .totalItems(buildingPage.getTotalElements())
                .totalPages(buildingPage.getTotalPages())
                .build();
    }

    @Override
    public List<BuildingResponse> getBuildings() {

        List<Building> buildings = buildingRepository.findAll();

        return buildings.stream()
                .map(buildingMapper::toBuildingResponse)
                .collect(Collectors.toList());
    }


    @Override
    public BuildingResponse updateBuilding(Long id, BuildingRequest request) {

        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        buildingMapper.updateBuilding(building,request);

        var amenities = amenityRepository.findAllById(request.getAmenityIds());

        Set<Amenity> amenitySet = new HashSet<>(amenities);

        building.setAmenities(amenitySet);

        buildingRepository.save(building);

        return buildingMapper.toBuildingResponse(building);
    }

    @Override
    public void deleteBuilding(Long id) {

        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        buildingRepository.deleteById(id);
    }
}

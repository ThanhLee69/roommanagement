package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.BuildingRequest;
import com.project.roommanagement.dto.response.BuildingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface     BuildingService {

    BuildingResponse createBuilding(BuildingRequest request);

    PageResponse<BuildingResponse> getBuildings(String keyword,int page, int size);

    List<BuildingResponse> getBuildings();

    BuildingResponse updateBuilding(Long id, BuildingRequest request);

    void deleteBuilding(Long id);
}

package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.BuildingRequest;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.BuildingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.service.BuildingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
@Slf4j(topic = "BUILDING-CONTROLLER")
@Validated
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public ApiResponse<BuildingResponse> createBuilding(
            @Valid @RequestBody BuildingRequest request) {

        BuildingResponse building = buildingService.createBuilding(request);

        return ApiResponse.<BuildingResponse>builder()
                        .code(201)
                        .message("Building created successfully")
                        .result(building)
                        .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BuildingResponse> updateBuilding(
            @PathVariable Long id,
            @Valid @RequestBody BuildingRequest request) {

        BuildingResponse building = buildingService.updateBuilding(id, request);

        return ApiResponse.<BuildingResponse>builder()
                        .code(200)
                        .message("Building updated successfully")
                        .result(building)
                        .build();

    }
    @GetMapping
    public ApiResponse<PageResponse<BuildingResponse>> getBuildings(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1)  @Max(100) int size
    ) {

        PageResponse<BuildingResponse> buildings =
                buildingService.getBuildings(keyword,page,size);

        return ApiResponse.<PageResponse<BuildingResponse>>builder()
                        .code(200)
                        .message("Get buildings successfully")
                        .result(buildings)
                        .build();

    }
    @GetMapping("/all")
    public ApiResponse<List<BuildingResponse>> getBuildings() {

        List<BuildingResponse> response =
                buildingService.getBuildings();

        return ApiResponse.<List<BuildingResponse>>builder()
                        .code(200)
                        .message("Get buildings successfully")
                        .result(response)
                        .build();

    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBuilding(@PathVariable Long id) {

        buildingService.deleteBuilding(id);

        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Building deleted successfully")
                        .build();

    }
}

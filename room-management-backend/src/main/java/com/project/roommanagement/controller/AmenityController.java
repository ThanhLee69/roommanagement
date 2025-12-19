package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.AmenityRequest;
import com.project.roommanagement.dto.response.AmenityResponse;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.service.AmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/amenities")
@RequiredArgsConstructor
@Slf4j(topic = "AMENITY-CONTROLLER")
@Validated
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping()
    public ApiResponse<AmenityResponse> createAmenity(@Valid @RequestBody AmenityRequest request) {

        AmenityResponse amenity = amenityService.createAmenity(request);

        return ApiResponse.<AmenityResponse>builder()
                        .code(201)
                        .message("Amenity created successfully")
                        .result(amenity)
                        .build();

    }

    @PutMapping("/{id}")
    public ApiResponse<AmenityResponse> updateAmenity(
            @PathVariable Long id,
            @Valid @RequestBody AmenityRequest request) {

        AmenityResponse response = amenityService.updateAmenity(id, request);

        return ApiResponse.<AmenityResponse>builder()
                        .code(200)
                        .message("Amenity updated successfully")
                        .result(response)
                        .build();

    }

    @GetMapping
    public ApiResponse<List<AmenityResponse>> getAmenities() {

        List<AmenityResponse> amenities = amenityService.getAmenities();

        return ApiResponse.<List<AmenityResponse>>builder()
                .code(200)
                .message("Get amenities successfully")
                .result(amenities)
                .build();

    }
    @GetMapping("/building")
    public ApiResponse<List<AmenityResponse>> getBuildingAmenities() {
        List<AmenityResponse> amenities = amenityService.getAmenitiesForBuilding();

        return ApiResponse.<List<AmenityResponse>>builder()
                .code(200)
                .message("Get building amenities successfully")
                .result(amenities)
                .build();
    }

    @GetMapping("/room")
    public ApiResponse<List<AmenityResponse>> getRoomAmenities() {
        List<AmenityResponse> amenities = amenityService.getAmenitiesForRoom();

        return ApiResponse.<List<AmenityResponse>>builder()
                .code(200)
                .message("Get room amenities successfully")
                .result(amenities)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAmenity(@PathVariable Long id) {

        amenityService.deleteAmenity(id);

        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Amenity deleted successfully")
                        .build();

    }
}

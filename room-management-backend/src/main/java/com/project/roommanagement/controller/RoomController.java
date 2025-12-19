package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.RoomRequest;
import com.project.roommanagement.dto.response.*;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import com.project.roommanagement.service.RoomService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Slf4j(topic = "ROOM-CONTROLLER")
@Validated
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ApiResponse<RoomResponse> createdRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse roomResponse = roomService.createRoom(request);
        return ApiResponse.<RoomResponse>builder()
                        .code(200)
                        .message("Created successfully")
                        .result(roomResponse)
                        .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomResponse> updatedRoom(@PathVariable Long id,@Valid @RequestBody RoomRequest request) {

        RoomResponse room = roomService.updateRoom(id, request);
        return ApiResponse.<RoomResponse>builder()
                        .code(200)
                        .message("Room updated successfully")
                        .result(room)
                        .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<RoomResponse>> getRooms(
                                                            @RequestParam(required = false) String keyword,
                                                            @RequestParam(required = false) RoomType roomType,
                                                            @RequestParam(required = false) RoomStatus status,
                                                            @RequestParam(required = false) Long buildingId,
                                                            @RequestParam(defaultValue = "1") @Min(1) int page,
                                                            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {

        PageResponse<RoomResponse> rooms = roomService.getRooms(keyword, roomType, status, buildingId, page, size);

        return ApiResponse.<PageResponse<RoomResponse>>builder()
                        .code(200)
                        .message("Get rooms successfully")
                        .result(rooms)
                        .build();


    }
    @GetMapping("/available")
    public ApiResponse<List<RoomResponse>> getAvailableRooms() {

        List<RoomResponse> rooms = roomService.getAvailableRooms();

        return ApiResponse.<List<RoomResponse>>builder()
                        .code(200)
                        .message("Get available room successfully ")
                        .result(rooms)
                        .build();

    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Room deleted successfully")
                        .build();
    }

    @GetMapping("/code/{code}")
    public ApiResponse<RoomResponse> getRoomByName(@PathVariable("code") String code) {
        RoomResponse room = roomService.getRoomByCode(code);
        return ApiResponse.<RoomResponse>builder()
                .code(200)
                .message("Get  room successfully ")
                .result(room)
                .build();
    }

    @GetMapping("/dashboard")
    public ApiResponse<RoomDashboardResponse> getRoomDashboard() {
        RoomDashboardResponse dashboard = roomService.getRoomDashboard();
        return ApiResponse.<RoomDashboardResponse>builder()
                .code(200)
                .message("Get rooms dashboard successfully")
                .result(dashboard)
                .build();
    }
}

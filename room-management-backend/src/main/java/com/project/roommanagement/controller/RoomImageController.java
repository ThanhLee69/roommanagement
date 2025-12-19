package com.project.roommanagement.controller;

import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.RoomImageResponse;
import com.project.roommanagement.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room-images")
@Slf4j(topic = "IMAGE-CONTROLLER")
@Validated
public class RoomImageController {

    private final RoomImageService roomImageService;

    @PostMapping("/upload/{roomId}")
    public ApiResponse<List<RoomImageResponse>> uploadRoomImages(
            @PathVariable Long roomId,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        List<RoomImageResponse> roomImages = roomImageService.uploadRoomImage(roomId, files);

        return ApiResponse.<List<RoomImageResponse>>builder()
                        .code(201)
                        .message("Upload images successfully")
                        .result(roomImages)
                        .build();
    }

    @GetMapping("/room/{roomId}")
    public ApiResponse<List<RoomImageResponse>> getImagesByRoom(
            @PathVariable Long roomId
    ) {

        List<RoomImageResponse> images = roomImageService.getImagesByRoom(roomId);

        return ApiResponse.<List<RoomImageResponse>>builder()
                        .code(200)
                        .message("Get room images successfully")
                        .result(images)
                        .build();
    }


    @DeleteMapping("/{imageIds}")
    public ApiResponse<Void> deleteRoomImage(
            @PathVariable List<Long> imageIds
    ) throws IOException {

        roomImageService.deleteRoomImages(imageIds);
        return ApiResponse.<Void>builder()
                        .code(200)
                        .message("Image deleted successfully")
                        .build();

    }
}

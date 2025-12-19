package com.project.roommanagement.service;

import com.project.roommanagement.dto.response.RoomImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RoomImageService {

    List<RoomImageResponse> uploadRoomImage(Long roomId, List<MultipartFile> fileList) throws IOException;

    void deleteRoomImages(List<Long> imageIds) throws IOException;

    List<RoomImageResponse> getImagesByRoom(Long roomId);
}

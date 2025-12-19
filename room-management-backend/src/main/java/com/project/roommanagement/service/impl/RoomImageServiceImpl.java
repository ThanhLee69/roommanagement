package com.project.roommanagement.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.RoomImageRequest;
import com.project.roommanagement.dto.response.RoomImageResponse;
import com.project.roommanagement.entity.Room;
import com.project.roommanagement.entity.RoomImage;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.RoomImageMapper;
import com.project.roommanagement.repository.RoomImageRepository;
import com.project.roommanagement.repository.RoomRepository;
import com.project.roommanagement.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomImageServiceImpl implements RoomImageService {

    private final Cloudinary cloudinary;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    private final RoomImageMapper roomImageMapper;

    @Override
    public List<RoomImageResponse> uploadRoomImage(Long roomId, List<MultipartFile> fileList)
            throws IOException {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        List<RoomImage> savedImages = new ArrayList<>();

        for (MultipartFile file : fileList) {

            String publicId = "rooms/room_" + UUID.randomUUID();

            var uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "overwrite", true,
                            "resource_type", "image"
                    )
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            RoomImage image = RoomImage.builder()
                    .room(room)
                    .publicId(publicId)
                    .imageUrl(imageUrl)
                    .build();

            roomImageRepository.save(image);
            savedImages.add(image);
        }

        return roomImageMapper.toResponseList(savedImages);
    }

    @Override
    public void deleteRoomImages(List<Long> imageIds) throws IOException {
        List<RoomImage> images = roomImageRepository.findAllById(imageIds);

        if (images.isEmpty()) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }

        for (RoomImage img : images) {
            try {
                cloudinary.uploader().destroy(img.getPublicId(), ObjectUtils.asMap(
                        "resource_type", "image"
                ));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        roomImageRepository.deleteAll(images);
    }
    @Override
    public List<RoomImageResponse> getImagesByRoom(Long roomId) {
        return roomImageRepository.findByRoomId(roomId)
                .stream()
                .map(roomImageMapper::toRoomImageResponse)
                .collect(Collectors.toList());
    }
}

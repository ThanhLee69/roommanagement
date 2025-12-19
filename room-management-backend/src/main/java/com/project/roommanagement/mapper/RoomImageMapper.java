package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.RoomImageRequest;
import com.project.roommanagement.dto.response.RoomImageResponse;

import com.project.roommanagement.entity.RoomImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoomImageMapper {

    RoomImageResponse toRoomImageResponse(RoomImage image);

    default List<RoomImageResponse> toResponseList(List<RoomImage> images) {
        return images.stream()
                .map(this::toRoomImageResponse)
                .collect(Collectors.toList());
    }

}

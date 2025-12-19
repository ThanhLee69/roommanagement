package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.RoomRequest;
import com.project.roommanagement.dto.response.RoomImageResponse;
import com.project.roommanagement.dto.response.RoomResponse;
import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.entity.Room;
import com.project.roommanagement.entity.RoomImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "building", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    Room toRoom(RoomRequest roomRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "building", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    void updateRoom(@MappingTarget Room room, RoomRequest roomRequest);

    @Mapping(target = "buildingName", expression = "java(room.getBuilding() != null ? room.getBuilding().getName() : null)")
    @Mapping(target = "amenityNames", expression = "java(mapAmenitiesToNames(room.getAmenities()))")
    @Mapping(target = "images", expression = "java(mapImagesToResponses(room.getImages()))")
    RoomResponse toRoomResponse(Room room);

    default Set<String> mapAmenitiesToNames(Set<Amenity> amenities) {
        if (amenities == null) return Set.of();
        return amenities.stream().map(Amenity::getName).collect(Collectors.toSet());
    }

    default List<RoomImageResponse> mapImagesToResponses(Set<RoomImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(img -> new RoomImageResponse(img.getId(), img.getImageUrl()))
                .collect(Collectors.toList());
    }
}


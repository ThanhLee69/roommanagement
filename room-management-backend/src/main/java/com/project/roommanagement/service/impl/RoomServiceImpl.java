package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.RoomRequest;
import com.project.roommanagement.dto.response.BuildingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.RoomDashboardResponse;
import com.project.roommanagement.dto.response.RoomResponse;
import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.entity.Building;
import com.project.roommanagement.entity.Room;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.RoomMapper;
import com.project.roommanagement.repository.AmenityRepository;
import com.project.roommanagement.repository.BuildingRepository;
import com.project.roommanagement.repository.RoomRepository;
import com.project.roommanagement.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final AmenityRepository amenityRepository;
    private final BuildingRepository buildingRepository;

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest) {

        Room  room = roomMapper.toRoom(roomRequest);

        var building = buildingRepository.findById(roomRequest.getBuildingId())
                .orElseThrow(()->new AppException(ErrorCode.BUILDING_NOT_FOUND));
        room.setBuilding(building);

        Set<Amenity> amenitySet = new HashSet<>(amenityRepository.findAllById(roomRequest.getAmenityIds()));
        room.setAmenities(amenitySet);

        roomRepository.save(room);

        return roomMapper.toRoomResponse(room);
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest roomRequest) {

        Room room = roomRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.AMENITY_NOT_FOUND));

        roomMapper.updateRoom(room, roomRequest);

        Building building = buildingRepository.findById(roomRequest.getBuildingId())
                .orElseThrow(()->new AppException(ErrorCode.BUILDING_NOT_FOUND));

        room.setBuilding(building);

        Set<Amenity> amenitySet = new HashSet<>(amenityRepository.findAllById(roomRequest.getAmenityIds()));
        room.setAmenities(amenitySet);

        roomRepository.save(room);

        return roomMapper.toRoomResponse(room);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.AMENITY_NOT_FOUND));
        roomRepository.delete(room);
    }

    @Override
    public PageResponse<RoomResponse> getRooms(String keyword,
                                               RoomType roomType,
                                               RoomStatus status,
                                               Long buildingId,
                                               int page,
                                               int size) {

        PageRequest  pageRequest = PageRequest.of(page - 1,size , Sort.by("createdAt").descending());

        var roomPage = roomRepository.searchRooms(
                keyword,
                roomType,
                status,
                buildingId,
                pageRequest);

        var content = roomPage.map(roomMapper::toRoomResponse).getContent();

        return PageResponse.<RoomResponse>builder()
                .items(content)
                .currentPage(roomPage.getNumber()+1)
                .pageSize(roomPage.getSize())
                .totalItems(roomPage.getTotalElements())
                .totalPages(roomPage.getTotalPages())
                .build();
    }

    @Override
    public List<RoomResponse> getAvailableRooms() {

        List<Room>  rooms = roomRepository.findByStatus(RoomStatus.AVAILABLE);

        return rooms.stream()
                .map(roomMapper::toRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomByCode(String code) {

        Room room = roomRepository.findByName(code)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return roomMapper.toRoomResponse(room);
    }

    @Override
    public RoomDashboardResponse getRoomDashboard() {
        long totalRooms = roomRepository.countAllRooms();
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long maintenanceRooms = roomRepository.countByStatuses(new RoomStatus[]{RoomStatus.MAINTENANCE, RoomStatus.CLOSED});

        return RoomDashboardResponse.builder()
                .totalRooms(totalRooms)
                .availableRooms(availableRooms)
                .occupiedRooms(occupiedRooms)
                .maintenanceRooms(maintenanceRooms)
                .build();
    }

}

package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.RoomRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.RoomDashboardResponse;
import com.project.roommanagement.dto.response.RoomResponse;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomService {

    RoomResponse createRoom(RoomRequest roomRequest);

    RoomResponse updateRoom(Long id,RoomRequest roomRequest);

    void deleteRoom(Long id);

    PageResponse<RoomResponse> getRooms(String keyword, RoomType roomType, RoomStatus status,Long buildingId, int page, int size);

    List<RoomResponse> getAvailableRooms();

    RoomResponse getRoomByCode(String code);

    RoomDashboardResponse getRoomDashboard();
}

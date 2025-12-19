package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.MeterReadingRequest;
import com.project.roommanagement.dto.response.MeterReadingResponse;
import com.project.roommanagement.dto.response.PageResponse;

public interface MeterReadingService {
    PageResponse<MeterReadingResponse> getAll(
            String keyword, Long roomId, int month, int year,int page, int size
    );

//    MeterReadingResponse getById(Long id);

    MeterReadingResponse create(MeterReadingRequest request);

    MeterReadingResponse update(Long id, MeterReadingRequest request);

    void delete(Long id);

    MeterReadingResponse getByRoomAndMonthYear(Long roomId, int month, int year);

    MeterReadingResponse getLatestByRoom(Long roomId);

    boolean existsByRoomMonthYear(Long roomId, int month, int year);
}

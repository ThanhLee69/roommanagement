package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.MeterReadingRequest;
import com.project.roommanagement.dto.response.MeterReadingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.entity.MeterReading;
import com.project.roommanagement.entity.Room;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.MeterReadingMapper;
import com.project.roommanagement.repository.MeterReadingRepository;
import com.project.roommanagement.repository.RoomRepository;
import com.project.roommanagement.service.MeterReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeterReadingServiceImpl implements MeterReadingService {

    private final MeterReadingRepository meterReadingRepository;
    private final RoomRepository roomRepository;
    private final MeterReadingMapper meterReadingMapper;

    @Override
    public PageResponse<MeterReadingResponse> getAll(String keyword, Long roomId, int month, int year,int page, int size) {

        PageRequest pageRequest = PageRequest.of( -1, size, Sort.by("year").descending()
                .and(Sort.by("month").descending()));

        Page<MeterReading> meterReadingPage = meterReadingRepository.searchMeterReadings(keyword,roomId,month,year,pageRequest);

        List<MeterReadingResponse> meterReadingResponses = meterReadingPage.stream()
                .map(meterReadingMapper::toMeterReadingResponse).toList();


        return PageResponse.<MeterReadingResponse>builder()
                .items(meterReadingResponses)
                .pageSize(meterReadingPage.getSize())
                .totalPages(meterReadingPage.getNumber())
                .totalItems(meterReadingPage.getTotalElements())
                .totalPages(meterReadingPage.getTotalPages())
                .build();
    }

    @Override
    public MeterReadingResponse create(MeterReadingRequest request) {

        boolean exists  = meterReadingRepository.existsByRoomIdAndMonthAndYear(request.getRoomId(),request.getMonth(),request.getYear());

        if (exists) {
            throw new RuntimeException("Điện nước tháng này đã tồn tại");
        }
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));


        MeterReading meterReading = meterReadingMapper.toMeterReading(request);
        meterReading.setRoom(room);


        meterReadingRepository.save(meterReading);

        return meterReadingMapper.toMeterReadingResponse(meterReading);
    }

    @Override
    public MeterReadingResponse update(Long id, MeterReadingRequest request) {
        return null;
    }

    @Override
    public void delete(Long id) {
        MeterReading meterReading = meterReadingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ko tim thay id nay"));
        meterReadingRepository.delete(meterReading);
    }

    @Override
    public MeterReadingResponse getByRoomAndMonthYear(Long roomId, int month, int year) {
        Optional<MeterReading> existing =
                meterReadingRepository.findByRoomIdAndMonthAndYear(roomId, month, year);

        if (existing.isPresent()) {
            return meterReadingMapper.toMeterReadingResponse(existing.get());
        }

        MeterReading last =
                meterReadingRepository.findTopByRoomIdOrderByYearDescMonthDesc(roomId)
                        .orElse(null);

        MeterReading meterReading = new MeterReading();

        meterReading.setRoom(roomRepository.getReferenceById(roomId));
        meterReading.setMonth(month);
        meterReading.setYear(year);

        if (last != null) {
            meterReading.setOldElectric(last.getNewElectric());
            meterReading.setOldWater(last.getNewWater());
        } else {
            meterReading.setOldElectric(0);
            meterReading.setOldWater(0);
        }

        meterReading.setNewElectric(meterReading.getOldElectric());
        meterReading.setNewWater(meterReading.getOldWater());

        meterReadingRepository.save(meterReading);

        return meterReadingMapper.toMeterReadingResponse(meterReading);
    }

    @Override
    public MeterReadingResponse getLatestByRoom(Long roomId) {
        return null;
    }

    @Override
    public boolean existsByRoomMonthYear(Long roomId, int month, int year) {
        return false;
    }
}

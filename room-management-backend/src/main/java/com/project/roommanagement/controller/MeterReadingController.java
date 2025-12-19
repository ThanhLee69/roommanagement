package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.MeterReadingRequest;
import com.project.roommanagement.dto.response.ApiResponse;
import com.project.roommanagement.dto.response.MeterReadingResponse;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.service.MeterReadingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meter-readings")
@RequiredArgsConstructor
@Slf4j(topic = "METER-READING-CONTROLLER")
@Validated
public class MeterReadingController {

    private final MeterReadingService meterReadingService;

    @GetMapping
    public ApiResponse<PageResponse<MeterReadingResponse>> getMeterReadings(@RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) long roomId,
                                          @RequestParam(required = false) int month,
                                          @RequestParam(required = false) int year,
                                          @RequestParam(defaultValue = "1") @Min(1) int page,
                                          @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {


        PageResponse<MeterReadingResponse> meterReadings =
                meterReadingService.getAll(keyword, roomId, month, year,page, size);

        return ApiResponse.<PageResponse<MeterReadingResponse>>builder()
                        .code(200)
                        .message("Get meter-readings successfully")
                        .result(meterReadings)
                        .build();
    }

    @GetMapping("/by-room")
    public ApiResponse<MeterReadingResponse> getByRoomAndMonthYear(
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        MeterReadingResponse response =
                meterReadingService.getByRoomAndMonthYear(roomId, month, year);

        return ApiResponse.<MeterReadingResponse>builder()
                        .code(200)
                        .message("Get meter-reading successfully")
                        .result(response)
                        .build();
    }
    @PostMapping
    public ApiResponse<MeterReadingResponse> createMeterReading(@Valid @RequestBody MeterReadingRequest request) {
        log.info("POST /contracts - request={}", request);
        MeterReadingResponse response = meterReadingService.create(request);
        return ApiResponse.<MeterReadingResponse>builder()
                        .code(201)
                        .message("MeterReading created  successfully")
                        .result(response)
                        .build();
    }
}

package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.MeterReadingRequest;
import com.project.roommanagement.dto.response.MeterReadingResponse;
import com.project.roommanagement.entity.MeterReading;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MeterReadingMapper {

    @Mapping(target = "room", ignore = true)
    MeterReading toMeterReading(MeterReadingRequest request);

    @Mapping(target = "id", ignore = true)
    void updatedMeterReading(@MappingTarget MeterReading meterReading, MeterReadingRequest request);

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "electricUsed", expression = "java(entity.getElectricUsed())")
    @Mapping(target = "waterUsed", expression = "java(entity.getWaterUsed())")
    MeterReadingResponse toMeterReadingResponse(MeterReading entity);

}

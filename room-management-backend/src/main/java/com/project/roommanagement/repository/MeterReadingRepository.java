package com.project.roommanagement.repository;

import com.project.roommanagement.entity.MeterReading;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeterReadingRepository extends JpaRepository<MeterReading,Long> {

    Optional<MeterReading> findByRoomIdAndMonthAndYear(Long roomId, Integer month, Integer year);

    Optional<MeterReading> findTopByRoomIdOrderByYearDescMonthDesc(Long roomId);

    List<MeterReading> findByRoomIdOrderByYearDescMonthDesc(Long roomId);

    boolean existsByRoomIdAndMonthAndYear(Long roomId, Integer month, Integer year);


    @Query("""
        SELECT m FROM MeterReading m
        JOIN m.room r
        WHERE
        (:roomId IS NULL OR r.id = :roomId)
        AND (:year IS NULL OR m.year = :year)
        AND (:month IS NULL OR m.month = :month)
        AND (
            :keyword IS NULL OR 
            LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        ORDER BY m.year DESC, m.month DESC
    """)
    Page<MeterReading> searchMeterReadings(
            @Param("keyword") String keyword,
            @Param("roomId") Long roomId,
            @Param("month") Integer month,
            @Param("year") Integer year,
            Pageable pageable
    );
}

package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Room;
import com.project.roommanagement.enums.RoomStatus;
import com.project.roommanagement.enums.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {
    @Query("""
        SELECT r FROM Room r
        WHERE (:keyword IS NULL 
               OR LOWER(r.name) LIKE CONCAT('%', LOWER(:keyword), '%') 
               OR LOWER(r.description) LIKE CONCAT('%', LOWER(:keyword), '%'))
          AND (:roomType IS NULL OR r.roomType = :roomType)
          AND (:status IS NULL OR r.status = :status)
          AND (:buildingId IS NULL OR r.building.id = :buildingId)
    """)
    Page<Room> searchRooms(
            @Param("keyword") String keyword,
            @Param("roomType") RoomType roomType,
            @Param("status") RoomStatus status,
            @Param("buildingId") Long buildingId,
            Pageable pageable
    );

    List<Room> findByStatus(RoomStatus status);

    Optional<Room> findByName(String name);

    long countByBuildingId(Long id);

    @Query("SELECT COUNT(r) FROM Room r")
    long countAllRooms();

    long countByStatus(RoomStatus status);

    @Query("SELECT COUNT(r) FROM Room r WHERE r.status IN :statuses")
    long countByStatuses(RoomStatus[] statuses);
}

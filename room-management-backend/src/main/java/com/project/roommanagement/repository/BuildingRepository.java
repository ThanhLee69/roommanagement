package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    @Query("SELECT b FROM Building b " +
            "WHERE (:keyword IS NULL OR :keyword = '' " +
            "   OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(b.address) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Building> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

}

package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Amenity;
import com.project.roommanagement.enums.AmenityScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AmenityRepository extends JpaRepository<Amenity,Long> {

    List<Amenity> findByScopeIn(List<AmenityScope> scopes);
}

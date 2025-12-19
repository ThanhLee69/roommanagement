package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Contract;
import com.project.roommanagement.enums.ContractStatus;
import com.project.roommanagement.enums.TenantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    @Query("""
    SELECT DISTINCT c
    FROM Contract c
    LEFT JOIN c.tenant t
    LEFT JOIN c.room r
    LEFT JOIN r.building b
    WHERE
        (:keyword IS NULL OR 
            LOWER(c.contractCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    AND (:status IS NULL OR c.status = :status)
    AND (:buildingId IS NULL OR b.id = :buildingId)
    AND (:roomId IS NULL OR r.id = :roomId)
""")
    Page<Contract> findContracts(
            @Param("keyword") String keyword,
            @Param("status") ContractStatus status,
            @Param("buildingId") Long buildingId,
            @Param("roomId") Long roomId,
            Pageable pageable
    );
    List<Contract> findByStatusOrderByCreatedAtDesc(ContractStatus status);

    Long countBy();

    Long countByStatus(ContractStatus status);

    Long countByStatusAndEndDateBetween(ContractStatus status, LocalDate start, LocalDate end);
}

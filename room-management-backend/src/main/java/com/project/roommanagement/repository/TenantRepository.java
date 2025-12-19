package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Tenant;
import com.project.roommanagement.enums.TenantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    @Query("""
                SELECT t FROM Tenant t
                WHERE
                    ( :keyword IS NULL 
                      OR LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                      OR LOWER(t.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
                      OR LOWER(t.cccd) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    )
                AND
                    ( :status IS NULL OR t.status = :status )
            """)
    Page<Tenant> searchTenant(
            @Param("keyword") String keyword,
            @Param("status") TenantStatus status,
            Pageable pageable
    );

    @Query("SELECT COUNT(t) FROM Tenant t")
    long countAllTenants();

    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = 'RENTING'")
    long countRentingTenants();

    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = 'CHECKED_OUT'")
    long countCheckedOutTenants();

    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = 'NOT_RENTED'")
    long countNotRentedTenants();

    List<Tenant> findByStatusIn(List<TenantStatus> statuses);
}

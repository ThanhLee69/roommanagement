package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Invoice;
import com.project.roommanagement.enums.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT i FROM Invoice i " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(i.tenantName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.roomName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.contractCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.invoiceCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:month IS NULL OR i.month = :month) " +
            "AND (:year IS NULL OR i.year = :year) " +
            "AND (:status IS NULL OR i.invoiceStatus = :status) " +
            "AND (:dueDateFrom IS NULL OR i.dueDate >= :dueDateFrom) " +
            "AND (:dueDateTo IS NULL OR i.dueDate <= :dueDateTo)")
    Page<Invoice> filterInvoices(
            @Param("keyword") String keyword,
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("status") InvoiceStatus status,
            @Param("dueDateFrom") LocalDate dueDateFrom,
            @Param("dueDateTo") LocalDate dueDateTo,
            Pageable pageable
    );

    @Query("""
                SELECT COUNT(i) FROM Invoice i
            """)
    Long countAll();

    @Query("""
                SELECT COUNT(i) FROM Invoice i WHERE i.invoiceStatus = 'UNPAID'
            """)
    Long countUnpaid();

    @Query("""
                SELECT COUNT(i) FROM Invoice i WHERE i.invoiceStatus = 'PAID'
            """)
    Long countPaid();

    @Query("""
                SELECT COUNT(i) FROM Invoice i 
                WHERE i.invoiceStatus = 'UNPAID' AND i.dueDate < CURRENT_DATE
            """)
    Long countOverdue();

    @Query("""
                SELECT COALESCE(SUM(i.remainingAmount),0) 
                FROM Invoice i 
                WHERE i.invoiceStatus = 'UNPAID'
            """)
    Double totalOutstanding();

    @Query("""
                SELECT i FROM Invoice i
                WHERE i.invoiceStatus IN ('UNPAID', 'PARTIALLY_PAID', 'OVERDUE')
            """)
    List<Invoice> findAllInvoicesForPayment();
}

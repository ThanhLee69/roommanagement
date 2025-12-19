package com.project.roommanagement.repository;

import com.project.roommanagement.entity.Payment;
import com.project.roommanagement.enums.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

//       @Query("SELECT COALESCE(SUM(p.paymentAmount),0) FROM Payment p WHERE p.invoice.id = :invoiceId")
//    BigDecimal sumByInvoiceId(@Param("invoiceId") Long invoiceId);
//
    List<Payment> findByInvoiceId(Long invoiceId);

    @Query("""
        SELECT p FROM Payment p
        JOIN p.invoice i
        WHERE
            (:keyword IS NULL 
                OR i.invoiceCode LIKE %:keyword%
                OR p.note LIKE %:keyword%)
        AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
        AND (:dateFrom IS NULL OR p.paymentDate >= :dateFrom)
        AND (:dateTo IS NULL OR p.paymentDate <= :dateTo)
    """)
    Page<Payment> searchPayments(
            @Param("keyword") String keyword,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable
    );
}

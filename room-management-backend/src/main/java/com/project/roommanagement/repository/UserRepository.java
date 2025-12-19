package com.project.roommanagement.repository;

import com.project.roommanagement.entity.User;
import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    @Query("""
        SELECT u FROM User u
        WHERE (
              :keyword IS NULL
              OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR u.phoneNumber LIKE CONCAT('%', :keyword, '%')
        )
        AND (:role IS NULL OR u.role = :role)
        AND (:status IS NULL OR u.status = :status)
        """)
    Page<User> findAllWithFilter(
            @Param("keyword") String keyword,
            @Param("role") Role role,
            @Param("status") UserStatus status,
            Pageable pageable
    );

}

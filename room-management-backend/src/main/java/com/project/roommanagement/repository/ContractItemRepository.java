package com.project.roommanagement.repository;

import com.project.roommanagement.entity.ContractItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractItemRepository extends JpaRepository<ContractItem, Long> {

    List<ContractItem> findByContractId(Long id);
}

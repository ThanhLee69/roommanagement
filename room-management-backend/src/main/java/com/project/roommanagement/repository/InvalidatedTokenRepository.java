package com.project.roommanagement.repository;

import com.project.roommanagement.entity.InvalidatedToken;
import org.springframework.data.repository.CrudRepository;

public interface InvalidatedTokenRepository extends CrudRepository<InvalidatedToken, String> {

}
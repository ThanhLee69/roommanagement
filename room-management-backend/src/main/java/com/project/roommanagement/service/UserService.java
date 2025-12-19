package com.project.roommanagement.service;

import com.project.roommanagement.dto.request.UserCreateRequest;
import com.project.roommanagement.dto.request.UserUpdateRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.UserResponse;
import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.UserStatus;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse updateUser(Long userId, UserUpdateRequest request);

    UserResponse getUserById(Long userId);

    PageResponse<UserResponse> getAllUsers(int page,
                                           int size,
                                           String username,
                                           Role role,
                                           UserStatus status);

    void deleteUser(Long userId);
}

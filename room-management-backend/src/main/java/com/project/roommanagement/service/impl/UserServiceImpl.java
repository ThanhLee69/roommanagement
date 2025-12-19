package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.UserCreateRequest;
import com.project.roommanagement.dto.request.UserUpdateRequest;
import com.project.roommanagement.dto.response.PageResponse;
import com.project.roommanagement.dto.response.UserResponse;
import com.project.roommanagement.entity.User;
import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.UserStatus;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.UserMapper;
import com.project.roommanagement.repository.UserRepository;
import com.project.roommanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setStatus(UserStatus.ACTIVE);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        userMapper.updateUserFromRequest(request, user);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public PageResponse<UserResponse> getAllUsers( int page,
                                                   int size,
                                                   String keyword,
                                                   Role role,
                                                   UserStatus status) {
        PageRequest pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<User> userPage = userRepository.findAllWithFilter(keyword, role, status, pageable);
        List<UserResponse> users = userPage.getContent().stream()
                .map(userMapper::toUserResponse).toList();

        return PageResponse.<UserResponse>builder()
                .items(users)
                .currentPage(userPage.getNumber() + 1)
                .pageSize(userPage.getSize())
                .totalItems(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
    }
}

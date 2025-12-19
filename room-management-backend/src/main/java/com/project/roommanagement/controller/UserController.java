package com.project.roommanagement.controller;

import com.project.roommanagement.dto.request.TenantRequest;
import com.project.roommanagement.dto.request.UserCreateRequest;
import com.project.roommanagement.dto.request.UserUpdateRequest;
import com.project.roommanagement.dto.response.*;
import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.TenantStatus;
import com.project.roommanagement.enums.UserStatus;
import com.project.roommanagement.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@Slf4j(topic = "USER-CONTROLLER")
@Validated
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest request
    ) {
        UserResponse user = userService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .code(201)
                .message("User created successfully")
                .result(user)
                .build();
    }


    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        UserResponse response = userService.updateUser(id, request);
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("User updated successfully")
                .result(response)
                .build();
    }


    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("User deleted successfully")
                .result(null)
                .build();
    }


    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Get user successfully")
                .result(response)
                .build();
    }


    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        PageResponse<UserResponse> users =
                userService.getAllUsers(page, size, keyword, role, status);

        return ApiResponse.<PageResponse<UserResponse>>builder()
                .code(200)
                .message("Get users successfully")
                .result(users)
                .build();
    }
}

package com.project.roommanagement.dto.response;

import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String avatarUrl;

    private Role role;

    private UserStatus status;

    private LocalDateTime lastLogin;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

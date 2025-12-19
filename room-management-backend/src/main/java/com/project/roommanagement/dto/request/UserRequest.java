package com.project.roommanagement.dto.request;

import com.project.roommanagement.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserRequest {

    private String username;

    private String email;

    private String password;

    private String fullName;

    private String phoneNumber;

    private String address;

    private String avatarUrl;

    private Boolean isActive;
}

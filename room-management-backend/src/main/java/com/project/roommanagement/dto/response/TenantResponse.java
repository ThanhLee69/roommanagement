package com.project.roommanagement.dto.response;


import com.project.roommanagement.enums.Gender;
import com.project.roommanagement.enums.TenantStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TenantResponse {

    private Long id;

    private String fullName;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String phoneNumber;

    private String email;

    private String cccd;

    private String permanentAddress;

    private String occupation;

    private TenantStatus status;

    private String roomName;

    private String buildingName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

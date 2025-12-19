package com.project.roommanagement.dto.request;

import com.project.roommanagement.enums.Gender;
import com.project.roommanagement.enums.TenantStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TenantRequest {

    private String fullName;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String phoneNumber;

    private String email;

    private String cccd;

    private String permanentAddress;

    private String occupation;

    private TenantStatus status;
}

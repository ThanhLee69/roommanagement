package com.project.roommanagement.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
public class LoginRequest {
    private String username;
    private String password;
}

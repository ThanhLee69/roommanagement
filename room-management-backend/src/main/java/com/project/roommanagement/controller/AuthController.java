package com.project.roommanagement.controller;

import com.nimbusds.jose.JOSEException;
import com.project.roommanagement.dto.request.*;
import com.project.roommanagement.dto.response.*;
import com.project.roommanagement.entity.User;
import com.project.roommanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j(topic = "AUTH-CONTROLLER")
@Validated
public class AuthController {

    private final AuthService authService;

//    @PostMapping("/register")
//    ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
//        var result = authService.register(request);
//        return ApiResponse
//                .<UserResponse>builder()
//                .data(result)
//                .build();
//    }

    @PostMapping("/login")
    ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse login = authService.login(request);
        return ApiResponse
                .<AuthResponse>builder()
                .code(200)
                .message("Login successfully")
                .result(login)
                .build();
    }

//    @PostMapping("/introspect")
//    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
//            throws ParseException, JOSEException {
//        var result = authService.introspect(request);
//        return ApiResponse
//                .<IntrospectResponse>builder()
//                .data(result)
//                .build();
//    }

//    @PostMapping("/refresh-token")
//    ApiResponse<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest token)
//            throws ParseException, JOSEException {
//        RefreshTokenResponse refreshToken = authService.refreshToken(token);
//        return ApiResponse
//                .<RefreshTokenResponse>builder()
//                .code(200)
//                .message("Refresh token successfully")
//                .result(refreshToken)
//                .build();
//    }
//
//    @PostMapping("/logout")
//    ApiResponse<Void> logout(@Valid @RequestBody LogoutRequest token) throws ParseException, JOSEException {
//        authService.logout(token);
//        return ApiResponse.<Void>builder()
//                .code(200)
//                .message("Logout successfully")
//                .build();
//    }
}

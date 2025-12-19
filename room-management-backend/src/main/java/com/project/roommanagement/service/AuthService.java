package com.project.roommanagement.service;

import com.nimbusds.jose.JOSEException;
import com.project.roommanagement.dto.request.*;
import com.project.roommanagement.dto.response.*;

import java.text.ParseException;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

//    UserResponse register(RegisterRequest registerRequest);

//    void logout(LogoutRequest token);

//    RefreshTokenResponse refreshToken(RefreshTokenRequest token);

//    IntrospectResponse introspect(IntrospectRequest request);
}

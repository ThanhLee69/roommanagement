package com.project.roommanagement.service.impl;

import com.project.roommanagement.constants.ErrorCode;
import com.project.roommanagement.dto.request.*;
import com.project.roommanagement.dto.response.AuthResponse;
import com.project.roommanagement.dto.response.UserInfoResponse;
//import com.project.roommanagement.entity.Permission;
//import com.project.roommanagement.entity.Role;
import com.project.roommanagement.entity.User;
import com.project.roommanagement.enums.UserStatus;
import com.project.roommanagement.exception.AppException;
import com.project.roommanagement.mapper.UserMapper;
import com.project.roommanagement.repository.InvalidatedTokenRepository;
//import com.project.roommanagement.repository.RoleRepository;
import com.project.roommanagement.repository.UserRepository;
import com.project.roommanagement.service.AuthService;
import com.project.roommanagement.security.JwtService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

//    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        User user = userRepository
                .findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

//        Role role = user.getRoles()
//                .stream()
//                .findFirst()
//                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
//
//        Set<String> permissions = role.getPermissions()
//                .stream()
//                .map(Permission::getCode)
//                .collect(Collectors.toSet());


        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpiration())
                .userInfo(UserInfoResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .fullName(user.getFullName())
//                                .role(role.getCode())
                                .role(user.getRole().toString())
//                                .permissions(permissions)
                                .build()
                )
                .build();

    }

//    @Override
//    public UserResponse register(RegisterRequest registerRequest) {
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        Role userRole = roleRepository.findByCode("USER")
//                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));;
//        User user = User.builder()
//                .username(registerRequest.getUsername())
//                .password(passwordEncoder.encode(registerRequest.getPassword()))
////                .email(registerRequest.getEmail())
////                .phoneNumber(registerRequest.getPhoneNumber())
//                .fullName(registerRequest.getFullName())
//                .roles(Set.of(userRole))
//                .status(UserStatus.ACTIVE)
//                .build();
//        userRepository.save(user);
//        return userMapper.toUserResponse(user);
//    }

//    @Override
//    public void logout(LogoutRequest request) {
//        try {
//            boolean isRefresh = true;
//
//            SignedJWT signedJWT = jwtService.verifyToken(request.getToken());
//
//            String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
//            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
//            long ttlSeconds = (expiryTime.getTime() - System.currentTimeMillis()) / 1000;
//
//            if (ttlSeconds <= 0) {
//                log.info("Refresh token already expired, no need to invalidate.");
//                return;
//            }
//
//            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
//                    .jwtId(jwtId)
//                    .expiryTime(ttlSeconds)
//                    .build();
//
//            invalidatedTokenRepository.save(invalidatedToken);
//        } catch (AppException e) {
//            log.info("Token already invalid or expired.");
//        } catch (ParseException e) {
//            throw new RuntimeException("Failed to parse JWT", e);
//        }
//    }

//    @Override
//    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
//
//        try {
//            SignedJWT signedJWT = SignedJWT.parse(request.getRefreshToken());
//
//            String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
//
//            if (invalidatedTokenRepository.existsById(jwtId)) {
//                throw new AppException(ErrorCode.TOKEN_REUSED);
//            }
//
//            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
//            long ttlSeconds = (expirationTime.getTime() - System.currentTimeMillis()) / 1000;
//
//            if (ttlSeconds <= 0) {
//                throw new AppException(ErrorCode.UNAUTHENTICATED);
//            }
//
//            invalidatedTokenRepository.save(
//                    InvalidatedToken.builder()
//                            .jwtId(jwtId)
//                            .expiryTime(ttlSeconds)
//                            .build()
//            );
//
//            String username = signedJWT.getJWTClaimsSet().getSubject();
//            User user = userRepository.findByUsername(username)
//                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//
//            String newAccessToken = jwtService.generateAccessToken(user);
//            String newRefreshToken = jwtService.generateRefreshToken(user);
//
//            // 7. Response
//            return RefreshTokenResponse.builder()
//                    .accessToken(newAccessToken)
//                    .refreshToken(newRefreshToken)
//                    .tokenType("Bearer")
//                    .expiresIn(jwtService.getAccessTokenExpiration())
//                    .build();
//
//        } catch (ParseException e) {
//            throw new AppException(ErrorCode.TOKEN_INVALID);
//        }
//    }

//    @Override
//    public IntrospectResponse introspect(IntrospectRequest request) {
//        var token = request.getToken();
//        boolean isValid = true;
//
//        try {
//            verifyToken(token, false);
//        } catch (AppException e) {
//            isValid = false;
//        } catch (ParseException | JOSEException e) {
//            throw new RuntimeException(e);
//        }
//
//        return IntrospectResponse.builder()
//                                 .valid(isValid)
//                                 .build();
//    }

}

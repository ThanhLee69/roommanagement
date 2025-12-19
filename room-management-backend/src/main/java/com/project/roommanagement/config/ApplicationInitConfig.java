package com.project.roommanagement.config;


import com.project.roommanagement.constants.PredefinedRole;
//import com.project.roommanagement.entity.Role;
import com.project.roommanagement.entity.User;
import com.project.roommanagement.enums.Gender;
import com.project.roommanagement.enums.Role;
import com.project.roommanagement.enums.UserStatus;
//import com.project.roommanagement.repository.RoleRepository;
import com.project.roommanagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "123@123";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository
//            , RoleRepository roleRepository
    ) {
        log.info("Initializing application.....");
        return args -> {
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) {

//                Role userRole = roleRepository.save(Role.builder()
//                        .code(PredefinedRole.USER_ROLE)
//                        .name("Người dùng")
//                        .description("Default user role")
//                        .build());
//
//                Role adminRole = roleRepository.save(Role.builder()
//                        .code(PredefinedRole.ADMIN_ROLE)
//                        .name("Quản trị viên")
//                        .description("Admin role")
//                        .build());
//
//                var roles = new HashSet<Role>();
//                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .fullName("Le Dang Thanh")
                        .avatarUrl("sdb")
                        .status(UserStatus.ACTIVE)
                        .role(Role.ADMIN)
                        .email("thanhld69@gmail.com")
                        .phoneNumber("0369958572")
//                        .address("Duc Long, Dai Tu, Thai Nguyen")
//                        .roles(roles)
                        .build();

                userRepository.save(user);

                log.warn("Admin user created with default password, please change it!");
            }
            log.info("Application initialization completed.");
        };
    }
}
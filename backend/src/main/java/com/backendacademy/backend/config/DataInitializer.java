package com.backendacademy.backend.config;

import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Running DataInitializer...");

        // 1. Partial Unique Index creation is now handled by Flyway migrations

        // 2. Seed Default Admin User
        String adminEmail = "admin@backendacademy.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("System Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user seeded: {}", adminEmail);
        } else {
            log.info("Default admin user already exists.");
        }
    }
}

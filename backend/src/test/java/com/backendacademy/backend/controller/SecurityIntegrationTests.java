package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.repository.UserRepository;
import com.backendacademy.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class SecurityIntegrationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private String studentToken;
    private String instructorToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        User student = userRepository.save(User.builder().name("Student").email("student@test.com").password("pass").role(Role.STUDENT).build());
        User instructor = userRepository.save(User.builder().name("Instructor").email("instructor@test.com").password("pass").role(Role.INSTRUCTOR).build());
        User admin = userRepository.save(User.builder().name("Admin").email("admin@test.com").password("pass").role(Role.ADMIN).build());

        studentToken = "Bearer " + jwtService.generateToken(student);
        instructorToken = "Bearer " + jwtService.generateToken(instructor);
        adminToken = "Bearer " + jwtService.generateToken(admin);
    }

    // ── Unauthenticated Requests ──────────────────────────────

    @Test
    void unauthenticatedRequest_shouldReturn401Json() throws Exception {
        mockMvc.perform(get("/api/v1/courses"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("UNAUTHORIZED"));
    }

    // ── Student Access ────────────────────────────────────────

    @Test
    void student_canAccessPublicCourseEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/courses")
                        .header("Authorization", studentToken))
                .andExpect(status().isOk());
    }

    @Test
    void student_cannotAccessInstructorEndpoint() throws Exception {
        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", studentToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("FORBIDDEN"));
    }

    @Test
    void student_cannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", studentToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("FORBIDDEN"));
    }

    // ── Instructor Access ─────────────────────────────────────

    @Test
    void instructor_canAccessInstructorEndpoint() throws Exception {
        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", instructorToken))
                .andExpect(status().isOk());
    }

    @Test
    void instructor_cannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", instructorToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("FORBIDDEN"));
    }

    // ── Admin Access ──────────────────────────────────────────

    @Test
    void admin_canAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void admin_canAccessInstructorEndpoint() throws Exception {
        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }
}

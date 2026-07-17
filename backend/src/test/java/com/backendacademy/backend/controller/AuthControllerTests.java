package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.LoginRequest;
import com.backendacademy.backend.model.dto.StudentRegisterRequest;
import com.backendacademy.backend.repository.UserRepository;
import com.backendacademy.backend.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class AuthControllerTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        userRepository.deleteAll();
    }

    @Test
    void testRegisterStudentSuccessfully() throws Exception {
        StudentRegisterRequest request = new StudentRegisterRequest(
                "Alice", "alice@example.com", "password123", "Junior", "Computer Science"
        );

        mockMvc.perform(post("/api/v1/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.user.name", is("Alice")))
                .andExpect(jsonPath("$.user.email", is("alice@example.com")))
                .andExpect(jsonPath("$.user.role", is("STUDENT")));
    }

    @Test
    void testRegisterDuplicateEmailReturns409() throws Exception {
        // Seed database
        User existing = User.builder()
                .name("Bob")
                .email("bob@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.STUDENT)
                .build();
        userRepository.save(existing);

        StudentRegisterRequest request = new StudentRegisterRequest(
                "Bob Duplicate", "bob@example.com", "password123", "Junior", "Math"
        );

        mockMvc.perform(post("/api/v1/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode", is("DUPLICATE_RESOURCE")))
                .andExpect(jsonPath("$.message", containsString("Email is already registered")));
    }

    @Test
    void testLoginSuccessfully() throws Exception {
        // Seed user
        User user = User.builder()
                .name("Charlie")
                .email("charlie@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.STUDENT)
                .build();
        userRepository.save(user);

        LoginRequest request = new LoginRequest("charlie@example.com", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("charlie@example.com")));
    }

    @Test
    void testLoginWithInvalidCredentialsReturns401() throws Exception {
        LoginRequest request = new LoginRequest("wrong@example.com", "badpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errorCode", is("UNAUTHORIZED")))
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")));
    }

    @Test
    void testGetMeSuccessfully() throws Exception {
        // Seed user
        User user = User.builder()
                .name("David")
                .email("david@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.INSTRUCTOR)
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user);

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("David")))
                .andExpect(jsonPath("$.email", is("david@example.com")))
                .andExpect(jsonPath("$.role", is("INSTRUCTOR")));
    }

    @Test
    void testGetMeWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}

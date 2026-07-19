package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.dto.*;
import com.backendacademy.backend.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(
	    name = "1. Authentication",
	    description = "Endpoints for user registration, login, and session management"
	)
public class AuthController {
	

    private final AuthService authService;
    
    @Operation(summary = "Register a new student")
    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }
    
    @Operation(summary = "Register a new instructor")
    @PostMapping("/register/instructor")
    public ResponseEntity<AuthResponse> registerInstructor(@Valid @RequestBody InstructorRegisterRequest request) {
        return ResponseEntity.ok(authService.registerInstructor(request));
    }

    @Operation(summary = "Authenticate user and return JWT tokens")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Refresh access token")
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @Operation(summary = "Get current authenticated user")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}

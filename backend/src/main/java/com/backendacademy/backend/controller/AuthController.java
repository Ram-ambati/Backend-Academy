package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.dto.*;
import com.backendacademy.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/register/instructor")
    public ResponseEntity<AuthResponse> registerInstructor(@Valid @RequestBody InstructorRegisterRequest request) {
        return ResponseEntity.ok(authService.registerInstructor(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}

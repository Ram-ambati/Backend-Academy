package com.backendacademy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Placeholder controller for Admin-only functionality.
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/users")
    public ResponseEntity<Map<String, String>> getAllUsers() {
        return ResponseEntity.ok(Map.of("message", "List of all users. Accessible only by ADMIN."));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, String>> changeUserRole(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "User role changed. Accessible only by ADMIN."));
    }
}

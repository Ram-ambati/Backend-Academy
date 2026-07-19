package com.backendacademy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

/**
 * Placeholder controller for Admin-only functionality.
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(
	    name = "3. Administration",
	    description = "Endpoints for administrative user management"
	)
public class AdminController {

	@Operation(summary = "Get all users")
    @GetMapping("/users")
    public ResponseEntity<Map<String, String>> getAllUsers() {
        return ResponseEntity.ok(Map.of("message", "List of all users. Accessible only by ADMIN."));
    }

	@Operation(summary = "Change a user's role")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, String>> changeUserRole(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "User role changed. Accessible only by ADMIN."));
    }
}

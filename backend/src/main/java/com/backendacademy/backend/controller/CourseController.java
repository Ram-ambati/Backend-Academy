package com.backendacademy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

/**
 * Course endpoints with RBAC gates applied.
 * Business logic (CRUD, ownership checks) will be implemented once
 * the Course entity and CourseService are built. Ownership enforcement
 * will use ForbiddenException in the service layer.
 */
@RestController
@RequestMapping("/api/v1/courses")
@Tag(
	    name = "2. Courses",
	    description = "Endpoints for creating, managing, and discovering courses"
	)
public class CourseController {

	@Operation(summary = "Get all courses")
    @GetMapping
    public ResponseEntity<Map<String, String>> getAllCourses() {
        return ResponseEntity.ok(Map.of("message", "List of all courses. Accessible by anyone authenticated."));
    }
    // --- NEW ENDPOINT 1: Get Single Course ---
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, String>> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Single course details. Accessible by anyone authenticated (if published)."));
    }

    // --- NEW ENDPOINT 2: Instructor Dashboard ---
    @GetMapping("/my")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Map<String, String>> getMyCourses() {
        return ResponseEntity.ok(Map.of("message", "List of courses owned by the current instructor."));
    }

	@Operation(summary = "Create a new Course")
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> createCourse() {
        return ResponseEntity.ok(Map.of("message", "Course created. Accessible only by INSTRUCTOR or ADMIN."));
    }

	@Operation(summary = "Update an existing course")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> updateCourse(@PathVariable Long id) {
        // Note: A service-layer check would go here to ensure an INSTRUCTOR
        // is only updating their OWN course, using ForbiddenException.
        return ResponseEntity.ok(Map.of("message", "Course updated. Accessible only by INSTRUCTOR or ADMIN."));
    }

    // --- NEW ENDPOINT 3: The State Machine Transition ---
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> publishCourse(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Course published. Validates readiness criteria before state change."));
    }

	@Operation(summary = "Delete a course")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Course deleted. Accessible only by INSTRUCTOR or ADMIN."));
    }
}
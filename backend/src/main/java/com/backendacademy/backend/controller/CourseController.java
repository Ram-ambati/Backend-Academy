package com.backendacademy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Course endpoints with RBAC gates applied.
 * Business logic (CRUD, ownership checks) will be implemented once
 * the Course entity and CourseService are built. Ownership enforcement
 * will use ForbiddenException in the service layer.
 */
@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllCourses() {
        return ResponseEntity.ok(Map.of("message", "List of all courses. Accessible by anyone authenticated."));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> createCourse() {
        return ResponseEntity.ok(Map.of("message", "Course created. Accessible only by INSTRUCTOR or ADMIN."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> updateCourse(@PathVariable Long id) {
        // Note: A service-layer check would go here to ensure an INSTRUCTOR
        // is only updating their OWN course, using ForbiddenException.
        return ResponseEntity.ok(Map.of("message", "Course updated. Accessible only by INSTRUCTOR or ADMIN."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Course deleted. Accessible only by INSTRUCTOR or ADMIN."));
    }
}

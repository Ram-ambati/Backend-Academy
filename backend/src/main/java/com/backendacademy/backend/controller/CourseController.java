package com.backendacademy.backend.controller;

import com.backendacademy.backend.controller.docs.CourseApiDocs;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CourseResponse;
import com.backendacademy.backend.model.dto.CreateCourseRequest;
import com.backendacademy.backend.model.dto.PagedResponse;
import com.backendacademy.backend.model.dto.UpdateCourseRequest;
import com.backendacademy.backend.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController implements CourseApiDocs {

    private final CourseService courseService;

    @Override
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.createCourse(request, user));
    }

    @Override
    @GetMapping
    public ResponseEntity<PagedResponse<CourseResponse>> getAllCourses(Pageable pageable) {
        return ResponseEntity.ok(courseService.getAllPublishedCourses(pageable));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.getCourseById(id, user));
    }

    @Override
    @GetMapping("/my")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<PagedResponse<CourseResponse>> getMyCourses(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(courseService.getMyCourses(user, pageable));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.updateCourse(id, request, user));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        courseService.deleteCourse(id, user);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> publishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.publishCourse(id, user));
    }
}
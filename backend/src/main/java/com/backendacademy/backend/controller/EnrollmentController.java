package com.backendacademy.backend.controller;

import com.backendacademy.backend.controller.docs.EnrollmentApiDocs;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.EnrollmentResponse;
import com.backendacademy.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class EnrollmentController implements EnrollmentApiDocs {

    private final EnrollmentService enrollmentService;

    @Override
    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<EnrollmentResponse> enrollStudent(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                EnrollmentResponse.fromEntity(enrollmentService.enrollStudent(user.getId(), courseId))
        );
    }

    @Override
    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<Void> completeLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal User user) {
        enrollmentService.completeLessonByStudent(user.getId(), lessonId);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/users/me/enrollments")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(enrollmentService.getDashBoardEnrollments(user));
    }
}

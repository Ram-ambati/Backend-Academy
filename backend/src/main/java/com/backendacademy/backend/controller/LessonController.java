package com.backendacademy.backend.controller;

import com.backendacademy.backend.controller.docs.LessonApiDocs;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CreateLessonRequest;
import com.backendacademy.backend.model.dto.LessonResponse;
import com.backendacademy.backend.model.dto.UpdateLessonRequest;
import com.backendacademy.backend.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LessonController implements LessonApiDocs {

    private final LessonService lessonService;

    @Override
    @PostMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<LessonResponse> createLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody CreateLessonRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonService.createLesson(courseId, request, user));
    }

    @Override
    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourseId(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseId(courseId, user));
    }

    @Override
    @GetMapping("/lessons/{id}")
    public ResponseEntity<LessonResponse> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lessonService.getLessonById(id, user));
    }

    @Override
    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLessonRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lessonService.updateLesson(id, request, user));
    }

    @Override
    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        lessonService.deleteLesson(id, user);
        return ResponseEntity.noContent().build();
    }
}

package com.backendacademy.backend.service.impl;

import com.backendacademy.backend.exception.ForbiddenException;
import com.backendacademy.backend.exception.ResourceNotFoundException;
import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import com.backendacademy.backend.model.Lesson;
import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CreateLessonRequest;
import com.backendacademy.backend.model.dto.LessonResponse;
import com.backendacademy.backend.model.dto.UpdateLessonRequest;
import com.backendacademy.backend.repository.CourseRepository;
import com.backendacademy.backend.repository.LessonRepository;
import com.backendacademy.backend.service.EnrollmentService;
import com.backendacademy.backend.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;

    @Override
    public LessonResponse createLesson(Long courseId, CreateLessonRequest request, User currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        enforceOwnership(course, currentUser);

        Long rank = request.getPositionRank();
        if (rank == null) {
            rank = lessonRepository.findMaxPositionRankByCourseId(courseId)
                    .map(max -> max + 10000L)
                    .orElse(10000L);
        }

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .content(request.getContent())
                .videoUrl(request.getVideoUrl())
                .positionRank(rank)
                .build();

        Lesson saved = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByCourseId(Long courseId, User currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        enforceReadAuthorization(course, currentUser);

        return lessonRepository.findByCourseIdOrderByPositionRankAscUpdatedAtDesc(courseId)
                .stream()
                .map(LessonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long id, User currentUser) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        enforceReadAuthorization(lesson.getCourse(), currentUser);

        return LessonResponse.fromEntity(lesson);
    }

    @Override
    public LessonResponse updateLesson(Long id, UpdateLessonRequest request, User currentUser) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        enforceOwnership(lesson.getCourse(), currentUser);

        if (request.getTitle() != null) {
            lesson.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            lesson.setContent(request.getContent());
        }
        if (request.getVideoUrl() != null) {
            lesson.setVideoUrl(request.getVideoUrl());
        }
        if (request.getPositionRank() != null) {
            lesson.setPositionRank(request.getPositionRank());
        }

        Lesson saved = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(saved);
    }

    @Override
    public void deleteLesson(Long id, User currentUser) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        enforceOwnership(lesson.getCourse(), currentUser);

        lesson.setDeletedAt(Instant.now());
        lessonRepository.save(lesson);

        // Recalculate progress for all active enrollments since total active lessons dropped
        enrollmentService.recalculateProgressForCourse(lesson.getCourse().getId());
    }

    private void enforceOwnership(Course course, User currentUser) {
        boolean isOwner = course.getInstructor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You do not have permission to modify this course's content");
        }
    }

    private void enforceReadAuthorization(Course course, User currentUser) {
        if (course.getStatus() != CourseStatus.PUBLISHED) {
            if (currentUser == null) {
                throw new ResourceNotFoundException("Course not found");
            }
            boolean isOwner = course.getInstructor().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == Role.ADMIN;
            if (!isOwner && !isAdmin) {
                // Throw 404 to hide the existence of unreleased content from unauthorized users
                throw new ResourceNotFoundException("Course not found");
            }
        }
    }
}

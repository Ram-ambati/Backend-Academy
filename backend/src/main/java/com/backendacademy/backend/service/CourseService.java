package com.backendacademy.backend.service;

import com.backendacademy.backend.exception.BadRequestException;
import com.backendacademy.backend.exception.ForbiddenException;
import com.backendacademy.backend.exception.ResourceNotFoundException;
import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.*;
import com.backendacademy.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    /**
     * Creates a new course in DRAFT status, owned by the current user.
     */
    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request, User currentUser) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .difficultyLevel(request.getDifficultyLevel())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(CourseStatus.DRAFT)
                .instructor(currentUser)
                .build();

        Course saved = courseRepository.save(course);
        return CourseResponse.fromEntity(saved);
    }

    /**
     * Retrieves a course by ID with contextual read authorization.
     * DRAFT courses are only visible to their owner or an admin.
     * Non-owners receive a 404 (not 403) to hide the existence of unreleased content.
     */
    public CourseResponse getCourseById(Long id, User currentUser) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        // Contextual read authorization: hide non-PUBLISHED courses from non-owners
        if (course.getStatus() != CourseStatus.PUBLISHED) {
            boolean isOwner = course.getInstructor().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == Role.ADMIN;
            if (!isOwner && !isAdmin) {
                // Return 404 instead of 403 to avoid leaking existence of unreleased content
                throw new ResourceNotFoundException("Course not found with id: " + id);
            }
        }

        return CourseResponse.fromEntity(course);
    }

    /**
     * Lists all published courses with pagination.
     * Uses @EntityGraph in the repository to prevent N+1 queries.
     */
    public PagedResponse<CourseResponse> getAllPublishedCourses(Pageable pageable) {
        Page<CourseResponse> page = courseRepository
                .findByStatus(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::fromEntity);
        return PagedResponse.fromPage(page);
    }

    /**
     * Lists all courses owned by the current instructor (all statuses).
     */
    public PagedResponse<CourseResponse> getMyCourses(User currentUser, Pageable pageable) {
        Page<CourseResponse> page = courseRepository
                .findByInstructorId(currentUser.getId(), pageable)
                .map(CourseResponse::fromEntity);
        return PagedResponse.fromPage(page);
    }

    /**
     * Updates a course. Only non-null fields in the request are applied.
     * The status field is never mutated here — state changes go through /publish.
     */
    @Transactional
    public CourseResponse updateCourse(Long id, UpdateCourseRequest request, User currentUser) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        enforceOwnership(course, currentUser);

        // Apply only non-null fields (partial update semantics)
        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            course.setCategory(request.getCategory());
        }
        if (request.getDifficultyLevel() != null) {
            course.setDifficultyLevel(request.getDifficultyLevel());
        }
        if (request.getThumbnailUrl() != null) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }
        // NOTE: status is intentionally NOT updatable via PUT.
        // State transitions must go through dedicated endpoints (/publish, /archive).

        Course updated = courseRepository.save(course);
        return CourseResponse.fromEntity(updated);
    }

    /**
     * Soft-deletes a course by setting deletedAt.
     * The @SQLRestriction on the Course entity will filter it from future queries.
     */
    @Transactional
    public void deleteCourse(Long id, User currentUser) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        enforceOwnership(course, currentUser);

        course.setDeletedAt(LocalDateTime.now());
        courseRepository.save(course);

        // TODO: Fire a CourseDeletedEvent (Spring Application Events) so that future
        // modules (Lessons, Enrollments) can listen and cascade their own soft-deletes.
        // This is needed because we do NOT use database-level ON DELETE CASCADE
        // (it conflicts with our soft-delete strategy).
    }

    /**
     * Publishes a course after validating publish-readiness criteria.
     * Currently requires a non-blank description. If product management needs
     * stricter rules later, implement a PublishValidator interface.
     */
    @Transactional
    public CourseResponse publishCourse(Long id, User currentUser) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        enforceOwnership(course, currentUser);

        // State transition guard: Fail fast if already published
        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new BadRequestException("Course is already published");
        }

        // Publish readiness validation
        if (course.getDescription() == null || course.getDescription().isBlank()) {
            throw new BadRequestException("Course must have a description before publishing");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        Course published = courseRepository.save(course);
        return CourseResponse.fromEntity(published);
    }

    /**
     * Enforces that the current user owns the course.
     * Admins bypass this check entirely.
     */
    private void enforceOwnership(Course course, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return; // Admins can modify any course
        }
        if (!course.getInstructor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not own this course");
        }
    }
}

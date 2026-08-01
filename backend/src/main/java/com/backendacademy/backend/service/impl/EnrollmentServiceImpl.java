package com.backendacademy.backend.service.impl;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.repository.*;
import com.backendacademy.backend.service.EnrollmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import com.backendacademy.backend.model.dto.EnrollmentResponse;
@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CompletedLessonRepository completedLessonRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public Enrollment enrollStudent(Long studentId, Long courseId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        return enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseGet(() -> {
                    Enrollment enrollment = Enrollment.builder()
                            .student(student)
                            .course(course)
                            .progressPercentage(0.0)
                            .build();

                                        try {
                                                return enrollmentRepository.saveAndFlush(enrollment);
                                        } catch (DataIntegrityViolationException ex) {
                        return enrollmentRepository.findByStudentAndCourse(student, course)
                                .orElseThrow(() -> ex);
                    }
                });
    }

    @Override
    public void completeLesson(Long enrollmentId, Long lessonId) {

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        if (!lesson.getCourse().getId().equals(enrollment.getCourse().getId())) {
            throw new EntityNotFoundException("Lesson not found");
        }

        CompletedLesson completedLesson = CompletedLesson.builder()
                .enrollment(enrollment)
                .lesson(lesson)
                .build();

                try {
                        completedLessonRepository.saveAndFlush(completedLesson);
                } catch (DataIntegrityViolationException ex) {
                        return;
                }

        double progress = calculateProgress(enrollmentId);

        enrollment.setProgressPercentage(progress);

        if (progress >= 100.0) {
            enrollment.setCompletedAt(Instant.now());
        }

        enrollmentRepository.save(enrollment);
    }

    @Override
    public double calculateProgress(Long enrollmentId) {

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        long completedLessons =
                completedLessonRepository.countByEnrollmentId(enrollmentId);

        long totalLessons =
                lessonRepository.countByCourseIdAndDeletedAtIsNull(
                        enrollment.getCourse().getId()
                );

        if (totalLessons == 0) {
            return 0.0;
        }

        return (completedLessons * 100.0) / totalLessons;
    }

    @Override
    public void recalculateProgressForCourse(Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        for (Enrollment enrollment : enrollments) {
            double progress = calculateProgress(enrollment.getId());
            enrollment.setProgressPercentage(progress);
            if (progress >= 100.0 && enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(Instant.now());
            } else if (progress < 100.0) {
                enrollment.setCompletedAt(null);
            }
            enrollmentRepository.save(enrollment);
        }
    }

    @Override
    public void completeLessonByStudent(Long studentId, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, lesson.getCourse())
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        completeLesson(enrollment.getId(), lessonId);
    }

    @Override
    public List<EnrollmentResponse> getDashBoardEnrollments(User student) {
        return enrollmentRepository.findDashBoardEnrollments(student)
                .stream()
                .map(EnrollmentResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
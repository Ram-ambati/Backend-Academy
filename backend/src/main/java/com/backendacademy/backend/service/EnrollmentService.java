package com.backendacademy.backend.service;

import com.backendacademy.backend.model.Enrollment;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    Enrollment enrollStudent(Long studentId, Long courseId);

    void completeLesson(Long enrollmentId, Long lessonId);

    void completeLessonByStudent(Long studentId, Long lessonId);

    double calculateProgress(Long enrollmentId);

    void recalculateProgressForCourse(Long courseId);

    List<EnrollmentResponse> getDashBoardEnrollments(User student);
}
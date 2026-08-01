package com.backendacademy.backend.service;

import com.backendacademy.backend.model.Enrollment;

public interface EnrollmentService {

    Enrollment enrollStudent(Long studentId, Long courseId);

    void completeLesson(Long enrollmentId, Long lessonId);

    double calculateProgress(Long enrollmentId);

    void recalculateProgressForCourse(Long courseId);
}
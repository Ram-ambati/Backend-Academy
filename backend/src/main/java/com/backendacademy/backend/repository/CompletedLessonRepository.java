package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.CompletedLesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedLessonRepository extends JpaRepository<CompletedLesson, Long> {

    boolean existsByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);

    long countByEnrollmentId(Long enrollmentId);
}
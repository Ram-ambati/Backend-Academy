package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.CompletedLesson;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompletedLessonRepository extends JpaRepository<CompletedLesson, Long> {

    boolean existsByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);

    long countByEnrollmentId(Long enrollmentId);

    @Query("SELECT COUNT(cl) FROM CompletedLesson cl WHERE cl.enrollment.id = :enrollmentId AND cl.lesson.deletedAt IS NULL")
    long countActiveCompletedLessonsByEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}
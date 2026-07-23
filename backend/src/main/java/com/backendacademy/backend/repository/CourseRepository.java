package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByCategoryIgnoreCase(String category, Pageable pageable);
}


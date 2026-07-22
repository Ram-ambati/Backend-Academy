package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByStatus(CourseStatus status);
    List<Course> findByCategoryIgnoreCase(String category);
}

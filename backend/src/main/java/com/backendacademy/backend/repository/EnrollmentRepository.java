package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.Enrollment;
import com.backendacademy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    boolean existsByStudentAndCourse(User student, Course course);

    List<Enrollment> findByCourseId(Long courseId);
}
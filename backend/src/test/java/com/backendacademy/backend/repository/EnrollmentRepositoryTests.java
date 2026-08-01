package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class EnrollmentRepositoryTests {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User instructor;
    private User student;
    private Course course;

    @BeforeEach
    void setUp() {

        enrollmentRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        instructor = User.builder()
                .name("Instructor")
                .email("instructor@test.com")
                .password("password")
                .role(Role.INSTRUCTOR)
                .build();
        instructor = userRepository.save(instructor);

        student = User.builder()
                .name("Student")
                .email("student@test.com")
                .password("password")
                .role(Role.STUDENT)
                .build();
        student = userRepository.save(student);

        course = Course.builder()
                .title("Spring Boot")
                .description("Spring Boot Course")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor)
                .build();
        course = courseRepository.save(course);
    }

    @Test
    void shouldFindEnrollmentByStudentAndCourse() {

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .progressPercentage(0.0)
                .build();

        enrollmentRepository.save(enrollment);

        Optional<Enrollment> result =
                enrollmentRepository.findByStudentAndCourse(student, course);

        assertThat(result).isPresent();
        assertThat(result.get().getStudent().getId())
                .isEqualTo(student.getId());
        assertThat(result.get().getCourse().getId())
                .isEqualTo(course.getId());
    }

    @Test
    void shouldReturnEmptyWhenEnrollmentDoesNotExist() {

        Optional<Enrollment> result =
                enrollmentRepository.findByStudentAndCourse(student, course);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnTrueWhenEnrollmentExists() {

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .progressPercentage(0.0)
                .build();

        enrollmentRepository.save(enrollment);

        boolean exists =
                enrollmentRepository.existsByStudentAndCourse(student, course);

        assertThat(exists).isTrue();
    }

    @Test
    void shouldReturnFalseWhenEnrollmentDoesNotExist() {

        boolean exists =
                enrollmentRepository.existsByStudentAndCourse(student, course);

        assertThat(exists).isFalse();
    }
}
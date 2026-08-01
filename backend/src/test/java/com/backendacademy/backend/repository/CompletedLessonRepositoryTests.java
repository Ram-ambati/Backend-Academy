package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class CompletedLessonRepositoryTests {

    @Autowired
    private CompletedLessonRepository completedLessonRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private User instructor;
    private User student;
    private Course course;
    private Lesson lesson;
    private Enrollment enrollment;

    @BeforeEach
    void setUp() {

        completedLessonRepository.deleteAll();
        enrollmentRepository.deleteAll();
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        instructor = userRepository.save(
                User.builder()
                        .name("Instructor")
                        .email("instructor@test.com")
                        .password("password")
                        .role(Role.INSTRUCTOR)
                        .build()
        );

        student = userRepository.save(
                User.builder()
                        .name("Student")
                        .email("student@test.com")
                        .password("password")
                        .role(Role.STUDENT)
                        .build()
        );

        course = courseRepository.save(
                Course.builder()
                        .title("Spring Boot")
                        .description("Course")
                        .category("Java")
                        .difficultyLevel(DifficultyLevel.BEGINNER)
                        .status(CourseStatus.PUBLISHED)
                        .instructor(instructor)
                        .build()
        );

        lesson = lessonRepository.save(
                Lesson.builder()
                        .course(course)
                        .title("Lesson 1")
                        .content("Introduction")
                        .positionRank(1L)
                        .build()
        );

        enrollment = enrollmentRepository.save(
                Enrollment.builder()
                        .student(student)
                        .course(course)
                        .progressPercentage(0.0)
                        .build()
        );
    }

    @Test
    void shouldReturnTrueWhenLessonCompleted() {

        completedLessonRepository.save(
                CompletedLesson.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build()
        );

        boolean exists =
                completedLessonRepository.existsByEnrollmentIdAndLessonId(
                        enrollment.getId(),
                        lesson.getId()
                );

        assertThat(exists).isTrue();
    }

    @Test
    void shouldReturnFalseWhenLessonNotCompleted() {

        boolean exists =
                completedLessonRepository.existsByEnrollmentIdAndLessonId(
                        enrollment.getId(),
                        lesson.getId()
                );

        assertThat(exists).isFalse();
    }

    @Test
    void shouldPreventDuplicateLessonCompletion() {

        CompletedLesson first =
                CompletedLesson.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build();

        completedLessonRepository.saveAndFlush(first);

        CompletedLesson duplicate =
                CompletedLesson.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build();

        assertThatThrownBy(() ->
                completedLessonRepository.saveAndFlush(duplicate)
        ).isInstanceOf(DataIntegrityViolationException.class);
    }
}
package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class CourseRepositoryTests {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private User instructor1;
    private User instructor2;

    @BeforeEach
    void setUp() {
        // Clean database in reverse order of foreign key dependencies
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Seed users
        instructor1 = User.builder()
                .name("Instructor One")
                .email("instructor1@example.com")
                .password("password")
                .role(Role.INSTRUCTOR)
                .build();
        userRepository.save(instructor1);

        instructor2 = User.builder()
                .name("Instructor Two")
                .email("instructor2@example.com")
                .password("password")
                .role(Role.INSTRUCTOR)
                .build();
        userRepository.save(instructor2);
    }

    @Test
    void testFindByInstructorId() {
        Course course1 = Course.builder()
                .title("Spring Boot for Beginners")
                .description("Intro to Spring Boot")
                .category("Spring Boot")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build();

        Course course2 = Course.builder()
                .title("Advanced Spring Boot")
                .description("Pro features")
                .category("Spring Boot")
                .difficultyLevel(DifficultyLevel.ADVANCED)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor1)
                .build();

        Course course3 = Course.builder()
                .title("Intro to React")
                .description("Frontend React")
                .category("React")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor2)
                .build();

        courseRepository.saveAll(List.of(course1, course2, course3));

        List<Course> instructor1Courses = courseRepository.findByInstructorId(instructor1.getId());
        assertThat(instructor1Courses).hasSize(2);
        assertThat(instructor1Courses).extracting(Course::getTitle)
                .containsExactlyInAnyOrder("Spring Boot for Beginners", "Advanced Spring Boot");

        List<Course> instructor2Courses = courseRepository.findByInstructorId(instructor2.getId());
        assertThat(instructor2Courses).hasSize(1);
        assertThat(instructor2Courses.get(0).getTitle()).isEqualTo("Intro to React");
    }

    @Test
    void testFindByStatus() {
        Course course1 = Course.builder()
                .title("Course 1")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build();

        Course course2 = Course.builder()
                .title("Course 2")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor1)
                .build();

        courseRepository.saveAll(List.of(course1, course2));

        List<Course> draftCourses = courseRepository.findByStatus(CourseStatus.DRAFT);
        assertThat(draftCourses).hasSize(1);
        assertThat(draftCourses.get(0).getTitle()).isEqualTo("Course 1");

        List<Course> publishedCourses = courseRepository.findByStatus(CourseStatus.PUBLISHED);
        assertThat(publishedCourses).hasSize(1);
        assertThat(publishedCourses.get(0).getTitle()).isEqualTo("Course 2");
    }

    @Test
    void testFindByCategoryIgnoreCase() {
        Course course1 = Course.builder()
                .title("Course 1")
                .category("Spring Boot")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build();

        Course course2 = Course.builder()
                .title("Course 2")
                .category("spring boot")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build();

        Course course3 = Course.builder()
                .title("Course 3")
                .category("Docker")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build();

        courseRepository.saveAll(List.of(course1, course2, course3));

        List<Course> springBootCourses = courseRepository.findByCategoryIgnoreCase("SPRING BOOT");
        assertThat(springBootCourses).hasSize(2);
        assertThat(springBootCourses).extracting(Course::getTitle)
                .containsExactlyInAnyOrder("Course 1", "Course 2");
    }

    @Test
    void testSoftDeleteFiltering() {
        Course course1 = Course.builder()
                .title("Active Course")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor1)
                .build();

        Course course2 = Course.builder()
                .title("Deleted Course")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor1)
                .deletedAt(LocalDateTime.now()) // soft deleted
                .build();

        courseRepository.saveAll(List.of(course1, course2));

        // When retrieving all courses
        List<Course> allCourses = courseRepository.findAll();
        // Then the deleted course should not be returned because of @SQLRestriction
        assertThat(allCourses).hasSize(1);
        assertThat(allCourses.get(0).getTitle()).isEqualTo("Active Course");
    }
}

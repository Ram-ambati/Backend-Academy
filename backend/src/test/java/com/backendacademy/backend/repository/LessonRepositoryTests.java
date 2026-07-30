package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class LessonRepositoryTests {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;
    private User instructor;
    private Course course;

    @BeforeEach
    void setUp() {
        // Clean database in reverse order of foreign key dependencies
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Seed instructor
        instructor = User.builder()
                .name("Test Instructor")
                .email("instructor@example.com")
                .password("password")
                .role(Role.INSTRUCTOR)
                .build();
        userRepository.save(instructor);

        // Seed course
        course = Course.builder()
                .title("Java Backend Development")
                .description("Master Spring Boot")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor)
                .build();
        courseRepository.save(course);
    }

    @Test
    void testGapNumberingOrder() {
        Lesson lesson1 = Lesson.builder()
                .title("Lesson 3 - Advanced")
                .content("Advanced content")
                .positionRank(30000L)
                .course(course)
                .build();

        Lesson lesson2 = Lesson.builder()
                .title("Lesson 1 - Basics")
                .content("Basic content")
                .positionRank(10000L)
                .course(course)
                .build();

        Lesson lesson3 = Lesson.builder()
                .title("Lesson 2 - Midpoint")
                .content("Inserted content")
                .positionRank(15000L)
                .course(course)
                .build();

        lessonRepository.saveAll(List.of(lesson1, lesson2, lesson3));

        List<Lesson> sortedLessons = lessonRepository.findByCourseIdOrderByPositionRankAscUpdatedAtDesc(course.getId());

        assertThat(sortedLessons).hasSize(3);
        assertThat(sortedLessons).extracting(lesson -> lesson.getTitle())
                .containsExactly("Lesson 1 - Basics", "Lesson 2 - Midpoint", "Lesson 3 - Advanced");
        assertThat(sortedLessons).extracting(lesson -> lesson.getPositionRank())
                .containsExactly(10000L, 15000L, 30000L);
    }

    @Test
    void testTieBreakerOrder() throws InterruptedException {
        // Two lessons with identical positionRank
        Lesson lesson1 = Lesson.builder()
                .title("First Created Lesson")
                .content("Content 1")
                .positionRank(10000L)
                .course(course)
                .build();
        lessonRepository.saveAndFlush(lesson1);

        // Sleep briefly to ensure distinct updatedAt timestamps
        Thread.sleep(50);

        Lesson lesson2 = Lesson.builder()
                .title("Second Created Lesson (Updated Later)")
                .content("Content 2")
                .positionRank(10000L)
                .course(course)
                .build();
        lessonRepository.saveAndFlush(lesson2);

        List<Lesson> sortedLessons = lessonRepository.findByCourseIdOrderByPositionRankAscUpdatedAtDesc(course.getId());

        assertThat(sortedLessons).hasSize(2);
        // Since both have rank 10000L, the secondary sort (updatedAt DESC) places lesson2 before lesson1
        assertThat(sortedLessons.get(0).getTitle()).isEqualTo("Second Created Lesson (Updated Later)");
        assertThat(sortedLessons.get(1).getTitle()).isEqualTo("First Created Lesson");
    }

    @Test
    void testFindMaxPositionRankByCourseId() {
        // When course has no lessons
        Optional<Long> maxRankEmpty = lessonRepository.findMaxPositionRankByCourseId(course.getId());
        assertThat(maxRankEmpty).isEmpty();

        // Add lessons with ranks 10000, 25000, 15000
        Lesson lesson1 = Lesson.builder()
                .title("Lesson 1")
                .positionRank(10000L)
                .course(course)
                .build();

        Lesson lesson2 = Lesson.builder()
                .title("Lesson 2")
                .positionRank(25000L)
                .course(course)
                .build();

        Lesson lesson3 = Lesson.builder()
                .title("Lesson 3")
                .positionRank(15000L)
                .course(course)
                .build();

        lessonRepository.saveAll(List.of(lesson1, lesson2, lesson3));

        Optional<Long> maxRank = lessonRepository.findMaxPositionRankByCourseId(course.getId());
        assertThat(maxRank).isPresent();
        assertThat(maxRank.get()).isEqualTo(25000L);
    }

    @Test
    void testSoftDeleteFiltering() {
        Lesson activeLesson = Lesson.builder()
                .title("Active Lesson")
                .content("Active content")
                .positionRank(10000L)
                .course(course)
                .build();

        Lesson deletedLesson = Lesson.builder()
                .title("Deleted Lesson")
                .content("Deleted content")
                .positionRank(20000L)
                .course(course)
                .deletedAt(Instant.now()) // soft deleted
                .build();

        lessonRepository.saveAll(List.of(activeLesson, deletedLesson));

        List<Lesson> allLessons = lessonRepository.findAll();
        assertThat(allLessons).hasSize(1);
        assertThat(allLessons.get(0).getTitle()).isEqualTo("Active Lesson");

        List<Lesson> courseLessons = lessonRepository.findByCourseIdOrderByPositionRankAscUpdatedAtDesc(course.getId());
        assertThat(courseLessons).hasSize(1);
        assertThat(courseLessons.get(0).getTitle()).isEqualTo("Active Lesson");
    }
}

package com.backendacademy.service.impl;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.repository.*;

import com.backendacademy.backend.service.impl.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceImplTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CompletedLessonRepository completedLessonRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private EnrollmentServiceImpl enrollmentService;

    private Enrollment enrollment;
    private Course course;
    private Lesson lesson;

    @BeforeEach
    void setUp() {

        course = Course.builder()
                .id(1L)
                .title("Spring Boot")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .build();

        enrollment = Enrollment.builder()
                .id(1L)
                .course(course)
                .progressPercentage(0.0)
                .build();

        lesson = Lesson.builder()
                .id(1L)
                .course(course)
                .title("Lesson 1")
                .positionRank(1L)
                .build();
    }

    @Test
    void shouldCalculateZeroPercentProgress() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(completedLessonRepository.countByEnrollmentId(1L))
                .thenReturn(0L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(10L);

        double progress = enrollmentService.calculateProgress(1L);

        assertThat(progress).isEqualTo(0.0);
    }

    @Test
    void shouldCalculateFortyPercentProgress() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(completedLessonRepository.countByEnrollmentId(1L))
                .thenReturn(4L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(10L);

        double progress = enrollmentService.calculateProgress(1L);

        assertThat(progress).isEqualTo(40.0);
    }

    @Test
    void shouldCalculateHundredPercentProgress() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(completedLessonRepository.countByEnrollmentId(1L))
                .thenReturn(10L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(10L);

        double progress = enrollmentService.calculateProgress(1L);

        assertThat(progress).isEqualTo(100.0);
    }

    @Test
    void shouldReturnZeroWhenCourseHasNoLessons() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(completedLessonRepository.countByEnrollmentId(1L))
                .thenReturn(0L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(0L);

        double progress = enrollmentService.calculateProgress(1L);

        assertThat(progress).isEqualTo(0.0);
    }

    @Test
    void shouldSetCompletedAtWhenProgressReachesHundredPercent() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(lessonRepository.findById(1L))
                .thenReturn(Optional.of(lesson));

        when(completedLessonRepository.existsByEnrollmentIdAndLessonId(1L, 1L))
                .thenReturn(false);

        when(completedLessonRepository.countByEnrollmentId(1L))
                .thenReturn(10L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(10L);

        enrollmentService.completeLesson(1L, 1L);

        ArgumentCaptor<Enrollment> captor =
                ArgumentCaptor.forClass(Enrollment.class);

        verify(enrollmentRepository).save(captor.capture());

        Enrollment saved = captor.getValue();

        assertThat(saved.getProgressPercentage()).isEqualTo(100.0);
        assertThat(saved.getCompletedAt()).isNotNull();
    }

    @Test
    void shouldIgnoreDuplicateLessonCompletion() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(lessonRepository.findById(1L))
                .thenReturn(Optional.of(lesson));

        when(completedLessonRepository.existsByEnrollmentIdAndLessonId(1L, 1L))
                .thenReturn(true);

        enrollmentService.completeLesson(1L, 1L);

        verify(completedLessonRepository, never())
                .save(any(CompletedLesson.class));

        verify(enrollmentRepository, never())
                .save(any(Enrollment.class));
    }

    @Test
    void shouldThrowWhenEnrollmentDoesNotExist() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
                EntityNotFoundException.class,
                () -> enrollmentService.calculateProgress(1L)
        );
    }
}
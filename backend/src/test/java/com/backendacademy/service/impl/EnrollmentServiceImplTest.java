package com.backendacademy.service.impl;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.repository.*;
import com.backendacademy.backend.service.impl.EnrollmentServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

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

        when(completedLessonRepository.countActiveCompletedLessonsByEnrollmentId(1L))
                .thenReturn(0L);

        when(lessonRepository.countByCourseIdAndDeletedAtIsNull(1L))
                .thenReturn(10L);

        double progress = enrollmentService.calculateProgress(1L);

        assertThat(progress).isEqualTo(0.0);
    }

    @Test
    void shouldReturnExistingEnrollmentWhenStudentIsAlreadyEnrolled() {

        User student = User.builder()
                .id(1L)
                .build();

        Enrollment existingEnrollment = Enrollment.builder()
                .id(9L)
                .student(student)
                .course(course)
                .progressPercentage(0.0)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(courseRepository.findById(1L))
                .thenReturn(Optional.of(course));

        when(enrollmentRepository.findByStudentAndCourse(student, course))
                .thenReturn(Optional.of(existingEnrollment));

        Enrollment result = enrollmentService.enrollStudent(1L, 1L);

        assertThat(result).isEqualTo(existingEnrollment);
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }

    @Test
    void shouldCreateEnrollmentWhenStudentIsNotAlreadyEnrolled() {

        User student = User.builder()
                .id(1L)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(student));

        when(courseRepository.findById(1L))
                .thenReturn(Optional.of(course));

        when(enrollmentRepository.findByStudentAndCourse(student, course))
                .thenReturn(Optional.empty());

        when(enrollmentRepository.saveAndFlush(any(Enrollment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Enrollment result = enrollmentService.enrollStudent(1L, 1L);

        assertThat(result.getStudent()).isEqualTo(student);
        assertThat(result.getCourse()).isEqualTo(course);
        assertThat(result.getProgressPercentage()).isEqualTo(0.0);
        verify(enrollmentRepository).saveAndFlush(any(Enrollment.class));
    }

    @Test
    void shouldCalculateFortyPercentProgress() {

        when(enrollmentRepository.findById(1L))
                .thenReturn(Optional.of(enrollment));

        when(completedLessonRepository.countActiveCompletedLessonsByEnrollmentId(1L))
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

        when(completedLessonRepository.countActiveCompletedLessonsByEnrollmentId(1L))
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

        when(completedLessonRepository.countActiveCompletedLessonsByEnrollmentId(1L))
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

        when(completedLessonRepository.countActiveCompletedLessonsByEnrollmentId(1L))
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

        when(completedLessonRepository.saveAndFlush(any(CompletedLesson.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate"));

        enrollmentService.completeLesson(1L, 1L);

        verify(completedLessonRepository)
                .saveAndFlush(any(CompletedLesson.class));

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

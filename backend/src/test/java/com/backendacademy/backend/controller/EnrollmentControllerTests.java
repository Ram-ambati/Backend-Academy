package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.repository.*;
import com.backendacademy.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class EnrollmentControllerTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User student;
    private Course course;
    private Lesson lesson;
    private String studentToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        enrollmentRepository.deleteAll();
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        User instructor = userRepository.save(User.builder()
                .name("Instructor")
                .email("inst@test.com")
                .password(passwordEncoder.encode("pass"))
                .role(Role.INSTRUCTOR)
                .build());

        student = userRepository.save(User.builder()
                .name("Student")
                .email("student@test.com")
                .password(passwordEncoder.encode("pass"))
                .role(Role.STUDENT)
                .build());

        studentToken = jwtService.generateToken(student);

        course = courseRepository.save(Course.builder()
                .title("Test Course")
                .description("Desc")
                .category("IT")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor)
                .build());

        lesson = lessonRepository.save(Lesson.builder()
                .course(course)
                .title("Lesson 1")
                .content("Content")
                .build());
    }

    @Test
    void enrollStudent_SuccessAndIdempotent() throws Exception {
        // First enroll
        mockMvc.perform(post("/api/v1/courses/" + course.getId() + "/enroll")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId", is(course.getId().intValue())));

        // Second enroll (Idempotent)
        mockMvc.perform(post("/api/v1/courses/" + course.getId() + "/enroll")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId", is(course.getId().intValue())));
    }

    @Test
    void completeLesson_SuccessAndIdempotent() throws Exception {
        // Setup enrollment
        enrollmentRepository.saveAndFlush(Enrollment.builder()
                .student(student)
                .course(course)
                .progressPercentage(0.0)
                .build());

        // First complete
        mockMvc.perform(post("/api/v1/lessons/" + lesson.getId() + "/complete")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk());

        // Second complete (Idempotent, no 500)
        mockMvc.perform(post("/api/v1/lessons/" + lesson.getId() + "/complete")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk());
    }

    @Test
    void getMyEnrollments_ReturnsFlattenedData() throws Exception {
        // Setup enrollment
        enrollmentRepository.saveAndFlush(Enrollment.builder()
                .student(student)
                .course(course)
                .progressPercentage(50.0)
                .build());

        mockMvc.perform(get("/api/v1/users/me/enrollments")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].courseId", is(course.getId().intValue())))
                .andExpect(jsonPath("$[0].courseTitle", is("Test Course")))
                .andExpect(jsonPath("$[0].progressPercentage", is(50.0)));
    }
}

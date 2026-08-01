package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.model.dto.CreateLessonRequest;
import com.backendacademy.backend.model.dto.UpdateLessonRequest;
import com.backendacademy.backend.repository.*;
import com.backendacademy.backend.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import com.backendacademy.backend.service.EnrollmentService;

import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class LessonControllerTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @MockitoBean
    private EnrollmentService enrollmentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User instructor;
    private User otherInstructor;
    private User student;
    private Course draftCourse;
    private Course publishedCourse;
    private Lesson lesson;

    private String instructorToken;
    private String otherInstructorToken;
    private String studentToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        lessonRepository.deleteAll();
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        instructor = userRepository.save(User.builder()
                .name("Instructor")
                .email("inst@test.com")
                .password(passwordEncoder.encode("pass"))
                .role(Role.INSTRUCTOR)
                .build());

        otherInstructor = userRepository.save(User.builder()
                .name("Other Instructor")
                .email("other@test.com")
                .password(passwordEncoder.encode("pass"))
                .role(Role.INSTRUCTOR)
                .build());

        student = userRepository.save(User.builder()
                .name("Student")
                .email("student@test.com")
                .password(passwordEncoder.encode("pass"))
                .role(Role.STUDENT)
                .build());

        instructorToken = jwtService.generateToken(instructor);
        otherInstructorToken = jwtService.generateToken(otherInstructor);
        studentToken = jwtService.generateToken(student);

        draftCourse = courseRepository.save(Course.builder()
                .title("Draft Course")
                .category("TEST")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .instructor(instructor)
                .status(CourseStatus.DRAFT)
                .build());

        publishedCourse = courseRepository.save(Course.builder()
                .title("Published Course")
                .category("TEST")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .instructor(instructor)
                .status(CourseStatus.PUBLISHED)
                .build());

        lesson = lessonRepository.save(Lesson.builder()
                .course(publishedCourse)
                .title("First Lesson")
                .positionRank(10000L)
                .build());
    }

    @Test
    void createLesson_WithOmittedRank_CalculatesGapRank() throws Exception {
        CreateLessonRequest request = CreateLessonRequest.builder()
                .title("Second Lesson")
                .build();

        mockMvc.perform(post("/api/v1/courses/" + publishedCourse.getId() + "/lessons")
                        .header("Authorization", "Bearer " + instructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.positionRank").value(20000));
    }

    @Test
    void updateLesson_ByNonOwner_ReturnsForbidden() throws Exception {
        UpdateLessonRequest request = UpdateLessonRequest.builder()
                .title("Hacked Lesson")
                .build();

        mockMvc.perform(put("/api/v1/lessons/" + lesson.getId())
                        .header("Authorization", "Bearer " + otherInstructorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getLessons_ForDraftCourse_ReturnsNotFoundToPreventLeak() throws Exception {
        lessonRepository.save(Lesson.builder()
                .course(draftCourse)
                .title("Secret Draft Lesson")
                .build());

        mockMvc.perform(get("/api/v1/courses/" + draftCourse.getId() + "/lessons")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLessons_ForDraftCourse_ReturnsOkForOwner() throws Exception {
        lessonRepository.save(Lesson.builder()
                .course(draftCourse)
                .title("Secret Draft Lesson")
                .build());

        mockMvc.perform(get("/api/v1/courses/" + draftCourse.getId() + "/lessons")
                        .header("Authorization", "Bearer " + instructorToken))
                .andExpect(status().isOk());
    }

    @Test
    void deleteLesson_TriggersProgressRecalculation() throws Exception {
        mockMvc.perform(delete("/api/v1/lessons/" + lesson.getId())
                        .header("Authorization", "Bearer " + instructorToken))
                .andExpect(status().isNoContent());

        verify(enrollmentService).recalculateProgressForCourse(publishedCourse.getId());
    }
}

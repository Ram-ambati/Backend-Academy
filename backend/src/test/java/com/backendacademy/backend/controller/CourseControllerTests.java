package com.backendacademy.backend.controller;

import com.backendacademy.backend.model.*;
import com.backendacademy.backend.model.dto.CreateCourseRequest;
import com.backendacademy.backend.model.dto.UpdateCourseRequest;
import com.backendacademy.backend.repository.CourseRepository;
import com.backendacademy.backend.repository.UserRepository;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import jakarta.persistence.EntityManager;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class CourseControllerTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EntityManager entityManager;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User instructor1;
    private User instructor2;
    private User student;
    private User admin;

    private String instructor1Token;
    private String instructor2Token;
    private String studentToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        courseRepository.deleteAll();
        userRepository.deleteAll();

        instructor1 = userRepository.save(User.builder()
                .name("Instructor One")
                .email("instructor1@test.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.INSTRUCTOR)
                .build());

        instructor2 = userRepository.save(User.builder()
                .name("Instructor Two")
                .email("instructor2@test.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.INSTRUCTOR)
                .build());

        student = userRepository.save(User.builder()
                .name("Student One")
                .email("student@test.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.STUDENT)
                .build());

        admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@test.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.ADMIN)
                .build());

        instructor1Token = jwtService.generateToken(instructor1);
        instructor2Token = jwtService.generateToken(instructor2);
        studentToken = jwtService.generateToken(student);
        adminToken = jwtService.generateToken(admin);
    }

    // ── Test 1: Instructor creates a course ──────────────────

    @Test
    void testInstructorCreatesCourseSuccessfully() throws Exception {
        CreateCourseRequest request = new CreateCourseRequest(
                "Spring Boot Fundamentals",
                "Learn Spring Boot from scratch",
                "Spring Boot",
                DifficultyLevel.BEGINNER
        );

        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", "Bearer " + instructor1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Spring Boot Fundamentals")))
                .andExpect(jsonPath("$.status", is("DRAFT")))
                .andExpect(jsonPath("$.instructorId", is(instructor1.getId().intValue())))
                .andExpect(jsonPath("$.instructorName", is("Instructor One")));
    }

    // ── Test 2: Student cannot create a course ───────────────

    @Test
    void testStudentCannotCreateCourse() throws Exception {
        CreateCourseRequest request = new CreateCourseRequest(
                "Hacking Course", "Nope", "Hacking", DifficultyLevel.ADVANCED
        );

        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    // ── Test 3: Any user can get a PUBLISHED course by ID ────

    @Test
    void testGetPublishedCourseById() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Published Course")
                .description("A published course")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor1)
                .build());

        mockMvc.perform(get("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Published Course")))
                .andExpect(jsonPath("$.instructorName", is("Instructor One")));
    }

    // ── Test 4: Owner can get their DRAFT course ─────────────

    @Test
    void testOwnerCanGetDraftCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("My Draft")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        mockMvc.perform(get("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("My Draft")))
                .andExpect(jsonPath("$.status", is("DRAFT")));
    }

    // ── Test 5: Non-owner gets 404 for DRAFT course ──────────

    @Test
    void testNonOwnerGets404ForDraftCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Secret Draft")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        mockMvc.perform(get("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isNotFound());
    }

    // ── Test 6: List published courses (paginated) ───────────

    @Test
    void testListPublishedCoursesPaginated() throws Exception {
        courseRepository.save(Course.builder()
                .title("Published 1").category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED).instructor(instructor1).build());

        courseRepository.save(Course.builder()
                .title("Draft 1").category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT).instructor(instructor1).build());

        mockMvc.perform(get("/api/v1/courses")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Published 1")))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.page", is(0)));
    }

    // ── Test 7: Instructor lists their own courses ───────────

    @Test
    void testInstructorListsOwnCourses() throws Exception {
        courseRepository.save(Course.builder()
                .title("My Published").category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED).instructor(instructor1).build());

        courseRepository.save(Course.builder()
                .title("My Draft").category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT).instructor(instructor1).build());

        courseRepository.save(Course.builder()
                .title("Other Instructor's").category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.PUBLISHED).instructor(instructor2).build());

        mockMvc.perform(get("/api/v1/courses/my")
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }

    // ── Test 8: Instructor updates own course ────────────────

    @Test
    void testInstructorUpdatesOwnCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Original Title")
                .description("Original desc")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        UpdateCourseRequest request = new UpdateCourseRequest(
                "Updated Title", null, null, DifficultyLevel.ADVANCED
        );

        mockMvc.perform(put("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + instructor1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.description", is("Original desc")))  // unchanged
                .andExpect(jsonPath("$.difficultyLevel", is("ADVANCED")));
    }

    // ── Test 9: Instructor cannot update another's course ────

    @Test
    void testInstructorCannotUpdateAnothersCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Not Yours")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        UpdateCourseRequest request = new UpdateCourseRequest(
                "Hijacked", null, null, null
        );

        mockMvc.perform(put("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + instructor2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    // ── Test 10: Admin can update any course ─────────────────

    @Test
    void testAdminCanUpdateAnyCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Instructor's Course")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        UpdateCourseRequest request = new UpdateCourseRequest(
                "Admin Override", null, null, null
        );

        mockMvc.perform(put("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Admin Override")));
    }

    // ── Test 11: Instructor soft-deletes own course ──────────

    @Test
    void testInstructorSoftDeletesOwnCourse() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("To Be Deleted")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        mockMvc.perform(delete("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isNoContent());

        // Flush and clear JPA's first-level cache so @SQLRestriction filters the soft-deleted course
        entityManager.flush();
        entityManager.clear();

        // Verify course is hidden by soft-delete filter
        mockMvc.perform(get("/api/v1/courses/" + course.getId())
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isNotFound());
    }

    // ── Test 12: Publish course with description ─────────────

    @Test
    void testPublishCourseWithDescription() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("Ready to Publish")
                .description("This course has a description")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        mockMvc.perform(patch("/api/v1/courses/" + course.getId() + "/publish")
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PUBLISHED")));
    }

    // ── Test 13: Publish course without description fails ────

    @Test
    void testPublishCourseWithoutDescriptionFails() throws Exception {
        Course course = courseRepository.save(Course.builder()
                .title("No Description")
                .category("Java")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .status(CourseStatus.DRAFT)
                .instructor(instructor1)
                .build());

        mockMvc.perform(patch("/api/v1/courses/" + course.getId() + "/publish")
                        .header("Authorization", "Bearer " + instructor1Token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode", is("BAD_REQUEST")))
                .andExpect(jsonPath("$.message", containsString("description")));
    }

    // ── Test 14: Create course with blank title fails ────────

    @Test
    void testCreateCourseWithBlankTitleFails() throws Exception {
        CreateCourseRequest request = new CreateCourseRequest(
                "", "Some desc", "Java", DifficultyLevel.BEGINNER
        );

        mockMvc.perform(post("/api/v1/courses")
                        .header("Authorization", "Bearer " + instructor1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode", is("VALIDATION_ERROR")));
    }
}

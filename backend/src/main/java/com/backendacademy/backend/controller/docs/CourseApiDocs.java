package com.backendacademy.backend.controller.docs;

import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CourseResponse;
import com.backendacademy.backend.model.dto.CreateCourseRequest;
import com.backendacademy.backend.model.dto.PagedResponse;
import com.backendacademy.backend.model.dto.UpdateCourseRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

/**
 * Swagger/OpenAPI documentation interface for Course endpoints.
 * Keeps all annotation noise out of the controller, leaving it clean
 * with only routing logic and service delegation.
 */
@Tag(name = "2. Courses", description = "Endpoints for creating, managing, and discovering courses")
public interface CourseApiDocs {

    @Operation(summary = "Create a new course",
            description = "Creates a course in DRAFT status. The current user is automatically set as the instructor.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Course created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "403", description = "Insufficient role — requires INSTRUCTOR or ADMIN")
    })
    ResponseEntity<CourseResponse> createCourse(CreateCourseRequest request, User user);

    @Operation(summary = "List all published courses",
            description = "Returns a paginated list of all published courses. Accessible by any authenticated user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paginated list of published courses")
    })
    ResponseEntity<PagedResponse<CourseResponse>> getAllCourses(Pageable pageable);

    @Operation(summary = "Get a course by ID",
            description = "Returns course details. DRAFT courses are only visible to the owner or an admin; " +
                    "other users receive a 404 to hide the existence of unreleased content.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course details"),
            @ApiResponse(responseCode = "404", description = "Course not found or not accessible")
    })
    ResponseEntity<CourseResponse> getCourseById(@Parameter(description = "Course ID") Long id, User user);

    @Operation(summary = "List my courses",
            description = "Returns a paginated list of courses owned by the current instructor (all statuses).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Paginated list of instructor's courses"),
            @ApiResponse(responseCode = "403", description = "Only instructors can access this endpoint")
    })
    ResponseEntity<PagedResponse<CourseResponse>> getMyCourses(User user, Pageable pageable);

    @Operation(summary = "Update a course",
            description = "Updates course fields. Only non-null fields in the request body are applied. " +
                    "The course status cannot be changed via this endpoint.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course updated successfully"),
            @ApiResponse(responseCode = "403", description = "Not the course owner"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    ResponseEntity<CourseResponse> updateCourse(Long id, UpdateCourseRequest request, User user);

    @Operation(summary = "Delete a course",
            description = "Soft-deletes a course. The course remains in the database but is hidden from all queries.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Course deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Not the course owner"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    ResponseEntity<Void> deleteCourse(Long id, User user);

    @Operation(summary = "Publish a course",
            description = "Transitions a course from DRAFT to PUBLISHED. " +
                    "Validates publish-readiness (e.g., description must not be blank) before transitioning state.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course published successfully"),
            @ApiResponse(responseCode = "400", description = "Course does not meet publish-readiness criteria"),
            @ApiResponse(responseCode = "403", description = "Not the course owner"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    ResponseEntity<CourseResponse> publishCourse(Long id, User user);
}

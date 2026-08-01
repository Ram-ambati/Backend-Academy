package com.backendacademy.backend.controller.docs;

import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CreateLessonRequest;
import com.backendacademy.backend.model.dto.LessonResponse;
import com.backendacademy.backend.model.dto.UpdateLessonRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "3. Lessons", description = "Endpoints for managing lessons within a course")
public interface LessonApiDocs {

    @Operation(summary = "Create a lesson", description = "Adds a new lesson to a course. Requires INSTRUCTOR or ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Lesson created successfully"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions or not the course owner")
    })
    ResponseEntity<LessonResponse> createLesson(Long courseId, CreateLessonRequest request, User user);

    @Operation(summary = "List lessons for a course", description = "Returns all lessons in a course. Draft courses return 404 for non-owners.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of lessons"),
            @ApiResponse(responseCode = "404", description = "Course not found or not published")
    })
    ResponseEntity<List<LessonResponse>> getLessonsByCourseId(Long courseId, User user);

    @Operation(summary = "Get lesson details", description = "Returns details of a specific lesson.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson details"),
            @ApiResponse(responseCode = "404", description = "Lesson not found or course not published")
    })
    ResponseEntity<LessonResponse> getLessonById(Long id, User user);

    @Operation(summary = "Update a lesson", description = "Updates a lesson. Requires INSTRUCTOR or ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson updated successfully")
    })
    ResponseEntity<LessonResponse> updateLesson(Long id, UpdateLessonRequest request, User user);

    @Operation(summary = "Delete a lesson", description = "Soft deletes a lesson and triggers progress recalculation. Requires INSTRUCTOR or ADMIN role.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Lesson deleted successfully")
    })
    ResponseEntity<Void> deleteLesson(Long id, User user);
}

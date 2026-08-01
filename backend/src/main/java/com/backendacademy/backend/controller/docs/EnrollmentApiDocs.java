package com.backendacademy.backend.controller.docs;

import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.EnrollmentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "4. Enrollments", description = "Endpoints for student enrollments and progress tracking")
public interface EnrollmentApiDocs {

    @Operation(summary = "Enroll in a course", description = "Enrolls the authenticated student in a course. Idempotent operation.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Enrollment successful or already enrolled")
    })
    ResponseEntity<EnrollmentResponse> enrollStudent(Long courseId, User user);

    @Operation(summary = "Complete a lesson", description = "Marks a lesson as complete for the authenticated student and recalculates progress. Idempotent operation.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson marked as complete")
    })
    ResponseEntity<Void> completeLesson(Long lessonId, User user);

    @Operation(summary = "Get my enrollments", description = "Returns a list of the authenticated student's enrollments, sorted by most recent.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of enrollments")
    })
    ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(User user);
}

package com.backendacademy.backend.model.dto;

import com.backendacademy.backend.model.DifficultyLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for updating an existing course. All fields are optional.")
public class UpdateCourseRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Schema(description = "Updated course title", example = "Advanced Spring Boot")
    private String title;

    @Schema(description = "Updated course description", example = "Deep dive into Spring Boot internals")
    private String description;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Schema(description = "Updated course category", example = "Spring Boot")
    private String category;

    @Schema(description = "Updated difficulty level", example = "ADVANCED")
    private DifficultyLevel difficultyLevel;

    // NOTE: No 'status' field. State transitions (DRAFT -> PUBLISHED -> ARCHIVED)
    // are strictly isolated to dedicated workflow endpoints (e.g., /publish).
}

package com.backendacademy.backend.model.dto;

import com.backendacademy.backend.model.DifficultyLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for creating a new course")
public class CreateCourseRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Schema(description = "Course title", example = "Spring Boot Fundamentals")
    private String title;

    @Schema(description = "Detailed course description", example = "Learn the core concepts of Spring Boot")
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Schema(description = "Course category", example = "Spring Boot")
    private String category;

    @NotNull(message = "Difficulty level is required")
    @Schema(description = "Course difficulty level", example = "BEGINNER")
    private DifficultyLevel difficultyLevel;

    @Size(max = 500, message = "Thumbnail URL must not exceed 500 characters")
    @Schema(description = "URL to the course thumbnail image", example = "https://images.unsplash.com/photo-1555066931-4365d14bab8c")
    private String thumbnailUrl;
}

package com.backendacademy.backend.model.dto;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import com.backendacademy.backend.model.DifficultyLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Course details returned in API responses")
public class CourseResponse {

    @Schema(description = "Unique course identifier", example = "1")
    private Long id;

    @Schema(description = "Course title", example = "Spring Boot Fundamentals")
    private String title;

    @Schema(description = "Course description", example = "Learn the core concepts of Spring Boot")
    private String description;

    @Schema(description = "Course category", example = "Spring Boot")
    private String category;

    @Schema(description = "Difficulty level", example = "BEGINNER")
    private DifficultyLevel difficultyLevel;

    @Schema(description = "Publication status", example = "DRAFT")
    private CourseStatus status;

    @Schema(description = "URL to course thumbnail image")
    private String thumbnailUrl;

    @Schema(description = "ID of the instructor who owns this course", example = "5")
    private Long instructorId;

    @Schema(description = "Name of the instructor", example = "Ram Ambati")
    private String instructorName;

    @Schema(description = "When the course was created")
    private LocalDateTime createdAt;

    @Schema(description = "When the course was last updated")
    private LocalDateTime updatedAt;

    /**
     * Maps a Course entity to a CourseResponse DTO.
     * Flattens the instructor relationship into instructorId and instructorName.
     */
    public static CourseResponse fromEntity(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .difficultyLevel(course.getDifficultyLevel())
                .status(course.getStatus())
                .thumbnailUrl(course.getThumbnailUrl())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getName())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}

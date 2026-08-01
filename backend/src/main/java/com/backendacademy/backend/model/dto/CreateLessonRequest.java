package com.backendacademy.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String content;

    private String videoUrl;

    private Long positionRank;
}

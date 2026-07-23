package com.backendacademy.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standardized error response returned for all API errors")
public class ErrorResponse {

    @Schema(description = "High-level error classification code", example = "RESOURCE_NOT_FOUND")
    private String errorCode;

    @Schema(description = "Human-readable explanation of the error", example = "Course not found with id: 42")
    private String message;

    @Schema(description = "Detailed list of field or validation errors (if applicable)")
    private List<String> details;

    @Builder.Default
    @Schema(description = "ISO-8601 UTC timestamp when the error occurred", example = "2026-07-23T13:35:00Z")
    private Instant timestamp = Instant.now();

    public ErrorResponse(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public ErrorResponse(String errorCode, String message, List<String> details) {
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
        this.timestamp = Instant.now();
    }
}

package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload used to obtain a new access token")
public class RefreshRequest {

	@Schema(
	        description = "Valid refresh token issued during login",
	        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	    )
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}

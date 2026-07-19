package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response returned after refreshing an expired access token")
public class RefreshResponse {
	
	@Schema(
	        description = "New JWT access token issued after a successful token refresh",
	        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	    )
    private String accessToken;
}

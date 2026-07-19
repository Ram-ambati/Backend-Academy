package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload used to authenticate a user")
public class LoginRequest {

	@Schema(description="Email address registered with the account",example="vijay@email.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
	  
	@Schema(
		        description = "Password associated with the account",
		        example = "Vijay@123"
		    )
    @NotBlank(message = "Password is required")
    private String password;
}

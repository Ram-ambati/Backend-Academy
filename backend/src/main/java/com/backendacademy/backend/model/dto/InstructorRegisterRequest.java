package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload used to Register a Instructor")
public class InstructorRegisterRequest {
	
	@Schema(description="Instructor's full name",example="Dr. Leo Das")
    @NotBlank(message = "Name is required")
    private String name;

	@Schema(description="Email address used for login",example="leodas@email.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

	@Schema(description="Password used for login",example="Password123#")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

	@Schema(
		        description = "Instructor qualifications, expertise, or professional credentials",
		        example = "Senior Java Developer with 8 years of experience"
		    )
    @NotBlank(message = "Credentials/Expertise is required")
    private String credentials;
	
	@Schema(
	        description = "Short biography of the instructor",
	        example = "Passionate software engineer specializing in Spring Boot and cloud applications."
	    )
    private String bio;
}

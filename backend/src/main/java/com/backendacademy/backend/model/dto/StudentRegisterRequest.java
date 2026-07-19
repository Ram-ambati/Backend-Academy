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
@Schema(description = "Information required to register a new student account")public class StudentRegisterRequest {
	@Schema(
			description="Student's Full Name",
			example="C J Vijay"
			)
    @NotBlank(message = "Name is required")
    private String name;

	@Schema(
			description="Student's email for login",
			example="vijay@email.in"
			)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

	@Schema(
			description="Password for the student account",
			example="Vijay@123"
			)
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

	@Schema(
			description="Student's programming experience level",
			example="BEGINNER"
			)
    private String experienceLevel;
	
	@Schema(
		        description = "Faculty or department of the study",
		        example = "AI"
		    )
    private String faculty;
}

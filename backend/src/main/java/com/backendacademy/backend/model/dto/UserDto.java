package com.backendacademy.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Details of the authenticated user")
public class UserDto {

    @Schema(
        description = "Unique identifier of the user",
        example = "23"
    )
    private Long id;

    @Schema(
        description = "Full name of the user",
        example = "Vijay Kumar"
    )
    private String name;

    @Schema(
        description = "Email address associated with the user account",
        example = "vijay@email.com"
    )
    private String email;

    @Schema(
        description = "Role assigned to the user",
        example = "STUDENT"
    )
    private String role;
}
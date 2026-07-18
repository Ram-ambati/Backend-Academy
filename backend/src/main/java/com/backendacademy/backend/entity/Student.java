package com.backendacademy.backend.entity;

import com.backendacademy.backend.enums.EducationLevel;
import com.backendacademy.backend.enums.Role;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@SuperBuilder
@NoArgsConstructor
@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {
    @Column(unique = true)
    private String studentNumber;

    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    @Override
    public Role getRole() {
        return Role.STUDENT;
    }
}

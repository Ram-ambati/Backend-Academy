package com.backendacademy.backend.entity;

import com.backendacademy.backend.dto.EducationLevel;
import com.backendacademy.backend.dto.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
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

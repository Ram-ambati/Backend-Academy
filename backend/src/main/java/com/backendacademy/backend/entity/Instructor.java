package com.backendacademy.backend.entity;

import com.backendacademy.backend.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("INSTRUCTOR")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Instructor extends User{
    @Column(unique = true)
    private String employeeId;

    private String specialization;

    @Column(nullable = false)
    @Builder.Default
    private boolean approved = false; // admin must approve instructor registrations

    @Override
    public Role getRole() {
        return Role.INSTRUCTOR;
    }
}
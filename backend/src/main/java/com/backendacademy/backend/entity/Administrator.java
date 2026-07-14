package com.backendacademy.backend.entity;

import com.backendacademy.backend.dto.Role;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "administrators")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Administrator extends User{
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AdminLevel adminLevel = AdminLevel.STANDARD;

    @Override
    public Role getRole() {
        return Role.ADMIN;
    }

    public enum AdminLevel {
        STANDARD, SUPER_ADMIN
    }
}

package com.backendacademy.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(
        name = "completed_lessons",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_enrollment_lesson",
                        columnNames = {"enrollment_id", "lesson_id"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Enrollment associated with this completion.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    /**
     * Lesson completed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @CreationTimestamp
    @Column(name = "completed_at", nullable = false, updatable = false)
    private Instant completedAt;
}
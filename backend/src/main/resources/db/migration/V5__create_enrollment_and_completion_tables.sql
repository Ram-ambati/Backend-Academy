CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,

    progress_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,

    CONSTRAINT uq_student_course_enrollment
        UNIQUE (student_id, course_id),

    CONSTRAINT fk_enrollment_student
        FOREIGN KEY (student_id)
        REFERENCES users(id),

    CONSTRAINT fk_enrollment_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
);

CREATE TABLE completed_lessons (
    id BIGSERIAL PRIMARY KEY,

    enrollment_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,

    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_enrollment_lesson
        UNIQUE (enrollment_id, lesson_id),

    CONSTRAINT fk_completed_lesson_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES enrollments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_completed_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE
);
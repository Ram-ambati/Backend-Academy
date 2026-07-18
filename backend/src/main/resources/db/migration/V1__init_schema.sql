CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    last_login_at TIMESTAMP WITHOUT TIME ZONE,
    user_type VARCHAR(255) NOT NULL,

    -- Student fields
    student_number VARCHAR(255) UNIQUE,
    enrollment_date DATE,
    education_level VARCHAR(255),

    -- Instructor fields
    employee_id VARCHAR(255) UNIQUE,
    specialization VARCHAR(255),
    approved BOOLEAN,

    -- Administrator fields
    admin_level VARCHAR(255)
);

CREATE TABLE user_profiles (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    country VARCHAR(255),
    github_url VARCHAR(255),
    CONSTRAINT fk_user_profiles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

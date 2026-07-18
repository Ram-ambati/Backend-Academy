package com.backendacademy.backend.config;

import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Running DataInitializer...");

        // 1. Create Partial Unique Index for email (ignoring soft-deleted users)
        try {
            // Drop the old strict unique constraint created by Hibernate's unique=true
            // Hibernate generates names like 'uk6dotkott2kjsp8vw4d0m25fb7' but it's hard to predict.
            // We can query the constraint name and drop it dynamically in Postgres, or just create our index.
            // Actually, since we removed `unique = true`, Hibernate's ddl-auto=update might NOT drop the old constraint.
            // We will run a native Postgres block to find and drop any unique constraint on 'email' in 'users' table.
            String dropOldConstraintSql = """
                DO $$
                DECLARE
                    constname text;
                BEGIN
                    SELECT tc.constraint_name INTO constname
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
                    WHERE tc.constraint_type = 'UNIQUE'
                      AND tc.table_name = 'users'
                      AND ccu.column_name = 'email';
                
                    IF constname IS NOT NULL THEN
                        EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || constname;
                    END IF;
                END $$;
                """;
            jdbcTemplate.execute(dropOldConstraintSql);

            // Create the partial index
            jdbcTemplate.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active ON users (email) WHERE deleted_at IS NULL");
            log.info("Partial unique index on email created successfully.");
        } catch (Exception e) {
            log.warn("Could not configure partial index. If this is H2, this is expected: {}", e.getMessage());
        }

        // 2. Seed Default Admin User
        String adminEmail = "admin@backendacademy.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("System Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user seeded: {}", adminEmail);
        } else {
            log.info("Default admin user already exists.");
        }
    }
}

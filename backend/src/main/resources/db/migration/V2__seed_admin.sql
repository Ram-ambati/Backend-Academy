-- Seed default admin user using placeholders
-- The values are injected from application.properties / environment variables
-- Using 'NOT EXISTS' to ensure idempotency if the user already exists in the database

INSERT INTO users (name, email, password, role)
SELECT 'System Administrator', '${admin_email}', '${admin_password_hash}', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = '${admin_email}'
);

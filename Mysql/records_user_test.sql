DELETE FROM auth_nodejs.user WHERE id > 0;

ALTER TABLE auth_nodejs.user AUTO_INCREMENT = 1;

INSERT INTO auth_nodejs.user (user_id, username, email, password, created_at) VALUES
(SUBSTRING(UUID(), 1, 36), 'John Doe', 'johndoe@example.com', 'hashed_password1', NOW()),
(SUBSTRING(UUID(), 1, 36), 'Jane Smith', 'janesmith@example.com', 'hashed_password2', NOW()),
(SUBSTRING(UUID(), 1, 36), 'Alice Johnson', 'alicejohnson@example.com', 'hashed_password3', NOW()),
(SUBSTRING(UUID(), 1, 36), 'Bob Brown', 'bobbrown@example.com', 'hashed_password4', NOW()),
(SUBSTRING(UUID(), 1, 36), 'Charlie Davis', 'charliedavis@example.com', 'hashed_password5', NOW());
CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    hashpass VARCHAR(100) NOT NULL,
    state ENUM('No base data', 'No profile data', 'Complete') NOT NULL DEFAULT 'No base data',
    PRIMARY KEY (user_id)
);

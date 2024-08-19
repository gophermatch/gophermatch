CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    hashpass VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id)
);

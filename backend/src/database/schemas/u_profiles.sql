CREATE TABLE u_profiles (
    user_id INT,
    profile_name VARCHAR(20),
    bio VARCHAR(200),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

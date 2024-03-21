CREATE TABLE u_bios (
    user_id INT,
    bio VARCHAR(200),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE u_inbox (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    FOREIGN KEY (user_id_1) REFERENCES users(user_id),
    FOREIGN KEY (user_id_2) REFERENCES users(user_id),
    CONSTRAINT user_pair_unique UNIQUE (user_id_1, user_id_2),
    CHECK (user_id_1 < user_id_2)
);

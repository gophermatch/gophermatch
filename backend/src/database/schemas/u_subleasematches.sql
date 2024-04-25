CREATE TABLE u_subleasematches (
    user_id INT,
    match_user_id INT,
    PRIMARY KEY (user_id, match_user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE u_topfive (
    user_id INT,
    option_id INT,
    input VARCHAR(255),
    PRIMARY KEY (user_id, option_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
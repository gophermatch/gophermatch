CREATE TABLE u_savelease (
    user_id INT,
    sublease_id INT NOT NULL,
    match_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, sublease_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (sublease_id) REFERENCES u_subleases(sublease_id)
);
CREATE TABLE u_polloptions (
    user_id INT,
    option_id INT,
    option_text VARCHAR(128) DEFAULT 'Options',
    num_votes INT DEFAULT 0,
    PRIMARY KEY (user_id, option_id),
    UNIQUE (user_id, option_id)
);
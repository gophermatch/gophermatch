CREATE TABLE u_topfive (
    user_id INT,
    option_id INT,
    input VARCHAR(255),
    PRIMARY KEY (user_id, option_id),
    user_id INT PRIMARY KEY,
    question VARCHAR(255),
    input1 VARCHAR(255),
    input2 VARCHAR(255),
    input3 VARCHAR(255),
    input4 VARCHAR(255),
    input5 VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
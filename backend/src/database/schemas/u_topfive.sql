CREATE TABLE u_topfive (
    user_id INT PRIMARY KEY,
    question VARCHAR(255),
    input1 VARCHAR(255),
    input2 VARCHAR(255),
    input3 VARCHAR(255),
    input4 VARCHAR(255),
    input5 VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
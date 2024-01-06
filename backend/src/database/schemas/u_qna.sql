CREATE TABLE u_qna (
    user_id INT,
    question_id INT,
    option_id INT,
    PRIMARY KEY (user_id, question_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (question_id) REFERENCES qna_questions(question_id),
    FOREIGN KEY (option_id) REFERENCES qna_options(option_id)
);

CREATE TABLE u_pollquestions (
    user_id INT UNIQUE,
    question_text VARCHAR(128) DEFAULT 'Poll question',

    option_text_1 VARCHAR(16) DEFAULT 'Option A',
    option_text_2 VARCHAR(16) DEFAULT 'Option B',
    option_text_3 VARCHAR(16) DEFAULT 'Option C',
    option_text_4 VARCHAR(16) DEFAULT 'Option D',

    option_votes_1 INT DEFAULT 0,
    option_votes_2 INT DEFAULT 0,
    option_votes_3 INT DEFAULT 0,
    option_votes_4 INT DEFAULT 0,

    PRIMARY KEY (user_id)
);
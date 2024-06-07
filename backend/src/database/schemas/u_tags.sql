CREATE TABLE u_tags (
    user_id INT UNIQUE,
    tag_id INT UNIQUE,
    tag_value BOOLEAN,
    PRIMARY KEY (user_id, tag_id)
);
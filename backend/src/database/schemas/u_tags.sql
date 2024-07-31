CREATE TABLE u_tags (
    user_id INT NOT NULL,
    tag_id INT NOT NULL,
    tag_value BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);
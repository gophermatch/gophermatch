-- Junction table to link user rows to their profile pictures (as file paths)
CREATE TABLE u_pictures (
    user_id INT,
    picture_id INT AUTO_INCREMENT,
    picture_url VARCHAR(2048),
    pic_number INT NOT NULL,
    PRIMARY KEY (picture_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

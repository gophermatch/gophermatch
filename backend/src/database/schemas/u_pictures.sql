-- Junction table to link user rows to their profile pictures (as file paths)
create table u_pictures (
   picture_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    picture_url VARCHAR(2048) NOT NULL,
    pic_number INT CHECK (pic_number BETWEEN 1 AND 4),
    uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

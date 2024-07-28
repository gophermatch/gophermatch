CREATE TABLE u_apartment (
    user_id INT PRIMARY KEY,
    rent INT NOT NULL, -- Accepts any number, with two decimal places
    building VARCHAR(255) DEFAULT 'Any',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

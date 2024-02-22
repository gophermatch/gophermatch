CREATE TABLE u_userdata (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255) DEFAULT "",
    last_name VARCHAR(255) DEFAULT "",
    date_of_birth DATE DEFAULT "",
    hear_about_us TEXT DEFAULT "",
    hometown VARCHAR(255) DEFAULT "",
    housing_preference ENUM('apartments', 'dorms', 'both') DEFAULT 'both',
    college ENUM('College1', 'College2', 'College3', ...),  -- Replace with actual college names
    major ENUM('Major1', 'Major2', 'Major3', ...),  -- Replace with actual major names
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
    UNIQUE (user_id)
);

CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    hear_about_us TEXT,
    hometown VARCHAR(255),
    housing_preference ENUM('apartments', 'dorms', 'both') NOT NULL,
    college ENUM('College1', 'College2', 'College3', ...) NOT NULL,  -- Replace with actual college names
    major ENUM('Major1', 'Major2', 'Major3', ...) NOT NULL,  -- Replace with actual major names
    gender ENUM('male', 'female', 'other') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
    UNIQUE (user_id)
);

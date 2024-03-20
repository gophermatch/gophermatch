CREATE TABLE u_userdata (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(32) DEFAULT "",
    last_name VARCHAR(32) DEFAULT "",
    date_of_birth DATE,
    hear_about_us VARCHAR(32) DEFAULT "",
    hometown VARCHAR(32) DEFAULT "",
    housing_preference ENUM('apartments', 'dorms', 'both') DEFAULT 'both',
    college VARCHAR(32),  -- Replace with actual college names
    major VARCHAR(32),  -- Replace with actual major names
    graduating_year VARCHAR(4) DEFAULT "",
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    contact_email VARCHAR(320) DEFAULT "",
    contact_phone VARCHAR(20) DEFAULT "",
    contact_snapchat VARCHAR(15) DEFAULT "", -- Based on Snapchat's max username length
    contact_instagram VARCHAR(30) DEFAULT "", -- Based on Instagram's max username length
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    UNIQUE (user_id)
);

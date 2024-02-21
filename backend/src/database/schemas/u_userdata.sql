CREATE TABLE u_userdata (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    hear_about_us TEXT,
    hometown VARCHAR(255),
    housing_preference ENUM('Apartments', 'Dorms', 'Both') NOT NULL,
    college ENUM('Carlson', 'CBS', 'Design', 'CEHD','CFANS','CLA','CSE','Nursing') NOT NULL,  -- Replace with actual college names
    major VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'non-binary') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
    UNIQUE (user_id)
);

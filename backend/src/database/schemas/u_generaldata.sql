CREATE TABLE u_generaldata (
    -- Originally from u_generaldata
    user_id INT NOT NULL PRIMARY KEY,
    wakeup_time INT DEFAULT 80,
    sleep_time INT DEFAULT 144,
    substances ENUM('Yes', 'No') DEFAULT 'No',
    alcohol ENUM('Yes', 'No') DEFAULT 'No',
    room_activity ENUM('Party', 'Friends', 'Empty') DEFAULT 'Friends',
    num_residents INT DEFAULT 1,
    num_beds INT DEFAULT 1,
    num_bathrooms INT DEFAULT 1,
    move_in_month ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December') DEFAULT 'January',
    move_out_month ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December') DEFAULT 'January',
    -- Originally from u_bios
    bio VARCHAR(200) DEFAULT "",
    -- Originally from u_userdata
    first_name VARCHAR(32) DEFAULT "",
    last_name VARCHAR(32) DEFAULT "",
    date_of_birth DATE DEFAULT (CURRENT_DATE()),
    hear_about_us VARCHAR(32) DEFAULT "",
    hometown VARCHAR(32) DEFAULT "",
    housing_preference ENUM('apartments', 'dorms', 'both') DEFAULT 'both',
    college VARCHAR(32) DEFAULT "Deciding",  -- Replace with actual college names
    major VARCHAR(32) DEFAULT "Unspecified",  -- Replace with actual major names
    graduating_year VARCHAR(4) DEFAULT "",
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    contact_email VARCHAR(320) DEFAULT "",
    contact_phone VARCHAR(20) DEFAULT "",
    contact_snapchat VARCHAR(15) DEFAULT "", -- Based on Snapchat's max username length
    contact_instagram VARCHAR(30) DEFAULT "", -- Based on Instagram's max username length
    -- Originally from u_apartment
    rent INT NOT NULL DEFAULT 0, -- Accepts any number, with two decimal places
    building VARCHAR(255) DEFAULT 'Any',
    -- New
    show_dorm BOOLEAN DEFAULT TRUE,
    show_apartment BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    UNIQUE (user_id)
);
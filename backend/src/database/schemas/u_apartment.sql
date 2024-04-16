CREATE TABLE u_apartment (
    user_id INT PRIMARY KEY,
    rent INT NOT NULL, -- Accepts any number, with two decimal places
    pets ENUM('cat', 'dog', 'other', 'none but yes', 'none and no') DEFAULT 'none and no',
    num_of_roommates ENUM('2', '3', '4', '5', '6', 'any') DEFAULT 'any',
    furnished ENUM('yes', 'no', 'any') DEFAULT 'any',
    num_of_bathrooms ENUM('1', '2', '3', '4', 'any') DEFAULT 'any',
    num_of_bedrooms ENUM('1', '2', '3', '4', '5', 'any') DEFAULT 'any',
    move_in_date DATE, -- To record the year and month of moving in
    move_out_date DATE, -- To record the year and month of moving out
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE TABLE u_apartment (
    user_id INT PRIMARY KEY,
    rent INT NOT NULL, -- Accepts any number, with two decimal places
    move_in_date DATE, -- To record the year and month of moving in
    move_out_date DATE, -- To record the year and month of moving out
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Junction table to link users to their matches and unmatches (what do you call that?)
-- match attribute refers to whether this user matched with this person (true) or unmatched with this person (false)
CREATE TABLE u_matches (
    user_id INT,
    match_user_id INT,
    match_status ENUM('match', 'reject', 'unsure') NOT NULL,
    PRIMARY KEY (user_id, match_user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

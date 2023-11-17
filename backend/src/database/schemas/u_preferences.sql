-- Contains filter-able preferences per user
-- Values should be nullable
-- If the value of a prefernce is a list that can change, break the data out into a lookup table and junction table
-- Current preferences in lookup and junction tables:
    -- collges and user colleges
    -- dorms and user dorms
    -- locations and user locations

-- TODO: Add more preferences
create table u_preferences (
    user_id int,
    grad_year char(4),
    foreign key (college_id) references colleges(college_id)
        on delete cascade
        on update cascade,
    gender enum('man', 'woman', 'nonbinary', 'other'),

    is_dorm boolean,    -- true if user (only) wants to find dormmates

    sleep_low_range int,
    sleep_high_range int,
    drugs boolean,
    cleanliness enum('clean', 'alright', 'not clean'),
    primary key (user_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
);
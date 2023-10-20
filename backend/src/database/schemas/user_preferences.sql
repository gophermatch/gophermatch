-- Contains filter-able preferences per user
-- Values should be nullable
-- If the value of a prefernce is a list that can change, break the data out into a lookup table and junction table
-- Current preferences in lookup and junction tables:
    -- locations and user locations

-- TODO: Add more preferences
create table user_preferences (
    user_id int,
    gender enum('man', 'woman', 'nonbinary', 'other'),
    numer_of_roomates int,
    primary key (user_id),
    foreign key (user_id) references users(id)
        on delete casade
        on update casade
);
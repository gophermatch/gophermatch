-- Junction table for linking user's location preferences to their users
create table user_locations (
    user_id int,
    location_id int,  -- nullable
    primary key (user_id, location_id),
    foreign key (user_id) references users(id)
        on delete casade
        on update casade
    foreign key (location_id) references locations(id)
        on delete casade
        on update casade
);

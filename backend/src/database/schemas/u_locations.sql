-- Junction table for linking user's location preferences to their users
create table u_locations (
    user_id int,
    location_id int,  -- nullable
    primary key (user_id, location_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
    foreign key (location_id) references locations(location_id)
        on delete cascade
        on update cascade
);

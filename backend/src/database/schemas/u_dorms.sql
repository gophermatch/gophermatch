-- Junction table for linking user's dorm preferences to their users
create table u_dorms (
    user_id int,
    dorm_id int,  -- nullable
    primary key (user_id, dorm_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade,
    foreign key (dorm_id) references dorms(dorm_id)
        on delete cascade
        on update cascade
);

-- Junction table to link users to their matches and unmatches (what do you call that?)
-- match attribute refers to whether this user matched with this person (true) or unmatched with this person (false)
create table u_matches (
    user_id int,
    match_user_id int,
    match boolean not null default true,
    primary key (user_id, match_user_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade,
    foreign key (match_user_id) references users(user_id)
        on delete cascade
        on update cascade
);
create table profiles (
    user_id int,
    bio varchar(200),
    primary key (user_id),
    foreign key (user_id) references users(id)
        on delete cascade
        on update cascade
);
-- Junction table to link user rows to their profile pictures (as file paths)
create table u_pictures (
    user_id int,
    picture_id int auto_increment,
    picture_path varchar(100),
    primary key (user_id, picture_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
);
-- Junction table to link user rows to their pictures (as file urls)
create table u_pictures (
    user_id int,
    picture_id int auto_increment,
    picture_url varchar(200),
    picture_type enum('avatar', 'background', 'other'),
    primary key (user_id, picture_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
);
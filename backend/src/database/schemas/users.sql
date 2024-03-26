create table users (
    user_id int auto_increment,
    email varchar(50) not null unique,
    hashpass varchar(100) not null,
    primary key (user_id)
    is_verified boolean
);
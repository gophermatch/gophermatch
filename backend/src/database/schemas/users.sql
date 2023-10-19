create table users (
    id int auto_increment,
    username varchar(50) not null unique,
    hashpass varchar(100) not null,
    primary key (id)
);
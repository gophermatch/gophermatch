create table users (
    id int not null auto_increment,
    username varchar(50) not null unique,
    hashpass varchar(100) not null,
    bibliography varchar(200),
    avatar_path varchar(50)
    primary key (id)
);
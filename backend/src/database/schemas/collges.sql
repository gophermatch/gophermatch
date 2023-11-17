-- Lookup table with a list of collges at UMNTC
create table questions (
    collge_id int not null auto_increment,
    collge_name text varchar(50) not null unique,
    primary key (collge_id)
);
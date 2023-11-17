-- Lookup table for a list of apartments like The Hub, Identity, etc. 

create table apartments (
    apartment_id int not null auto_increment,
    display_name varchar(50) not null unique,
    primary key (apartment_id)
);
-- Lookup table with a list of collges at UMNTC
create table colleges (
    college_id int not null auto_increment,
    college_name text varchar(50) not null unique,
    college_acronym text varchar(10) not null,
    primary key (collge_id)
);
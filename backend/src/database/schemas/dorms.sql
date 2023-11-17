-- Lookup table for a list of dorms like Fieldhouse, Dinneken, etc. 
-- Better db design than storing strings or enums in a location column in the user db
-- Backend: Use joins. 
-- Frontend: Should cache this.

create table dorms (
    dorm_id int not null auto_increment,
    display_name varchar(50) not null unique,
    primary key (dorm_id)
);
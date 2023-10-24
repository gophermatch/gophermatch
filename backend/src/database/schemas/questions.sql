-- Lookup table with a list of predetermined questions
-- This is probably not the best way to store these
-- Perhaps we allow users to type their own questions, and we can just store a list of suggestions as json?
-- Then we only need a junction table that stores both the question and anwser, and not this.
create table questions (
    question_id int not null auto_increment,
    text varchar(50) not null unique,
    primary key (question_id)
);
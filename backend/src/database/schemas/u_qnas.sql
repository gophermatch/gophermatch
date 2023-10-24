-- Junction table to link user rows to their profile questions and anwsers
create table u_qnas (
    user_id int,
    question_id int,
    answer varchar(100),
    primary key (user_id, question_id),
    foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
    foreign key (question_id) references questions(question_id)
        on delete cascade
        on update cascade
);
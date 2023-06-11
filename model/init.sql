create extension pgcrypto;

CREATE TABLE user_types (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT
);

CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username     TEXT NOT NULL,
    user_type_id INTEGER REFERENCES user_types(id),
    name         TEXT,
    email        TEXT NOT NULL,
    password     TEXT NOT NULL,
    data_created TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email    UNIQUE (email)
);


CREATE TABLE schools (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT unique_school_name UNIQUE (name)
);

CREATE TABLE teachers_schools (
    teacher_id INTEGER REFERENCES users(id),
    school_id  INTEGER REFERENCES schools(id),
    CONSTRAINT unique_user_school_pair UNIQUE (teacher_id, school_id)
);

CREATE TABLE classrooms (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    secret_code TEXT,
    teacher_id INTEGER REFERENCES users(id)
);

CREATE TABLE classrooms_students (
    classroom_id INTEGER REFERENCES classrooms(id),
    student_id  INTEGER REFERENCES users(id),
    CONSTRAINT unique_classroom_student_pair UNIQUE (classroom_id, student_id)
);

CREATE TABLE programming_languages (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE problems (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    description TEXT,
    solution    TEXT,
    solution_programming_language_id INTEGER REFERENCES programming_languages(id),
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_cases (
    id SERIAL NOT NULL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    input TEXT,
    output TEXT,
    time_constaint FLOAT
);

CREATE TABLE tags (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    CONSTRAINT unique_tag_name UNIQUE (name)
);

CREATE TABLE problems_tags (
    problem_id INTEGER REFERENCES problems(id),
    tag_id INTEGER REFERENCES tags(id),
    CONSTRAINT unique_problem_tag_pair UNIQUE (problem_id, tag_id)
);

CREATE TABLE comments (
    id SERIAL NOT NULL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id),
    user_id INTEGER REFERENCES users(id),
    user_comment TEXT,
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rating (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    problem_id INTEGER REFERENCES problems(id),
    stars INTEGER CHECK (stars >= 1 AND stars <= 5)
);


CREATE TABLE submissions (
    id SERIAL PRIMARY KEY NOT NULL,
    problem_id INTEGER REFERENCES problems(id),
    user_id    INTEGER REFERENCES users(id),
    programming_language_id INTEGER REFERENCES programming_languages(id),
    solution   TEXT,
    score      INTEGER CHECK (score >= 0 AND score <= 100),
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE unreleased_problems (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    description TEXT,
    solution    TEXT,
    solution_programming_language_id INTEGER REFERENCES programming_languages(id),
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE unreleased_test_cases (
    id SERIAL NOT NULL PRIMARY KEY,
    unreleased_problems_id INTEGER REFERENCES unreleased_problems(id),
    input TEXT,
    output TEXT,
    time_constraint FLOAT
);

CREATE TABLE homeworks (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    time_limit TIMESTAMP DEFAULT (NOW()+INTERVAL '2 DAY'),
    classroom_id INTEGER REFERENCES classrooms(id),
    CONSTRAINT unique_homework_name UNIQUE (name)
);

CREATE TABLE homework_problems (
    homework_id INTEGER REFERENCES homeworks(id),
    problem_id INTEGER REFERENCES problems(id),
    CONSTRAINT unique_homework_problem UNIQUE (homework_id, problem_id)
);

INSERT INTO user_types(name) VALUES ('admin'), ('teacher'), ('student');
INSERT INTO programming_languages(name) VALUES ('C/C++'), ('Rust'), ('Python');


INSERT INTO problems(name, description, solution, solution_programming_language_id) VALUES ('Sum', 'Dat doua numere a si b de la tastatura sa se faca suma lor', '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a + b;}', (SELECT id from programming_languages WHERE name = 'C/C++'));
INSERT INTO problems(name, description, solution, solution_programming_language_id) VALUES ('Mul', 'Dat doua numere a si b de la tastatura sa se faca inmultirea lor', '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a * b;}', (SELECT id from programming_languages WHERE name = 'C/C++'));

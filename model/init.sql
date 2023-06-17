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
    date_created TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email    UNIQUE (email)
);


CREATE TABLE schools (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT unique_school_name UNIQUE (name)
);

CREATE TABLE teachers_schools (
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_id  INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_school_pair UNIQUE (teacher_id, school_id)
);

CREATE TABLE classrooms (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    code TEXT,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE classrooms_students (
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
    author INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    CONSTRAINT unique_tag_name UNIQUE (name)
);

CREATE TABLE problems_tags (
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    CONSTRAINT unique_problem_tag_pair UNIQUE (problem_id, tag_id)
);

CREATE TABLE comments (
    id SERIAL NOT NULL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_comment TEXT,
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ratings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    stars INTEGER CHECK (stars >= 1 AND stars <= 5)
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY NOT NULL,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
    author INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE homeworks (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    time_limit TIMESTAMP DEFAULT (NOW()+INTERVAL '2 DAY'),
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE
);

CREATE TABLE homework_problems (
    homework_id INTEGER REFERENCES homeworks(id) ON DELETE CASCADE,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    CONSTRAINT unique_homework_problem UNIQUE (homework_id, problem_id)
);

CREATE TABLE admin_posts (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT,
    content TEXT,
    author INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_created TIMESTAMP DEFAULT NOW()
);

INSERT INTO user_types(name) VALUES ('admin'), ('teacher'), ('student');
INSERT INTO programming_languages(name) VALUES ('C/C++'), ('Rust'), ('Python');


INSERT INTO problems(name, description, solution, solution_programming_language_id) VALUES ('Sum', 'Dat doua numere a si b de la tastatura sa se faca suma lor', '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a + b;}', (SELECT id from programming_languages WHERE name = 'C/C++'));
INSERT INTO problems(name, description, solution, solution_programming_language_id) VALUES ('Mul', 'Dat doua numere a si b de la tastatura sa se faca inmultirea lor', '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a * b;}', (SELECT id from programming_languages WHERE name = 'C/C++'));
INSERT INTO problems(name, description, solution, solution_programming_language_id) VALUES ('Regine', 'Dat un numar n sa se rezolve problema reginelor pe un tablou nxn', 'fn main() {println!(\"Regine!\")}', (SELECT id from programming_languages WHERE name = 'Rust'));

INSERT INTO tags(name) VALUES ('usoara'), ('grea'), ('clasa IX'), ('clasa X'), ('clasa XI'), ('clasa XII'), ('grafuri'), ('backtracking'), ('standard C');
INSERT INTO problems_tags(problem_id, tag_id) VALUES (1, 1), (1, 3), (1, 4), (1, 9), (2, 1), (2, 4), (3, 2), (3, 5), (3, 8);


INSERT INTO users(username, user_type_id, name, email, password) VALUES ('admin', (SELECT id FROM user_types WHERE name='admin'), 'Admin', 'admin@admining.com', 'f5cbc3b5d2f2faf4015014e6df64f638c95cf1f0c948013d173bbe98ad41e9f9b7a8268f32f76c642327e89b1f523cb61a99aa4d3e353d78fd059338a7f86aae'); -- parola admin
INSERT INTO users(username, user_type_id, name, email, password) VALUES ('teacher', (SELECT id FROM user_types WHERE name='teacher'), 'Dobrescu George', 'georgi@gmail.com', '1bc297bd2bff5221a035e72559f1f52b358590d7f7b5d49ee055a71c91067f56c361bd75e6bbf8984cdd5d5a4994babfbe1b0069df93169537944e46f78e65b4'); -- parola teacher
INSERT INTO users(username, user_type_id, name, email, password) VALUES ('teacher2', (SELECT id FROM user_types WHERE name='teacher'), 'Dobrescu Alexandru', 'gale@gmail.com', '1bc297bd2bff5221a035e72559f1f52b358590d7f7b5d49ee055a71c91067f56c361bd75e6bbf8984cdd5d5a4994babfbe1b0069df93169537944e46f78e65b4'); -- parola teacher
INSERT INTO users(username, user_type_id, name, email, password) VALUES ('student', (SELECT id FROM user_types WHERE name='student'), 'Alexandru Geogel', 'alexucul.tau@gmail.com', '033c6b034b5e13b1e0ff9eea3bf5bef0e7472d6c24b964b522e0722f941b44c91843ae5d00f15c2d55902e009c9f09a0f0305ae6061fe03240ad35f39589fcd5'); -- parola student
INSERT INTO users(username, user_type_id, name, email, password) VALUES ('student2', (SELECT id FROM user_types WHERE name='student'), 'Alexandra Stan', 'alexandra.stan@gmail.com', '033c6b034b5e13b1e0ff9eea3bf5bef0e7472d6c24b964b522e0722f941b44c91843ae5d00f15c2d55902e009c9f09a0f0305ae6061fe03240ad35f39589fcd5'); -- parola student
INSERT INTO users(username, user_type_id, name, email, password) VALUES ('student3', (SELECT id FROM user_types WHERE name='student'), 'Alexandru Farcas', 'alexbubu@gmail.com', '033c6b034b5e13b1e0ff9eea3bf5bef0e7472d6c24b964b522e0722f941b44c91843ae5d00f15c2d55902e009c9f09a0f0305ae6061fe03240ad35f39589fcd5'); -- parola student

INSERT INTO schools(name) VALUES ('Colegiul National "A.T.Laurian" Botosani');
INSERT INTO schools(name) VALUES ('Colegiul National "Mihai Eminescu" Botosani');
INSERT INTO teachers_schools(teacher_id, school_id) VALUES (2, 1), (3, 2);

INSERT INTO classrooms(name, code, teacher_id) VALUES ('clasa 9 B', 'beeeee', 1);
INSERT INTO classrooms(name, code, teacher_id) VALUES ('clasa 10 A', 'aaaaaa', 2);
INSERT INTO classrooms_students(classroom_id, student_id) VALUES (1, 4), (2, 5);

INSERT INTO submissions(problem_id, user_id, programming_language_id, solution, score) VALUES (1, 4, 1, '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a + b;\n}', null);
INSERT INTO submissions(problem_id, user_id, programming_language_id, solution, score) VALUES (1, 5, 1, '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << b + a;\n}', null);
INSERT INTO submissions(problem_id, user_id, programming_language_id, solution, score) VALUES (2, 4, 1, '#include <iostream>\nint main()\n{\n\tint a,b;\n\tstd::cin >> a >> b;\n\tstd::cout << a + b;\n}', null);

INSERT INTO homeworks(name, classroom_id) VALUES ('Tema 1', 1);
INSERT INTO homework_problems(homework_id, problem_id) VALUES (1, 1), (1, 2);
INSERT INTO homeworks(name, classroom_id) VALUES ('Tema 2', 2);
INSERT INTO homework_problems(homework_id, problem_id) VALUES (2, 1), (2, 2), (2, 3);

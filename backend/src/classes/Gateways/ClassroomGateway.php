<?php

class ClassroomGateway {
    private PostgreSQLDB $conn;

    function __construct(PostgreSQLDB $conn) {
        $this->conn = $conn;
    }

    private function user_is_student(int $user_id): void {
        $query = "SELECT * FROM users WHERE id=$1 AND user_type_id=(SELECT id FROM user_types WHERE name='student')";
        if($this->conn->records_are_present("check_if_student", $query, $user_id) === false) {
            throw new ClientException("The user provided is not a student");
        }
    }
    
    private function user_is_teacher(int $user_id): void {
        $query = "SELECT * FROM users WHERE id=$1 AND user_type_id=(SELECT id FROM user_types WHERE name='teacher')";
        if($this->conn->records_are_present("check_if_teacher", $query, $user_id) === false) {
            throw new ClientException("The user provided is not a teacher");
        }
    }

    private function is_classroom_owned_by_teacher(int $class_id, int $teacher_id): void {
        $query =  "SELECT * FROM classrooms WHERE id=$1 AND teacher_id=$2"; 
        if($this->conn->records_are_present("check_classroom_id", $query, $class_id, $teacher_id) === false) {
            throw new ClientException("There is no such class id $class_id or you don't own the class");
        }
    }
    
    private function is_student_in_classroom(int $student_id, int $classroom_id): void {
        $query =  "SELECT * FROM classrooms_students WHERE student_id=$1 AND classroom_id=$2"; 
        if($this->conn->records_are_present("check_classroom_id", $query, $student_id, $classroom_id) === false) {
            throw new ClientException("There is no such class id $classroom_id or you are not in the class");
        }
    }

    private function code_generator(): string {
        $str = random_bytes(8);
        $str = base64_encode($str);
        $str = str_replace(["+", "/", "="], "", $str);
        $str = substr($str, 0, 8);
        return $str;
    }
    
    private function get_school_name(int $teacher_id): string {
        $query = "SELECT s.name FROM schools s JOIN teachers_schools ts ON s.id = ts.school_id WHERE ts.teacher_id=$1";
        $result = $this->conn->execute_prepared("get_school_name", $query, $teacher_id);

        $row = pg_fetch_row($result);
        if($row === false) {
            throw new Exception("Could not get school name");
        }
        return $row[0]; 
    }

    public function get_student_classrooms(int $user_id): array {
        $query = "SELECT c.id, c.name, c.code, c.teacher_id, u.name AS \"teacher_name\", s.name AS \"school_name\" FROM classrooms_students cs JOIN classrooms c ON cs.classroom_id=c.id JOIN users u ON c.teacher_id=u.id JOIN teachers_schools ts ON c.teacher_id=ts.teacher_id JOIN schools s ON s.id=ts.school_id  WHERE cs.student_id=$1";
        $result = $this->conn->execute_prepared("get_student_classrooms", $query, $user_id);
        $classrooms = array();
        while($row = pg_fetch_assoc($result)) {
            $row["id"] = intval($row["id"]);
            $row["teacher_id"] = intval($row["teacher_id"]);
            $classrooms[] = $row;
        }

        return $classrooms;
    }

    public function get_teacher_classrooms(int $user_id): array {
        $this->user_is_teacher($user_id);
        $query = "SELECT c.id, c.name, c.code, u.name AS \"teacher_name\" FROM classrooms c JOIN users u ON u.id=c.teacher_id WHERE c.teacher_id=$1";

        $result = $this->conn->execute_prepared("get_teacher_classrooms", $query, $user_id);

        $classrooms = array();
        $school_name = $this->get_school_name($user_id);
        while($row = pg_fetch_assoc($result)) {
            $row["id"] = intval($row["id"]);
            $row["school_name"] = $school_name;
            $classrooms[] = $row;
        }
        return $classrooms;
    }

    public function get_colleagues_from_classroom(int $student_id, int $class_id): array {
        $this->user_is_student($student_id);
        $this->is_student_in_classroom($student_id, $class_id);
        $query = "SELECT u.id, u.username, u.name, u.email, COUNT(CASE WHEN s.score=100 THEN 1 END) AS problems_solved, COUNT(CASE WHEN s.score>=0 THEN 1 END) AS problems_submitted FROM classrooms_students cs JOIN users u ON cs.student_id=u.id LEFT JOIN submissions s ON s.user_id=cs.student_id WHERE cs.classroom_id=$1 GROUP BY u.id ORDER BY u.name";
        
        $result = $this->conn->execute_prepared("get_colleagues_from_classroom", $query, $class_id);
        $colleagues = [];
        while($row = pg_fetch_assoc($result)) {
            $row["id"] = intval($row["id"]);
            $row["problems_solved"] = intval($row["problems_solved"]);
            $row["problems_submitted"] = intval($row["problems_submitted"]);
            $colleagues[] = $row;
        }
        return $colleagues; 
    } 
    
    public function get_students_from_classroom(int $teacher_id, int $class_id): array {
        $this->user_is_teacher($teacher_id);
        $this->is_classroom_owned_by_teacher($class_id, $teacher_id);
        $query = "SELECT u.id, u.username, u.name, u.email, COUNT(CASE WHEN s.score=100 THEN 1 END) AS problems_solved, COUNT(CASE WHEN s.score>=0 THEN 1 END) AS problems_submitted FROM classrooms_students cs JOIN users u ON cs.student_id=u.id LEFT JOIN submissions s ON cs.student_id=s.user_id WHERE cs.classroom_id=$1 GROUP BY u.id ORDER BY u.name";
        
        $result = $this->conn->execute_prepared("get_students_from_classroom", $query, $class_id);
        $colleagues = [];

        while($row = pg_fetch_assoc($result)) {
            $row["id"] = intval($row["id"]);
            $row["problems_solved"] = intval($row["problems_solved"]);
            $row["problems_submitted"] = intval($row["problems_submitted"]);
            $colleagues[] = $row;
        }
        return $colleagues; 
    } 
    
    public function add_student_to_classroom(int $teacher_id, int $student_id, int $class_id): bool {
        $this->user_is_student($student_id);
        $this->user_is_teacher($teacher_id);
        $this->is_classroom_owned_by_teacher($class_id, $teacher_id);

        $query = "INSERT INTO classrooms_students(classroom_id, student_id) VALUES ($1,$2)";

        $result = $this->conn->execute_prepared("add_student_to_class", $query, $class_id, $student_id);

        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }

    public function join_classroom(int $student_id, string $code): bool {
        $this->user_is_student($student_id);
        
        $query = "SELECT id FROM classrooms WHERE code=$1";
        $result = $this->conn->execute_prepared("join_classroom_code", $query, $code);
        $row = pg_fetch_row($result);
        if($row === false) {
            throw new ClientException("The code is invalid");
        }
        $classroom_id = intval($row[0]);
        
        if($this->conn->records_are_present("already_in_class", "SELECT * FROM classrooms_students WHERE student_id=$1 AND classroom_id = $2", $student_id, $classroom_id) === true) {
            throw new ClientException("Student is already in classroom");
        }

        $query = "INSERT INTO classrooms_students(student_id, classroom_id) VALUES ($1, $2)";
        $result = $this->conn->execute_prepared("join_classroom_student", $query, $student_id, $classroom_id);

        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false; 
    }

    public function remove_student_from_classroom(int $teacher_id, int $student_id, int $class_id): bool {
        $this->user_is_student($student_id);
        $this->user_is_teacher($teacher_id);
        $this->is_classroom_owned_by_teacher($class_id, $teacher_id);
        $query = "DELETE FROM classrooms_students WHERE classroom_id=$1 AND student_id=$2";

        $result = $this->conn->execute_prepared("delete_student_from_class", $query, $class_id, $student_id);

        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }

    public function create_classroom(int $teacher_id, string $name): bool {
        $this->user_is_teacher($teacher_id);

        $query = "INSERT INTO classrooms(name,teacher_id,code) VALUES ($1, $2, $3)";
        $result = $this->conn->execute_prepared("create_classroom", $query, $name, $teacher_id, $this->code_generator());

        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
    
    public function delete_classroom(int $teacher_id, int $class_id): bool {
        $this->user_is_teacher($teacher_id);
        $this->is_classroom_owned_by_teacher($class_id, $teacher_id);

        $query = "DELETE FROM classrooms WHERE id=$1";
        $result = $this->conn->execute_prepared("create_classroom", $query, $class_id);

        if(pg_affected_rows($result) >= 1) {
            return true;
        }
        return false;
    }
    
    public function change_classroom_name(int $teacher_id, int $class_id, string $class_name): bool {
        $this->user_is_teacher($teacher_id);
        $this->is_classroom_owned_by_teacher($class_id, $teacher_id);

        $query = "UPDATE classrooms SET name=$2 WHERE id=$1";
        $result = $this->conn->execute_prepared("create_classroom", $query, $class_id, $class_name);

        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
}

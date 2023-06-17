<?php

class HomeworkGateway {
  private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

  private function homework_exists(int $homework_id): void {
    if($this->conn->records_are_present("homework_exists_".$homework_id, "SELECT * FROM homeworks WHERE id=$1", $homework_id) === false) {
        throw new ClientException("Homework with id $homework_id does not exist", 404);
    }
  }

  private function class_exists(int $class_id): void {
    if($this->conn->records_are_present("class_exists", "SELECT * FROM classrooms WHERE id=$1", $class_id) === false) {
        throw new ClientException("Classroom with id $class_id does not exist", 404);
    }
  }

  public function is_user_teacher_of_homework(int $user_id, int $homework_id): bool {
    $this->homework_exists($homework_id);
    $query = "SELECT * FROM homeworks h JOIN classrooms c ON h.classroom_id = c.id WHERE h.id=$1 AND c.teacher_id=$2";
    return $this->conn->records_are_present("is_user_teacher_of_homework", $query, $homework_id, $user_id);
  }

  public function is_user_teacher_of_class(int $user_id, int $class_id): bool {
    $this->class_exists($class_id);
    $query = "SELECT * FROM classrooms WHERE id=$1 AND teacher_id=$2";
    return $this->conn->records_are_present("is_user_teacher_of_class", $query, $class_id, $user_id);
  }

  public function get_homework(int $homework_id): array {
    $this->homework_exists($homework_id);
    $query = "SELECT h.id, h.classroom_id, h.name, h.time_limit, hp.problem_id FROM homeworks h JOIN homework_problems hp ON h.id = hp.homework_id WHERE h.id=$1";
    $result = $this->conn->execute_prepared("get_homework_".$homework_id, $query, $homework_id);

    $data = array();
    $row = pg_fetch_assoc($result);
    $data["id"] = intval($row["id"]);
    $data["classroom_id"] = intval($row["classroom_id"]);
    $data["name"] = $row["name"];
    $data["time_limit"] = $row["time_limit"];
    $data["problems"] = array();
    do {
      $data["problems"][] = intval($row["problem_id"]);
    } while($row = pg_fetch_assoc($result));

    return $data;
  }

  public function get_all_homework_of_class(int $class_id): array {
    $this->class_exists($class_id);
    //get all homeworks of class using get_homework
    $query = "SELECT id FROM homeworks WHERE classroom_id=$1";
    $result = $this->conn->execute_prepared("get_all_homework_of_class_".$class_id, $query, $class_id);
    $data = array();
    while ($row = pg_fetch_assoc($result)) {
      $data[] = $this->get_homework(intval($row["id"]));
    }
    return $data;
  }

  public function get_all_submissions_of_homework(int $homework_id): array {
    $this->homework_exists($homework_id);
    $query = "SELECT s.user_id, s.solution, s.problem_id, s.date_submitted FROM homework_problems hp
                JOIN homeworks h ON h.id=hp.homework_id
                JOIN classrooms c ON c.id=h.classroom_id
                JOIN classrooms_students cs ON cs.classroom_id=c.id
                JOIN submissions s ON hp.problem_id = s.problem_id
                WHERE s.user_id=cs.student_id
                      AND h.time_limit >= s.date_submitted
                      AND hp.homework_id=$1
                      ORDER BY s.user_id, s.date_submitted DESC";
    $result = $this->conn->execute_prepared("get_all_submissions_of_homework_".$homework_id, $query, $homework_id);
    $data = array();
    while($row = pg_fetch_assoc($result)) {
      $data[] = array(
        "user_id" => intval($row["user_id"]),
        "solution" => $row["solution"],
        "problem_id" => intval($row["problem_id"]),
        "date_submitted" => $row["date_submitted"]
      );
    }
    return $data;
  }

  public function post_homework(int $class_id, string $name, int $time_limit, array $problems): bool {
    $this->class_exists($class_id);
    $query = "INSERT INTO homeworks (classroom_id, name, time_limit) VALUES ($1, $2, $3) RETURNING id";
    $result = $this->conn->execute_prepared("post_homework_".$class_id, $query, $class_id, $name, date("Y-m-d H:i:s", $time_limit));
    $row = pg_fetch_assoc($result);
    $homework_id = intval($row["id"]);
    foreach($problems as $problem_id) {
      $query = "INSERT INTO homework_problems (homework_id, problem_id) VALUES ($1, $2)";
      $this->conn->execute_prepared("post_homework_problem_".$problem_id, $query, $homework_id, $problem_id);
    }
    return true;
  }

  public function delete_homework(int $homework_id): bool {
    $this->homework_exists($homework_id);
    $query = "DELETE FROM homeworks WHERE id=$1";
    $result = $this->conn->execute_prepared("delete_homework_".$homework_id, $query, $homework_id);
    if(pg_affected_rows($result) > 0) {
      return true;
    }
    return false;
  }

}

?>
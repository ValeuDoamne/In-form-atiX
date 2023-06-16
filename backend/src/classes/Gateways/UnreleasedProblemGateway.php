<?php

class UnreleasedProblemGateway {
  private PostgreSQLDB $conn;
  private array $programming_languages;
  private array $authors;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
    $this->programming_languages = array();
    $this->authors = array();
	}

  private function problem_exists(int $problem_id): void {
    if($this->conn->records_are_present("problem_exists", "SELECT * FROM unreleased_problems WHERE id=$1", $problem_id) === false) {
        throw new ClientException("Unreleased problem with id $problem_id does not exist", 404);
    }
}

  private function get_programming_langage_name(int $programming_language_id): string {
    if(array_key_exists($programming_language_id, $this->programming_languages)) {
      return $this->programming_languages[$programming_language_id];
    }
    $query = "SELECT name FROM programming_languages WHERE id=$1";
    $result = $this->conn->execute_prepared("get_programming_language_name".$programming_language_id, $query, $programming_language_id);
    $row = pg_fetch_assoc($result);
    $this->programming_languages[$programming_language_id] = $row["name"];
    return $row["name"];
  }

  private function get_author(int $author_id): string {
    if(array_key_exists($author_id, $this->authors)) {
      return $this->authors[$author_id];
    }
    $query = "SELECT username FROM users WHERE id=$1";
    $result = $this->conn->execute_prepared("get_author".$author_id, $query, $author_id);
    $row = pg_fetch_assoc($result);
    $this->authors[$author_id] = $row["username"];
    return $row["username"];
  }

  public function get_all_problems() : array {
    $query = "SELECT * FROM unreleased_problems";
    $result = $this->conn->execute_prepared("get_all_problems", $query);
        
		$data = array();
    while ($row = pg_fetch_assoc($result)) {
      $row["id"] = intval($row["id"]);
      //get programming language name
      $row["programming_language"] = $this->get_programming_langage_name(intval($row["solution_programming_language_id"]));
      unset($row["solution_programming_language_id"]);
      //get author
      $row["author"] = $this->get_author(intval($row["author"]));

			$data[] = $row;
		}

		return $data;
  }

  public function get_problem_with_id(int $problem_id): array {
    $this->problem_exists($problem_id);
    $query = "SELECT * FROM unreleased_problems WHERE id=$1";
    $result = $this->conn->execute_prepared("get_problem_with_id", $query, $problem_id);
    $row = pg_fetch_assoc($result);
    $row["id"] = intval($row["id"]);
    //get programming language name
    $row["programming_language"] = $this->get_programming_langage_name(intval($row["solution_programming_language_id"]));
    unset($row["solution_programming_language_id"]);
    //get author
    $row["author"] = $this->get_author(intval($row["author"]));

    return $row;
  }

  public function exists_programming_language(string $programming_language): bool {
    $query = "SELECT * from programming_languages WHERE name=$1";
    return $this->conn->records_are_present("programming_language_exists", $query, $programming_language);
  }

  public function propose_problem(int $user_id, string $name, string $description, string $solution, string $programming_language): bool {
    $query = "INSERT INTO unreleased_problems (name, description, solution, solution_programming_language_id, author, status) 
      VALUES ($1, $2, $3, (SELECT id FROM programming_languages WHERE name=$4), $5, 'pending')
    ";
    $result = $this->conn->execute_prepared("propose_problem", $query, $name, $description, $solution, $programming_language, $user_id);
    if(pg_affected_rows($result) >= 1) {
      return true;    
    }
    return false;
  }

}

?>
<?php

class ProblemGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

    private function problem_exists(int $problem_id): void {
        if($this->conn->records_are_present("problem_exists", "SELECT * FROM problems WHERE id=$1", $problem_id) === false)
        {
            throw new ClientException("Problem with id $problem_id does not exist");
        }
    }

	public function get_problems(array $tag): array {
		$query = "SELECT p.id, p.name, p.description FROM (problems p JOIN problems_tags pt ON p.id = pt.problem_id) JOIN tags t ON pt.tag_id = t.id WHERE t.name = $1";
		$result = $this->conn->execute_prepared("problem_get_after_tag", $query, $tag);
		
		$data = array();
		while ($row = pg_fetch_assoc($result)) {
			$data[] = $row;
		}
	
		return $data;
    }

    public function get_all_problems(): array {
        $query = "SELECT id, name FROM problems";
        $result = $this->conn->execute_prepared("get_all_problems", $query);
        
		$data = array();
        while ($row = pg_fetch_assoc($result)) {
            $row["id"] = intval($row["id"]);
			$data[] = $row;
		}
	
		return $data;
    }
    
    public function get_all_tags(): array {
        $query = "SELECT name FROM tags";
        $result = $this->conn->execute_prepared("get_all_tags", $query);
        
		$data = array();
		while ($row = pg_fetch_assoc($result)) {
			$data[] = $row["name"];
		}
	
		return $data;
    }
    
    public function user_solved_problem(int $user_id, int $problem_id): bool {
        $this->problem_exists($problem_id);
        $query = "SELECT score FROM submissions WHERE user_id=$1 AND problem_id=$2";
        $result = $this->conn->execute_prepared("check_user_solved", $query, $user_id, $problem_id);
        
        if(pg_num_rows($result) === 0) {
            return false;
        }
        
        while($row = pg_fetch_row($result)) {
            if($row[0] === "100") {
                return true;     
            }
        }
        return false;
    }
    
    public function get_problem_with_solution(int $problem_id): array {
        $query = "SELECT * FROM problems WHERE id=$1";
        $result = $this->conn->execute_prepared("problem_with_solution", $query, $problem_id);

        if(pg_num_rows($result) !== 1) {
            throw new ClientException("Problem with id $problem_id does not exist");
        } 
        $row = pg_fetch_row($result);
        $programming_language = [null];
        if($row[4] !== null) {
            $query2 = "SELECT name FROM programming_languages WHERE id=$1";
            $result = $this->conn->execute_prepared("programming_language_solution", $query2, $row[4]);
            if(pg_num_rows($result) !== 1) {
                throw new Exception("No such programming language");
            }
            $programming_language = pg_fetch_row($result);
        } 
        return [
                    "id" => intval($row[0]),
                    "name" => $row[1],
                    "description" => $row[2],
                    "solution" => $row[3],
                    "programming_language" => $programming_language[0],
                    "date_submitted" => $row[5] 
                ]; 
    }
    
    public function get_problem_without_solution(int $problem_id): array {
        $query = "SELECT * FROM problems WHERE id=$1";
        $result = $this->conn->execute_prepared("problem_without_solution", $query, $problem_id);

        if(pg_num_rows($result) !== 1) {
            throw new ClientException("Problem with id $problem_id does not exist");
        } 
        $row = pg_fetch_row($result);
        
        return [
                    "id" => intval($row[0]),
                    "name" => $row[1],
                    "description" => $row[2],
                    "date_submitted" => $row[5] 
                ]; 
    }
    
    public function get_problem_tags(int $problem_id): array {
        $this->problem_exists($problem_id);
        $query = "SELECT t.name FROM (problems p JOIN problems_tags pt ON p.id = pt.problem_id) JOIN tags t ON pt.tag_id = t.id WHERE p.id=$1";
        $result = $this->conn->execute_prepared("get_problem_tags", $query, $problem_id);
        
		$data = array();
		while ($row = pg_fetch_assoc($result)) {
			$data[] = $row["name"];
		}
	
		return $data;
    }

    public function tag_problem(int $problem_id, string $tag): bool {
        $this->problem_exists($problem_id);
        if($this->conn->records_are_present("already_inserted_tag", "SELECT * FROM tags WHERE name=$1", $tag) === false) {
            $this->conn->execute_prepared("insert_new_tag", "INSERT INTO tags(name) VALUES ($1)", $tag);
        }
        
        $already_inserted_pair = "SELECT * FROM problems_tags WHERE problem_id=$1 AND tag_id=(SELECT id from tags WHERE name=$2)";

        if($this->conn->records_are_present("already_inserted_tag_problem", $already_inserted_pair, $problem_id, $tag) === false) {
            $query = "INSERT INTO problems_tags(problem_id, tag_id) VALUES ($1, (SELECT id FROM tags WHERE name=$2))";
            $result = $this->conn->execute_prepared("tag_problem", $query, $problem_id, $tag);
            if( pg_affected_rows($result) === 1) {
                return true;
            }
        }
        return false;
    }

    public function get_problem_raport(int $problem_id): array {
        $this->problem_exists($problem_id);
        $query = "SELECT COUNT(*) FROM submissions WHERE problem_id=$1";
        $result = $this->conn->execute_prepared("get_problem_raport_submissions", $query, $problem_id);
        $all_submission = pg_fetch_row($result);
        $query = "SELECT COUNT(*) FROM submissions WHERE problem_id=$1 AND score=100";
        $result = $this->conn->execute_prepared("get_problem_raport_succesful", $query, $problem_id);
        $successful = pg_fetch_row($result);
        

        return [
                "total_submissions" => intval($all_submission[0]),
                "successful_submissions" => intval($successful[0])
            ];
    }

    public function get_submissions(int $user_id, int $problem_id): array {
        $this->problem_exists($problem_id);
        $query = "SELECT s.id, s.solution, pl.name, s.score, s.date_submitted FROM submissions s JOIN programming_languages pl ON s.programming_language_id = pl.id WHERE s.user_id=$1 AND problem_id=$2";
        $result = $this->conn->execute_prepared("get_submissions", $query, $user_id, $problem_id);

        $submissions = array();
        while($row = pg_fetch_row($result)) {
            $submissions[] = [
                                "submission_id" => intval($row[0]),
                                "solution" => $row[1],
                                "programming_language" => $row[2],
                                "score" => $row[3] !== null ? intval($row[3]) : $row[3],
                                "date_submitted" => $row[4]
                            ];
        }
        return $submissions;
    }

    public function exists_programming_language(string $programming_language): bool {
        $query = "SELECT * from programming_languages WHERE name=$1";
        return $this->conn->records_are_present("programming_language_exists", $query, $programming_language);
    }

    public function add_submission(int $user_id, int $problem_id, string $source_code, string $programming_language): bool {
        $this->problem_exists($problem_id);

        $query = "INSERT INTO submissions(user_id, problem_id, solution, programming_language_id) VALUES ($1,  $2, $3, (SELECT id FROM programming_languages WHERE name=$4))";
        $result = $this->conn->execute_prepared("submit_solutions", $query, 
                         $user_id, $problem_id, $source_code, $programming_language); 

        if(pg_affected_rows($result) >= 1) {
            return true;    
        }
        return false;
    }

    private function already_has_submitted(int $user_id, int $problem_id): bool {
        $query = "SELECT * FROM submissions WHERE problem_id=$1 AND user_id=$2";
        return $this->conn->records_are_present("already_has_submitted", $query, $problem_id, $user_id);
    }

    public function delete_problem(int $problem_id): bool {
        $this->problem_exists($problem_id); 
        $query = "DELETE FROM problems WHERE id=$1";
        $result = $this->conn->execute_prepared("delete_problem", $query, $problem_id);
        if(pg_affected_rows($result) >= 1) {
            return true;
        }
        return false;
    }
    
    public function delete_tag_from_problem(int $problem_id, string $tag): bool {
        $this->problem_exists($problem_id); 
        $query = "DELETE FROM problems_tags WHERE problem_id=$1 AND tag_id=(SELECT id FROM tags WHERE name=$2)";
        $result = $this->conn->execute_prepared("delete_problem", $query, $problem_id, $tag);
        if(pg_affected_rows($result) >= 1) {
            return true;
        }
        return false;
    }
    
    public function delete_tag(string $tag): bool {
        $query = "DELETE FROM tags WHERE name=$1";
        $result = $this->conn->execute_prepared("delete_problem", $query, $tag);
        if(pg_affected_rows($result) >= 1) {
            return true;
        }
        return false;
    }
}

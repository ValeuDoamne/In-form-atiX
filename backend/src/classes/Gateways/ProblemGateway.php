<?php

class ProblemGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
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
    
    public function get_problem_with_solution(int $id): array {
        $query = "SELECT * FROM problems WHERE id=$1";
        $result = $this->conn->execute_prepared("problem_with_solution", $query, $id);

        if(pg_num_rows($result) !== 1) {
            throw new Exception("No such problem in database");
        } 
        $row = pg_fetch_row($result);
        
        $query2 = "SELECT name FROM programming_languages WHERE id=$1";
        $result = $this->conn->execute_prepared("programming_language_solution", $query2, $row[4]);
        if(pg_num_rows($result) !== 1) {
            throw new Exception("No such programming language");
        } 
        $programming_language = pg_fetch_row($result); 
        return [
                    "id" => $row[0],
                    "name" => $row[1],
                    "description" => $row[2],
                    "solution" => $row[3],
                    "programming_language" => $programming_language[0],
                    "date_submitted" => $row[5] 
                ]; 
    }
    
    public function get_problem_without_solution(int $id): array {
        $query = "SELECT * FROM problems WHERE id=$1";
        $result = $this->conn->execute_prepared("problem_without_solution", $query, $id);

        if(pg_num_rows($result) !== 1) {
            throw new Exception("No such problem in database");
        } 
        $row = pg_fetch_row($result);
        
        return [
                    "id" => $row[0],
                    "name" => $row[1],
                    "description" => $row[2],
                    "date_submitted" => $row[5] 
                ]; 
    }
    
    public function get_problem_tags(int $problem_id): array {
        $query = "SELECT t.name FROM (problems p JOIN problems_tags pt ON p.id = pt.problem_id) JOIN tags t ON pt.tag_id = t.id WHERE p.id=$1";
        $result = $this->conn->execute_prepared("get_problem_tags", $query, $problem_id);
        
		$data = array();
		while ($row = pg_fetch_assoc($result)) {
			$data[] = $row["name"];
		}
	
		return $data;
    }

    public function tag_problem(int $problem_id, string $tag): bool {
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
        $query = "SELECT COUNT(*) FROM submissions WHERE problem_id=$1";
        $result = $this->conn->execute_prepared("get_problem_raport_submissions", $query, $problem_id);
        $all_submission = pg_fetch_row($result);
        $query = "SELECT COUNT(*) FROM submissions WHERE problem_id=$1 AND score=100";
        $result = $this->conn->execute_prepared("get_problem_raport_succesful", $query, $problem_id);
        $successful = pg_fetch_row($result);
        

        return [
                "total_submissions" => $all_submission[0],
                "successful_submissions" => $successful[0]
            ];
    }

    public function exists_programming_language(string $programming_language): bool {
        $query = "SELECT * from programming_languages WHERE name=$1";
        $result = $this->conn->execute_prepared("programming_language_exists", $query, $programming_language);

        if(pg_num_rows($result) > 0)
            return true;
        return false;
    }

    public function get_test_cases(int $problem_id): array {
        $query = "SELECT * FROM test_cases WHERE problem_id=$1";
        $result = $this->conn->execute_prepared("get_test_cases", $query, $problem_id);
        
        $tests =  array();
        $index = 0;
        $time_constaint = 5; 
        while(($row = pg_fetch_row($result)) && $row !== null) {
                array_push($tests, [
                            "test$index" => [
                                "input" => $row[2],
                                "expectedOutput" => $row[3]
                            ]
                        ]);
                $time_constaint = $row[4];
                $index = $index + 1;
        }
        $final_result = [
                        "testCases" => $tests,
                        "timeLimit" => intval($time_constaint),
                        "memoryLimit" => 5000
                    ];
        return $final_result;
    }
    

    public function delete_problem(int $problem_id): bool {
        $query = "DELETE FROM problems WHERE id=$1";

        $result = $this->conn->execute_prepared("delete_problem", $query, $problem_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
}

<?php

class SearchGateway {
    private PostgreSQLDB $conn;

    public function __construct(PostgreSQLDB $connection) {
        $this->conn = $connection;
    }

    public function search_problem_by_name(string $name): array {
        $query = "SELECT id, name FROM problems WHERE name LIKE '%$1%'";
        $result = $this->conn->execute_prepared("search_by_name", $query, $name); 
        
        $data = array();
        while ($row = pg_fetch_assoc($result)) {
            $data[] = $row;
        }
        return $data;
    }
    
	public function search_problem_by_tags(array $tags): array {
        $query = "SELECT p.id, p.name, p.description FROM (problems p JOIN problems_tags pt ON p.id = pt.problem_id) JOIN tags t ON pt.tag_id = t.id WHERE t.name = $1";

        $data = array();
        foreach($tags as $tag) {
            $result = $this->conn->execute_prepared("problem_get_after_tag", $query, $tag);
            while ($row = pg_fetch_assoc($result)) {
                $data[] = $row;
            }
        }
	
		return $data;
	}

}

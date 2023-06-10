<?php

class ProblemGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

	public function get_problems($tag): array {
		$query = "SELECT p.id, p.name, p.description FROM (problems p JOIN problems_tags pt ON p.id = pt.problem_id) JOIN tags t ON pt.tag_id = t.id WHERE t.name = $1";
		$result = $this->conn->execute_prepared("problem_get_after_tag", $query, $tag);
		
		$data = array();
		while ($row = pg_fetch_assoc($result)) {
			$data[] = $row;
		}
	
		return $data;
	}

}

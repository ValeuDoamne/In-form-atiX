<?php

class StatsGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

    public function number_of_users(): int {
        $query = "SELECT COUNT(*) FROM users";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    
    public function number_of_problems(): int {
        $query = "SELECT COUNT(*) FROM problems";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    
    public function number_of_new_problems(): int {
        $query = "SELECT COUNT(*) FROM unreleased_problems";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }

    public function number_of_classrooms(): int {
        $query = "SELECT COUNT(*) FROM classrooms";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    
    public function number_of_submissions(): int {
        $query = "SELECT COUNT(*) FROM submissions";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    public function number_of_schools(): int {
        $query = "SELECT COUNT(*) FROM schools";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    public function number_of_comments(): int {
        $query = "SELECT COUNT(*) FROM comments";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
    public function number_of_ratings(): int {
        $query = "SELECT COUNT(*) FROM ratings";
        $result = $this->conn->execute_query($query);
        
        $row = pg_fetch_row($result);
        return intval($row[0], 10);
    }
}

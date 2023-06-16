<?php
class PostgreSQLDB {
    private $conn;
    
    public function __construct(string $dbname, string $user,string $password, string $host = 'localhost',int $port = 5432) {
        $this->conn = pg_connect("dbname=$dbname user=$user password=$password host=$host port=$port");
        if (!$this->conn) {
            throw new Exception("Failed to connect to PostgreSQL database");
        }
    }
    
	public function execute_query(string $sql)
	{
        $result = pg_query($this->conn, $sql);
        if (!$result) {
            throw new Exception("PostgreSQL query failed: " . pg_last_error($this->conn));
        }
        return $result;
    }
	
	public function execute_prepared($name, $query, ...$params) {
		if (!$this->conn) {
			throw new Exception("PostgreSQL the connection has been closed");
		}

		$result = pg_prepare($this->conn, $name, $query);

		if (!$result) {
			throw new Exception("Failed to prepare query");
		}
		$result = pg_execute($this->conn, $name, $params);

		if (!$result) {
			throw new Exception("PostgreSQL faild to execute prepared statement ". pg_last_error($this->conn));
		}

		return $result;
	}

    public function records_are_present($name, $query, ...$params): bool {
		if (!$this->conn) {
			throw new Exception("PostgreSQL the connection has been closed");
        }
        
        $result = pg_prepare($this->conn, $name, $query);

		if (!$result) {
			throw new Exception("Failed to prepare query");
		}
		$result = pg_execute($this->conn, $name, $params);
		if (!$result) {
			throw new Exception("PostgreSQL faild to execute prepared statement ". pg_last_error($this->conn));
        }
        if(pg_num_rows($result) > 0) {
            return true;
        }
        return false; 
    }

    public function raw_pg_connection() {
        return $this->conn;
    }

    public function close(): void {
        pg_close($this->conn);
        $this->conn = null;
    }
}

?>


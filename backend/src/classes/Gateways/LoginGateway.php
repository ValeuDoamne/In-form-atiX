<?php

class LoginGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

	public function authenticate(string $usernameORemail, string $password): bool 
	{
		$query = "SELECT * FROM users WHERE (username=$1 OR email=$1) AND (password=$2)";
		$hashedPassword = hash("sha512", $password . Secrets::passwordSalt);
		$result = $this->conn->execute_prepared("login_authenticate", $query, $usernameORemail, $hashedPassword);
        
        return pg_num_rows($result) === 1;
	}

    /**
     * @return array<string,array|bool>
     */
    public function user_details(string $usernameORemail, string $password): array 
	{
		$query = "SELECT u.id, ut.name FROM users u JOIN user_types ut ON u.user_type_id = ut.id WHERE (username=$1 OR email=$1) AND (password=$2)";
		$hashedPassword = hash("sha512", $password . Secrets::passwordSalt);
		$result = $this->conn->execute_prepared("login_user_details", $query, $usernameORemail, $hashedPassword);
		
		$row = pg_fetch_assoc($result);

        if ($row === false) {
			Utils::senderr("User could not be logged in!");
        }
                
        return [
                    "user_id" => $row["id"],
                    "user_type" => $row["name"]
               ];
	}

}

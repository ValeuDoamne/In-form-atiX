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

	public function userid(string $usernameORemail, string $password): int 
	{
		$query = "SELECT id FROM users WHERE (username=$1 OR email=$1) AND (password=$2)";
		$hashedPassword = hash("sha512", $password . Secrets::passwordSalt);
		$result = $this->conn->execute_prepared("login_userid", $query, $usernameORemail, $hashedPassword);
		
		$row = pg_fetch_assoc($result);
		
		return $row["id"];
	}

	public function usertype(string $usernameORemail, string $password): string
	{
		$query = "SELECT ut.name FROM users u JOIN user_types ut ON u.user_type_id = ut.id WHERE (username=$1 OR email=$1) AND (password=$2)";
		$hashedPassword = hash("sha512", $password . Secrets::passwordSalt);
		$result = $this->conn->execute_prepared("usertype", $query, $usernameORemail, $hashedPassword);
		$row = pg_fetch_assoc($result);

		if ($row === false)
		{
			Utils::senderr("User is not logged in");
		}

		return $row["name"];
	}
}

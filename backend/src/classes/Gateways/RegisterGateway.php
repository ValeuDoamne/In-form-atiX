<?php

class RegisterGateway
{
	private PostgreSQLDB $conn;
	
	public function __construct(PostgreSQLDB $conn) {
		$this->conn = $conn;
	}

	public function check_username(string $username): bool
	{
		$query = "SELECT * FROM users WHERE username=$1";
		$result = $this->conn->execute_prepared("check_username", $query, $username);
		
		return pg_num_rows($result) >= 1;
	}
	
	public function check_email(string $email): bool
	{
		$query = "SELECT * FROM users WHERE email=$1";
		$result = $this->conn->execute_prepared("check_email", $query, $email);
		
		return pg_num_rows($result) >= 1;
	}

	public function register_student(string $email, string $username, string $name, string $password): void {
		$this->is_valid_username_email($username, $email);
		
		$hashedPassword = hash('sha512', $password . Secrets::passwordSalt);

		$query = "INSERT INTO users(username, user_type_id, name, email, password) VALUES ($1, (SELECT id FROM user_types WHERE name='student'), $2, $3, $4)";
	
		$result = $this->conn->execute_prepared("register_student", $query, $username, $name, $email, $hashedPassword);
		if (pg_affected_rows($result) == 1) {
			Utils::sendsuccess("User registered successfully!");
		} else {
			http_response_code(500);
			Utils::senderr("Failed to register user.");
		}
	}
	
	public function register_academic(string $institute): void
	{
		$query = "SELECT name FROM schools WHERE name=$1";
		$result = $this->conn->execute_prepared("check_schools", $query, $institute);
	   	if(pg_num_rows($result) === 0)
		{
			$query = "INSERT INTO schools(name) VALUES ($1)";
			$result = $this->conn->execute_prepared("insert_school", $query, $institute);
			if(pg_affected_rows($result) !== 1) {
				throw new Exception("Cannot insert academic institute");
			}
		}
	}

	public function register_teacher(string $email, string $username, string $name, string $password, string $school): void {
		$this->is_valid_username_email($username, $email);
	
		$this->register_academic($school);
		
		$hashedPassword = hash('sha512', $password . Secrets::passwordSalt);

		$query = "INSERT INTO users(username, user_type_id, name, email, password) 
			VALUES ($1, (SELECT id FROM user_types WHERE name='teacher'), $2, $3, $4) RETURNING *";

	
		$result = $this->conn->execute_prepared("register_teacher", $query, $username, $name, $email, $hashedPassword);
	
		if (pg_affected_rows($result) == 1 && pg_num_rows($result) == 1) {
			$last_inserted_row = pg_fetch_assoc($result);
			$id = $last_inserted_row["id"];
			$query = "INSERT INTO teachers_schools VALUES ($1, (SELECT id FROM schools WHERE name=$2))";
			$result = $this->conn->execute_prepared("register_teacher_school", $query, $id, $school);
			if(pg_affected_rows($result) === 1) {
				Utils::sendsuccess("User registered successfully!");
			}
		} else {
			http_response_code(500);
			Utils::senderr("Failed to insert user.");
		}
	}
	
	public function register_admin(string $email, string $username, string $name, string $password, string $secretCode): void {
		if(Secrets::secretAdminCode == $secretCode) {
		
			$this->is_valid_username_email($username, $email);

			$hashedPassword = hash('sha512', $password . Secrets::passwordSalt);

			$query = "INSERT INTO users(username, user_type_id, name, email, password) 
				VALUES ($1, (SELECT id FROM user_types WHERE name='admin'), $2, $3, $4)";

		
			$result = $this->conn->execute_prepared("register_admin", $query, $username, $name, $email, $hashedPassword);
			if (pg_affected_rows($result) == 1) {
				Utils::sendsuccess("User registered successfully!");
			} else {
				http_response_code(500);
				Utils::senderr("Failed to register user.");
			}
		} else {
			http_response_code(401);
			Utils::sendinvalid("Not allowed");
		}
	}

	private function is_valid_username_email(string $username, string $email): void 
	{
		if($this->check_username($username) === true) {
			throw new ClientException("The username is already taken");
		}
		if($this->check_email($email) === true) {
			throw new ClientException("The email is already taken");
		}
	}
}

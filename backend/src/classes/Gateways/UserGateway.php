<?php

class UserGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}
    
    private function check_user(int $user_id): void {
        if($this->conn->records_are_present("check_user", "SELECT * FROM users WHERE id=$1", $user_id) === false) {
            throw new ClientException("The user id provided $user_id is invalid");
        }
    }

    public function get_user_info(int $user_id): array {
        $this->check_user($user_id);
        $query = "SELECT u.id, u.username, u.email, u.name, ut.name, u.date_created FROM users u JOIN user_types ut ON u.user_type_id=ut.id WHERE u.id=$1";
        $result = $this->conn->execute_prepared("get_user_info", $query, $user_id);
        
        $row = pg_fetch_row($result); 
        return [
                "id" => intval($row[0]),
                "username" => $row[1],
                "email" => $row[2],
                "name" => $row[3], 
                "user_type" => $row[4],
                "date_created" => $row[5]
            ];
    }

    public function get_all_users(): array {
        $query = "SELECT id, username FROM users ORDER BY id";
        $result = $this->conn->execute_query($query);
        
        $users = array();
        while($row = pg_fetch_row($result)) {
            $users[] = [
                            "id" => intval($row[0]),
                            "username" => $row[1]
                        ];
        }
        return $users;
    }

    public function update_user_email(int $user_id, string $email): bool {
        $this->check_user($user_id);
        if($this->conn->records_are_present("check_if_email_used", "SELECT * FROM users WHERE email=$1", $email) === true)
        {
            throw new ClientException("The email is already in use");
        }
        $query = "UPDATE users SET email=$1 WHERE id=$2";
        $result = $this->conn->execute_prepared("update_email", $query, $email, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
    
    public function update_user_password(int $user_id, string $password): bool {
        $this->check_user($user_id);
        $query = "UPDATE users SET password=$1 WHERE id=$2";
        $hashedPassword = hash('sha512', $password . Secrets::passwordSalt);
        $result = $this->conn->execute_prepared("update_password", $query, $hashedPassword, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
    
    public function update_user_name(int $user_id, string $name): bool {
        $this->check_user($user_id);
        $query = "UPDATE users SET name=$1 WHERE id=$2";
        $result = $this->conn->execute_prepared("update_name", $query, $name, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
    
    public function update_user_username(int $user_id, string $username): bool {
        $this->check_user($user_id);
        if($this->conn->records_are_present("check_if_username_used", "SELECT * FROM users WHERE username=$1", $username) === true)
        {
            throw new ClientException("The username is already in use");
        }
        $query = "UPDATE users SET username=$1 WHERE id=$2";
        $result = $this->conn->execute_prepared("update_username", $query, $username, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
    
    public function update_user_usertype(int $user_id, string $user_type): bool {
        $this->check_user($user_id);
        if($this->conn->records_are_present("check_type", "SELECT * FROM user_types WHERE name=$1", $user_type) === false) {
            throw new ClientException("No such user_type"); 
        }
        $query = "UPDATE users SET user_type_id=(SELECT id FROM user_types WHERE name=$1) WHERE id=$2";
        $result = $this->conn->execute_prepared("update_usertype", $query, $user_type, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }

    public function delete_user(int $user_id): bool {
        $this->check_user($user_id);
        $query = "DELETE FROM users WHERE id=$1";
        $result = $this->conn->execute_prepared("update_usertype", $query, $user_id);
        if(pg_affected_rows($result) === 1) {
            return true;
        }
        return false;
    }
}

<?php

class UserGateway 
{
	private PostgreSQLDB $conn;

	public function __construct(PostgreSQLDB $connection) {
		$this->conn = $connection;
	}

	public function get_all(): array
	{
		$sql = "SELECT * FROM users";
		$result = $this->conn->execute_query($sql);

		$data = [];

		$rows = pg_fetch_all($result);

		if ($rows !== false) {
			foreach($rows as $row) {
				$row_data = [
						"username" => $row["username"],
						"id" => $row["id"],
						"name" => $row["name"],
						"email" => $row["email"],
				];
				$data[] = $row_data;
			}
		}

		return $data;
	}

	public function get(int $id): array
	{
		$sql = "SELECT * FROM users WHERE id=$1";
		$result = $this->conn->execute_prepared($sql, $id);

		$data = [];

		$rows = pg_fetch_all($result);

		if ($rows !== false) {
			foreach($rows as $row) {
				$row_data = [
						"username" => $row["username"],
						"id" => $row["id"],
						"name" => $row["name"],
						"email" => $row["email"],
				];
				$data[] = $row_data;
			}
		}

		return $data;
	}
}

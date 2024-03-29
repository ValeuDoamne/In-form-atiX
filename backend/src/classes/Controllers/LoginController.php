<?php

class LoginController implements Controller
{
	private LoginGateway $gateway;

	public function __construct(LoginGateway $gateway)
	{
		$this->gateway = $gateway;
	}

	public function handle(string $method, string $uri): void
	{
		if(strcmp($uri, "/api/v1/login") !== 0) {
			return;
		}

		switch ($method) {
			case "POST":
				$this->handle_login();
				break;
			default:
				http_response_code(405);
				header("Allow: POST");
		}		
	}
	
	private function handle_login(): void {
		$json_message = Utils::recvmsg();

		$usernameOrEmail = $json_message["username"];
		$password = $json_message["password"];
		
		if (filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL)) {
			$usernameOrEmail = filter_var($usernameOrEmail, FILTER_SANITIZE_EMAIL);
		} else {
			$usernameOrEmail = Utils::filter($usernameOrEmail);
		}
	
		$password = trim($password);

		$user_exists = $this->gateway->authenticate($usernameOrEmail, $password);
		if ($user_exists) {
			$details = $this->gateway->user_details($usernameOrEmail, $password);
			$jwt = JWT::generateToken($details["user_id"], $details["user_type"]);
			header("Authorization: Bearer " . $jwt);
			Utils::sendmsg([
				"status" => "Success",	
				"message" => "Login successful",
				"token" => $jwt,
			]);
		} else {
			Utils::sendinvalid("Login failed");
		}
	}

}

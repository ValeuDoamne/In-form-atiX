<?php

class LoginController implements Controller
{
	private $gateway;

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
	
	private function handle_login() {
		$json_message = Utils::recvmsg();

		$usernameOrEmail = $json_message["username"];
		$password = $json_message["password"];
		
		if (filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL)) {
			$usernameOrEmail = filter_var($usernameOrEmail, FILTER_SANITIZE_EMAIL);
		} else {
			$usernameOrEmail = filter_var($usernameOrEmail, FILTER_SANITIZE_STRIPPED);
		}
	
		$password = filter_var($password, FILTER_SANITIZE_STRIPPED);

		$result = $this->gateway->authenticate($usernameOrEmail, $password);
		if ($result === true) {
			$userid = $this->gateway->userid($usernameOrEmail, $password);
			$usertype = $this->gateway->usertype($usernameOrEmail, $password);
			$jwt = JWT::generateToken($userid, $usertype, Secrets::JWTSecret);
			header("Authorization: Bearer " . $jwt);
			Utils::sendsuccess("Login successful");
		} else {
			Utils::sendinvalid("Login failed");
		}
	}

}

<?php

class RegisterController implements Controller 
{
	private $gateway;

	public function __construct(RegisterGateway $gateway) 
	{
		$this->gateway = $gateway;
	}

	public function handle(string $method, string $uri): void {

		switch ($method) {
			case "GET":
				$this->handle_duplicates();
				break;
			case "POST":
				$this->handle_register();
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
		}
	}

	private function handle_duplicates() {
		if(isset($_GET["email"])) {
			$email = $_GET["email"];
			if(filter_var($email, FILTER_VALIDATE_EMAIL))
			{
				$email = filter_var($email, FILTER_SANITIZE_EMAIL);
				$result = $this->gateway->check_email($email);
				if( $result === true)
				{
					Utils::sendinvalid("This email is already taken");
				}
			} else {
				Utils::senderr("Not a valid email");
			}
		}
		if(isset($_GET["username"]))
		{
			$username = $_GET["username"];
			$username = filter_var($username, FILTER_SANITIZE_STRING);
			if($this->gateway->check_username($username) === true)
			{
				Utils::sendinvalid("This username is already taken");
			}
		}
	}

	private function handle_register()
	{
		$json_message = Utils::recvmsg();

		$type = filter_var($this->get_if_exists($json_message, "type"), FILTER_SANITIZE_STRIPPED);
		$username = filter_var($this->get_if_exists($json_message, "username"), FILTER_SANITIZE_STRIPPED);
		$email = filter_var($this->get_if_exists($json_message, "email"), FILTER_SANITIZE_STRIPPED);
		if(filter_var($email, FILTER_VALIDATE_EMAIL))
		{
			$email = filter_var($email, FILTER_SANITIZE_EMAIL);
		} else {
			throw new Exception("Not a valid email address");
		}
		$password = filter_var($this->get_if_exists($json_message, "password"), FILTER_SANITIZE_STRIPPED);
		$name = filter_var($this->get_if_exists($json_message, "name"), FILTER_SANITIZE_STRIPPED);
		
		switch ($type) {
			case "student":
				$this->gateway->register_student($email, $username, $name, $password);
				break;
			case "teacher": {
				$school = filter_var($this->get_if_exists($json_message, "school"), FILTER_SANITIZE_STRIPPED);
				$this->gateway->register_teacher($email, $username, $name, $password, $school);
				break;
			}
			case "admin": {
				$secretCode = filter_var($this->get_if_exists($json_message, "secret_code"), FILTER_SANITIZE_STRIPPED);
				$this->gateway->register_admin($email, $username, $name, $password, $secretCode);
				break;
			}
			default:
				http_response_code(404);
				Utils::senderr("Not such type of user");
		}
	}

	private function get_if_exists(array $queried, string $field): string
	{
		if(isset($queried, $field)) {
			return $queried[$field];
		}
		Utils::senderr("Field " . $field . " required for registration");
		exit(0);
	}
}

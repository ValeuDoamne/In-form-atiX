<?php

class RegisterController implements Controller 
{
	private RegisterGateway $gateway;

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

	private function handle_duplicates(): void {
		if(isset($_GET["email"])) {
			$email = $_GET["email"];
			if(filter_var($email, FILTER_VALIDATE_EMAIL))
			{
				$email = filter_var($email, FILTER_SANITIZE_EMAIL);
				$result = $this->gateway->check_email($email);
				if( $result === true)
				{
					Utils::sendinvalid("This email is already taken");
                } else {
					Utils::sendsuccess("This email is valid");
                }
			} else {
				Utils::sendinvalid("Not a valid email");
			}
		}
		if(isset($_GET["username"]))
		{
            $username = $_GET["username"];
            if(filter_var($username, FILTER_VALIDATE_EMAIL) === false) {
                $username = Utils::filter($username);
                if(strlen($username) === 0) {
                    throw new ClientException("The username cannot be empty");
                }
                if($this->gateway->check_username($username) === true)
                {
                    Utils::sendinvalid("This username is already taken");
                } else {
                    Utils::sendsuccess("This username is valid");
                }
            } else {
                Utils::sendinvalid("An username cannot be an email address");
            }
		}
	}

	private function handle_register(): void
	{
		$json_message = Utils::recvmsg();

		$type = Utils::filter($this->get_if_exists($json_message, "type"));
		$username = Utils::filter($this->get_if_exists($json_message, "username"));
		$email = trim($this->get_if_exists($json_message, "email"));
		if(filter_var($email, FILTER_VALIDATE_EMAIL))
		{
			$email = filter_var($email, FILTER_SANITIZE_EMAIL);
		} else {
			throw new ClientException("Not a valid email address");
		}
		$password = trim($this->get_if_exists($json_message, "password"));
		$name = Utils::filter($this->get_if_exists($json_message, "name"));
			
		switch ($type) {
			case "student":
				$this->gateway->register_student($email, $username, $name, $password);
				break;
			case "teacher": {
				$school = Utils::filter($this->get_if_exists($json_message, "school"));
				$this->gateway->register_teacher($email, $username, $name, $password, $school);
				break;
			}
			case "admin": {
				$secretCode = trim($this->get_if_exists($json_message, "secret_code"));
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
        throw new ClientException("Field $field required for registration");
	}
}

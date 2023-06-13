<?php

class Utils 
{
	public static function sendmsg(array $data): void
	{
		echo json_encode($data);
	}
	
	public static function recvmsg() : array
	{
		$message = json_decode(file_get_contents('php://input'), true);
		if($message === null) 
		{
			http_response_code(400);
			throw new Exception("The JSON provided in the request body is not valid.");
		} else {
			return $message;
		}
	}

	public static function sendsuccess(string $message): void
	{
		echo json_encode(
			[
				"status" =>  "Success",
				"message" => $message,
			]
		);
	}

	public static function sendinvalid(string $message): void {
		echo json_encode(
				[
					"status" => "Invalid",
					"message" => $message
				]
		);	
	}
	
	public static function senderr(string $message): void {
		echo json_encode(
				[
					"status" => "Error",
					"message" => $message
				]
		);
		exit(0);
	}

	public static function getAuthorization(): array {
		$token = JWT::getBearerToken();
		return JWT::validateAuthorization($token);
	}
    
    public static function filter(string $filtered): string {
        return trim(filter_var($filtered, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    }
}

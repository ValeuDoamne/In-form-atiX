<?php

class ErrorHandler
{
    public static function handleException(Throwable $exception): void
    {

		$response = [
            "status" => 500,
            "message" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
		];

		if($exception->getCode() !== 0) {
			$response["status"] = $exception->getCode();
		}
		
        http_response_code($response["status"]);
		Utils::sendmsg($response);
    }
	
    public static function handleError(
        int $errno,
        string $errstr,
        string $errfile,
        int $errline
    ): bool
    {
        throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
    }
}

?>

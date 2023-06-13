<?php

class ErrorHandler
{
    public static function handleException(Throwable $exception): void
    {

		$response = [
            "status" => "Error",
            "message" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
		];

		if($exception->getCode() !== 0) {
            if($exception->getCode() >= 400 && $exception->getCode() < 500) {
		    	$response["status"] = "Invalid";
            }
        }
	    if($exception->getCode() === 0) {
            http_response_code(500);
        } else {
            http_response_code($exception->getCode());
        }
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

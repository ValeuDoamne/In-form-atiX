<?php

class ClientException extends Exception {
	
	public function __construct(string $msg, int $code = 400) {
		$this->code = $code;
		$this->message = $msg;
	}

}

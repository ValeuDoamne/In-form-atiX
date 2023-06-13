<?php

class ClientException extends Exception {

    // Status 200 deoarece in cazul de erori 400 nu se va trimite header-ul
    // Access-Control-Allow-Origin pentru CORS
    public function __construct(string $msg, int $code = 200) {
		$this->code = $code;
		$this->message = $msg;
	}

}

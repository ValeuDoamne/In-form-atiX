<?php

class UnreleasedProblemController implements Controller {
  private UnreleasedProblemGateway $gateway;
  private $authorization;

  public function __construct(UnreleasedProblemGateway $gateway) {
		$this->gateway = $gateway;
	}

	public function handle(string $method, string $uri): void {
    $this->authorization = Utils::getAuthorization();
		switch($method) {
			case "GET":
				$this->handle_get($uri);
				break;
			case "POST":
				$this->handle_post($uri);
        break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
		}
	}

  private function handle_get(string $uri): void {
    if($this->authorization["user_type"] !== "admin") {
      http_response_code(401);
      Utils::sendinvalid("Not Authorized");
      return;
    }

    if (strcmp($uri, "/api/v1/unreleased_problems/all") === 0) {
      $this->send_all_problems();
    } else if (preg_match("/^\/api\/v1\/unreleased_problems\/(\d+)$/", $uri, $matches)){
      $problem_id = intval($matches[1], 10);
      $this->send_problem_with_id($problem_id); 
    } else {
      http_response_code(404);
      Utils::sendinvalid("Not found");
    }
  }

  private function send_all_problems() : void {
    http_response_code(200);
    Utils::sendmsg(["status" => "Success", "unreleased_problems"=> $this->gateway->get_all_problems()]);
  }

  private function send_problem_with_id(int $problem_id) : void {
    http_response_code(200);
    Utils::sendmsg(["status" => "Success", "unreleased_problem"=> $this->gateway->get_problem_with_id($problem_id)]);
  }

  private function handle_post(string $uri): void {
    if (strcmp($uri, "/api/v1/unreleased_problems/propose") === 0) {
      $json_message = Utils::recvmsg();
      $name = Utils::filter($json_message["name"]);
      $description = Utils::filter($json_message["description"]);
      $solution = Utils::filter($json_message["solution"]);
      $programming_language = Utils::filter($json_message["programming_language"]);
      
      if($this->authorization["user_type"] === "teacher" || $this->authorization["user_type"] === "admin") { 
        $this->propose_problem($name, $description, $solution, $programming_language);
      } else {
        http_response_code(401);
        Utils::sendinvalid("Not Authorized"); 
      }
    } else {
      http_response_code(501);
      Utils::sendinvalid("Not found");
    } 
  }

  private function propose_problem(string $name, string $description, string $solution, string $programming_language): void {
    if($this->gateway->exists_programming_language($programming_language) === false) {
      throw new ClientException("No such programming language"); 
    }
    if($this->gateway->propose_problem($this->authorization["user_id"] ,$name, $description, $solution, $programming_language) === true) {
      Utils::sendsuccess("Problem proposed");
    } else {
      Utils::senderr("Could not propose problem");
    }
  }
}

?>
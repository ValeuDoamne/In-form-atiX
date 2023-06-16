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
    } else if (preg_match("/^\/api\/v1\/unreleased_problems\/(\d+)$/", $uri, $matches)) {
      $problem_id = intval($matches[1], 10);
      $this->handle_problem_with_id($problem_id);
    } else {
      http_response_code(404);
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

  private function handle_problem_with_id(int $problem_id): void {
    if($this->authorization["user_type"] === "admin") {
      $json_message = Utils::recvmsg();
      $verdict = Utils::filter($json_message["verdict"]);
      if(strcmp($verdict, "approve") === 0) {
        $this->accept_problem($problem_id);
      } else if(strcmp($verdict, "deny") === 0) {
        $this->reject_problem($problem_id);
      } else {
        http_response_code(400);
        Utils::sendinvalid("Invalid action (required: 'approve' | 'deny')");
      }
    } else {
      http_response_code(401);
      Utils::sendinvalid("Not Authorized");
    }
  }

  private function accept_problem(int $problem_id): void {
    if($this->gateway->accept_problem($problem_id) === true) {
      Utils::sendsuccess("Problem with id $problem_id accepted");
    } else {
      Utils::senderr("Could not accept problem with id $problem_id");
    }
  }

  private function reject_problem(int $problem_id): void {
    if($this->gateway->reject_problem($problem_id) === true) {
      Utils::sendsuccess("Problem with id $problem_id rejected");
    } else {
      Utils::senderr("Could not reject problem with id $problem_id");
    }
  }

}

?>
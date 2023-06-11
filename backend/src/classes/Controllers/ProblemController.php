<?php

class ProblemController implements Controller {
    private ProblemGateway $gateway;
    private $authorization;
	public function __construct(ProblemGateway $gateway) {
		$this->gateway = $gateway;
	}

	public function handle(string $method, string $uri): void
    {
        $this->authorization = Utils::getAuthorization();
		switch($method) {
			case "GET":
				$this->handle_get($uri);
				break;
			case "POST":
				$this->handle_post($uri);
				break;
			case "DELETE":
				$this->handle_delete($uri);
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
		}
	}
    
    private function handle_get(string $uri): void {
        if (strcmp($uri, "/api/v1/problems/all") === 0) {
            $this->send_all_problems();
        } else if (strcmp($uri, "/api/v1/problems/all/tags") === 0) {
            $this->send_all_tags();
        } else if (preg_match("/^\/api\/v1\/problems\/\d+\/tags/", $uri)){
            $splited_uri = explode("/", $uri);
            $splited_uri = array_reverse($splited_uri);
            $problem_id = intval($splited_uri[1], 10);
            $this->send_problem_tags_with_id($problem_id); 
        } else if (preg_match("/^\/api\/v1\/problems\/\d+\/raport/", $uri)){
            $splited_uri = explode("/", $uri);
            $splited_uri = array_reverse($splited_uri);
            $problem_id = intval($splited_uri[1], 10);
            $this->send_problem_raport_with_id($problem_id); 
        } else if (preg_match("/^\/api\/v1\/problems\/\d+/", $uri)) {
            $splited_uri = explode("/", $uri);
            $problem_id = end($splited_uri);
            $this->send_problem_with_id($problem_id); 
        } else  {
            http_response_code(404);
            Utils::sendinvalid("Not found");
        }
	}

    private function send_all_problems(): void {
            http_response_code(200);
            Utils::sendmsg(["status" => "Success",
                            "problems"=> $this->gateway->get_all_problems()
                            ]);
    }
    
    private function send_all_tags(): void {
            http_response_code(200);
            Utils::sendmsg(["status" => "Success",
                            "tags"=> $this->gateway->get_all_tags()
                            ]);
    }

    private function has_solved_problem(int $id): bool {
        $user_id = $this->authorization["user_id"];
        $user_type = $this->authorization["user_type"];
        if($user_type === "admin") {
            return true;
        }
        if($this->gateway->user_solved_problem($user_id, $id)) {
            return true;
        }        
        return false;
    }    

    private function send_problem_with_id(int $id): void {
        http_response_code(200);
        if($this->has_solved_problem($id)) {
            Utils::sendmsg(["status" => "Success",
                            "problem"=> $this->gateway->get_problem_with_solution($id)
                            ]);
        } else {
            Utils::sendmsg(["status" => "Success",
                            "problem"=> $this->gateway->get_problem_without_solution($id)
                            ]);
        }
    }
    
    private function send_problem_tags_with_id(int $problem_id): void {
        http_response_code(200);
        Utils::sendmsg([
            "status" => "Succes",
            "tags" => $this->gateway->get_problem_tags($problem_id)        
        ]);    
    }

    private function send_problem_raport_with_id(int $problem_id): void {
        http_response_code(200);
        Utils::sendmsg([
            "status" => "Succes",
            "raport" => $this->gateway->get_problem_raport($problem_id)        
        ]);    
    }
    
	private function handle_post(string $uri): void {
        if (preg_match("/^\/api\/v1\/problems\/\d+\/tag/", $uri)) {
            $splited_uri = explode("/", $uri);
            $splited_uri = array_reverse($splited_uri);
            $problem_id = intval($splited_uri[1], 10);
            
            $json_message = Utils::recvmsg();
            $tag = filter_var($json_message["tag"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            
            if($this->authorization["user_type"] === "teacher" || $this->authorization["user_type"] === "admin") { 
                $this->tag_problem($problem_id, $tag);
            } else {
                http_response_code(401);
                Utils::sendinvalid("Not Authorized"); 
            }
        } else if (preg_match("/^\/api\/v1\/problems\/\d+\/submit/", $uri)) {
            $splited_uri = explode("/", $uri);
            $splited_uri = array_reverse($splited_uri);
            $problem_id = intval($splited_uri[1], 10);
            
            $json_message = Utils::recvmsg();
            $source_code = filter_var($json_message["source_code"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $programming_language = filter_var($json_message["programming_language"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            
            $this->submit_problem($problem_id, $source_code, $programming_language);
        } else {
            http_response_code(404);
            Utils::sendinvalid("Not found");
        } 
    }

    private function tag_problem(int $problem_id, string $tag): void {
        if($this->gateway->tag_problem($problem_id, $tag) === true) {
            Utils::sendsuccess("Succesfully tagged problem with id $problem_id");
        } else {
            Utils::senderr("Could not tag problem with id $problem_id");
        }
    }    

    private function submit_problem(int $problem_id, string $source_code, string $programming_language): void {
        if($this->gateway->exists_programming_language($programming_language) === false) {
           throw new ClientException("No such programming language"); 
        }
    }

    private function handle_delete($uri): void {
        if (preg_match("/^\/api\/v1\/problems\/\d+/", $uri)) {
            $splited_uri = explode("/", $uri);
            $splited_uri = array_reverse($splited_uri);
            $problem_id = intval($splited_uri[0], 10);
            
            $this->delete_problem($problem_id);            
        } else {
            http_response_code(404);
            Utils::sendinvalid("Not found");;
        }
    }
    
    private function delete_problem(int $problem_id): void {
        if($this->authorization["user_type"] !== "admin") { 
            http_response_code(401);
            Utils::sendinvalid("Not Authorized");
            return;
        }
        
        if($this->gateway->delete_problem($problem_id) === true) {
            Utils::sendsuccess("Succesfully deleted problem with id $problem_id");
        } else {
            Utils::senderr("Could not delete problem with id $problem_id");
        } 

    }    

}

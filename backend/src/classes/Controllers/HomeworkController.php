<?php

class HomeworkController implements Controller {
  private HomeworkGateway $gateway;
  private $authorization;

  public function __construct(HomeworkGateway $gateway) {
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
			case "DELETE":
				$this->handle_delete($uri);
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST, DELETE");
		}
	}

  private function handle_get(string $uri): void {
    if (preg_match("/^\/api\/v1\/homework\/(\d+)$/", $uri, $matches)) {
      $homework_id = intval($matches[1], 10);
      $this->check_homework_authorization($homework_id);
      $this->get_homework($homework_id);
    } else if (preg_match("/^\/api\/v1\/homework\/given\/(\d+)$/", $uri, $matches)){
      $class_id = intval($matches[1], 10);
      $this->check_class_authorization($class_id);
      $this->get_all_homework_of_class($class_id);
    } else if (preg_match("/^\/api\/v1\/homework\/submissions\/(\d+)$/", $uri, $matches)){
      $homework_id = intval($matches[1], 10);
      $this->check_homework_authorization($homework_id);
      $this->get_all_submissions_of_homework($homework_id);
    } else {
      http_response_code(404);
      Utils::sendinvalid("Not found");
    }
  }

  private function check_homework_authorization(int $homework_id): void {
    if($this->authorization["user_type"] === "admin") {
      return;
    }
    $user_id = $this->authorization["user_id"];
    if($this->gateway->is_user_teacher_of_homework($user_id, $homework_id) === false) {
      throw new ClientException("User $user_id is not a valid teacher for $homework_id (not a teacher or not part of the class)", 401);
    }
  }

  private function check_class_authorization(int $class_id): void {
    if($this->authorization["user_type"] === "admin") {
      return;
    }
    $user_id = $this->authorization["user_id"];
    if($this->gateway->is_user_teacher_of_class($user_id, $class_id) === false) {
      throw new ClientException("User $user_id is not a valid teacher for $class_id", 401);
    }
  }

  private function get_homework(int $homework_id): void {
    http_response_code(200);
    Utils::sendmsg(["status" => "Success", "homework"=> $this->gateway->get_homework($homework_id)]);
  }

  private function get_all_homework_of_class(int $class_id): void {
    http_response_code(200);
    Utils::sendmsg(["status" => "Success", "homework"=> $this->gateway->get_all_homework_of_class($class_id)]);
  }

  private function get_all_submissions_of_homework(int $homework_id): void {
    http_response_code(200);
    Utils::sendmsg(["status" => "Success", "submissions"=> $this->gateway->get_all_submissions_of_homework($homework_id)]);
  }

  private function handle_post(string $uri): void {
    if (preg_match("/^\/api\/v1\/homework\/post\/(\d+)$/", $uri, $matches)) {
      $class_id = intval($matches[1], 10);
      $this->check_class_authorization($class_id);
      $this->post_homework($class_id);
    } else {
      http_response_code(404);
      Utils::sendinvalid("Not found");
    }
  }

  private function post_homework(int $class_id): void {
    $json_message = Utils::recvmsg();
    $name = Utils::filter($json_message["name"]);
    $time_limit = intval(Utils::filter($json_message["time_limit"]));
    $problems = $json_message["problems"];
    if($this->gateway->post_homework($class_id, $name, $time_limit, $problems) === true) {
      Utils::sendsuccess("Homework for class $class_id posted");
    } else {
      Utils::sendinvalid("Homework for class $class_id could not be posted");
    }
  }

  private function handle_delete(string $uri): void {
    if(preg_match("/^\/api\/v1\/homework\/(\d+)$/", $uri, $matches)) {
      $homework_id = intval($matches[1], 10);
      $this->check_homework_authorization($homework_id);
      $this->delete_homework($homework_id);
    } else {
      http_response_code(404);
      Utils::sendinvalid("Not found");
    }
  }

  private function delete_homework(int $homework_id): void {
    if($this->gateway->delete_homework($homework_id) === true) {
      Utils::sendsuccess("Homework $homework_id deleted");
    } else {
      Utils::sendinvalid("Homework $homework_id could not be deleted");
    }
  }

}
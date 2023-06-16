<?php

class ClassroomController implements Controller {
    private ClassroomGateway $gateway;    
    private array $authorization;    

    public function __construct(ClassroomGateway $gateway) {
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
        if($uri === "/api/v1/classrooms/mine") {
            if($this->authorization["user_type"] === "student") {
                $this->send_student_classrooms(); 
            } else if($this->authorization["user_type"] === "teacher") {
                $this->send_teacher_classrooms();
            } else {
                throw new ClientException("Not authorized");
            }
        } else if (preg_match("/^\/api\/v1\/classrooms\/(\d+)$/", $uri, $matches)) {
            $class_id = intval($matches[1]);
            if($this->authorization["user_type"] === "student") {
                $this->send_student_classroom($class_id);
            } else if($this->authorization["user_type"] === "teacher") {
                $this->send_teacher_classroom($class_id);
            } else {
                throw new ClientException("Not authorized");
            }
        } else if (preg_match("/^\/api\/v1\/classrooms\/colleagues/", $uri)) {
            if($this->authorization["user_type"] === "student") {
                $this->send_student_colleagues();
            } else if($this->authorization["user_type"] === "teacher") {
                $this->send_teacher_students();
            } else {
                throw new ClientException("Not authorized");
            }
        } else {
            http_response_code(404);
            Utils::sendinvalid("Not found");
        }
    }

    private function send_student_classrooms(): void {
        $user_id = $this->authorization["user_id"];
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_student_classrooms($user_id) 
        ]);
    }
    
    private function send_teacher_classrooms(): void {
        $user_id = $this->authorization["user_id"];
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_teacher_classrooms($user_id) 
        ]);
    }

    private function send_student_classroom(int $classroom_id): void {
        $user_id = $this->authorization["user_id"];
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_student_classroom($user_id, $classroom_id) 
        ]);
    }
    
    private function send_teacher_classroom(int $classroom_id): void {
        $user_id = $this->authorization["user_id"];
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_teacher_classroom($user_id, $classroom_id) 
        ]);
    }

    private function send_student_colleagues(): void {
        $class_id = intval($_GET["class_id"]);
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_colleagues_from_classroom($this->authorization["user_id"], $class_id)
        ]); 
    }
    
    private function send_teacher_students(): void {
        $class_id = intval($_GET["class_id"]);
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->get_students_from_classroom($this->authorization["user_id"], $class_id)
        ]); 
    }

    private function handle_post(string $uri): void {
        if($uri === "/api/v1/classrooms/create") {
            if($this->authorization["user_type"] === "teacher") {
               $this->create_classroom(); 
            } else {
                throw new ClientException("Not authorized");
            }
        } else if($uri === "/api/v1/classrooms/join") {
            if($this->authorization["user_type"] === "student") {
               $this->join_classroom(); 
            } else {
                throw new ClientException("Not authorized");
            }
        } else if($uri === "/api/v1/classrooms/change_name") {
            if($this->authorization["user_type"] === "teacher") {
                $this->change_classroom_name();
            } else {
                throw new ClientException("Not authorized");
            }
        } else {
            http_response_code(404);
            Utils::sendinvalid("Not found");
        }
    }
    
    private function create_classroom(): void {
        $json_message = Utils::recvmsg();
        $name = Utils::filter($json_message["name"]);
        $teacher_id = $this->authorization["user_id"];
        if(strlen($name) === 0) {
            throw new ClientException("The name of the class cannot be empty");
        }
        if($this->gateway->create_classroom($teacher_id, $name) === true) {
            Utils::sendsuccess("Class created successfully");
        } else {
            Utils::senderr("Could not create class");
        } 
    }

    private function join_classroom(): void {
        $json_message = Utils::recvmsg();
        $code = Utils::filter($json_message["code"]);
        $student_id = $this->authorization["user_id"];
        if($this->gateway->join_classroom($student_id, $code)) {
            Utils::sendsuccess("Joined classroom successfully");
        } else {
            Utils::senderr("Could not join classroom");
        }
    }
    
    private function change_classroom_name(): void {
        $json_message = Utils::recvmsg();
        $name = Utils::filter($json_message["name"]);
        $classroom_id = Utils::filter($json_message["class_id"]);
        $teacher_id = $this->authorization["user_id"];
        if($this->gateway->change_classroom_name($teacher_id, $classroom_id, $name)) {
            Utils::sendsuccess("Name of classroom changed successfully");
        } else {
            Utils::senderr("Could not change classroom name");
        }
    }
     
    private function handle_delete(string $uri): void {
        if(preg_match("/^\/api\/v1\/classrooms\/(\d+)$/", $uri, $matches)) {
            if($this->authorization["user_type"] === "teacher") {
                $class_id = intval($matches[1]);
                $this->delete_classroom($class_id);
            } else {
                throw new ClientException("Not authorized");
            }
        } else if($uri === "/api/v1/classrooms/remove_student") {
            if($this->authorization["user_type"] === "teacher") {
                $this->delete_student_from_classroom();
            } else {
                throw new ClientException("Not authorized");
            }
        } else {
            http_response_code(404);
            Utils::sendinvalid("Not found");
        }
    }

    private function delete_classroom(int $class_id): void {
        $teacher_id = $this->authorization["user_id"];
        if($this->gateway->delete_classroom($teacher_id, $class_id)) {
            Utils::sendsuccess("Successfuly deleted classroom");
        } else {
            Utils::senderr("Could not delete classroom");
        }
    }
    
    private function delete_student_from_classroom(): void {
        $json_message = Utils::recvmsg();
        $class_id = Utils::filter($json_message["class_id"]);
        $student_id = Utils::filter($json_message["student_id"]);
        $teacher_id = $this->authorization["user_id"];
        if($this->gateway->remove_student_from_classroom($teacher_id, $student_id, $class_id)) {
            Utils::sendsuccess("Successfuly deleted student from classroom");
        } else {
            Utils::senderr("Could not delete student classroom");
        }
    }
}

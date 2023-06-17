<?php

class AdminPostController implements Controller {
    private AdminPostGateway $gateway;
    private array $authorization;

    public function __construct(AdminPostGateway $gateway) {
        $this->gateway = $gateway;
    }

    public function handle(string $method, string $uri): void {
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

    public function handle_get(string $uri): void {
        if($uri === "/api/v1/announcements") {
           Utils::sendmsg([
                "status" => "Success",
                "announcements" => $this->gateway->get_announcements(),
            ]);
        } else {
            throw new ClientException("Not found");
        }
    }
    
    public function handle_post(string $uri): void {
        if($uri === "/api/v1/announcements") {
           $this->authorization = Utils::getAuthorization();
           if($this->authorization["user_type"] === "admin") {
                $this->submit_post();
           } else {
                throw new ClientException("Not authorized");
           }
        } else {
            throw new ClientException("Not found");
        }
    }

    private function submit_post(): void {
        $json_message = Utils::recvmsg();
        $title = Utils::filter($json_message["title"]);
        $content = Utils::filter($json_message["content"]);
    
        if(strlen($title) === 0) {
            Utils::sendinvalid("Title cannot be empty");
        }
        if(strlen($content) === 0) {
            Utils::sendinvalid("Content cannot be empty");
        }
        $user_id = $this->authorization["user_id"];
        if($this->gateway->insert_post($user_id, $title, $content) === true) {
            Utils::sendsuccess("Succesfully inserted new post");
        } else {
            Utils::senderr("Could not insert new post");
        }
    }
    
    public function handle_delete(string $uri): void {
        if($uri === "/api/v1/announcements") {
           $this->authorization = Utils::getAuthorization();
           if($this->authorization["user_type"] === "admin") {
                $this->delete_post();
           } else {
                throw new ClientException("Not authorized");
           }
        } else {
            throw new ClientException("Not found");
        }
    }
    
    private function delete_post(): void {
        $json_message = Utils::recvmsg();
        $post_id = Utils::filter($json_message["id"]);
        $post_id = intval($post_id);
        if($this->gateway->delete_post($post_id) === true) {
            Utils::sendsuccess("Succesfully deleted post");
        } else {
            Utils::senderr("Could not delete post");
        }
    }
}

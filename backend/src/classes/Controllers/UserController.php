<?php 

class UserController implements Controller
{
	private UserGateway $gateway;
    private array $authorization;    

	public function __construct(UserGateway $gateway)
	{
		$this->gateway = $gateway;
	}

    private function is_admin(): void {
        if($this->authorization["user_type"] !== "admin") {
            throw new ClientException("Not Authorized");
        }
    }

    public function handle(string $method, string $uri): void {
        $this->authorization = Utils::getAuthorization();
        switch ($method) {
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
        if ($uri === "/api/v1/users/me") {
            $user_id = $this->authorization["user_id"];
            Utils::sendmsg([
                "status" => "Success",
                "user" => $this->gateway->get_user_info($user_id)
            ]);
        } else if($uri === "/api/v1/users/me/user_type") {
            $user_type = $this->authorization["user_type"];
            Utils::sendmsg([
                "status" => "Success",
                "user_type" => $user_type 
            ]);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)/", $uri, $matches)) {
            $this->is_admin();

            $user_id = intval($matches[1], 10);
            Utils::sendmsg([
                "status" => "Success",
                "user" => $this->gateway->get_user_info($user_id)
            ]);
        } else if(preg_match("/^\/api\/v1\/users\/all$/", $uri)) {
            $this->is_admin();

            Utils::sendmsg([
                "status" => "Success",
                "users" => $this->gateway->get_all_users()
            ]);
        }
    }
    
    private function handle_post(string $uri): void {
        if ($uri === "/api/v1/users/me/email") {
            $user_id = $this->authorization["user_id"];
            $this->update_email($user_id);
        } else if($uri === "/api/v1/users/me/password") {
            $user_id = $this->authorization["user_id"];
            $this->update_password($user_id);
        } else if($uri === "/api/v1/users/me/name") {
            $user_id = $this->authorization["user_id"];
            $this->update_name($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)\/email$/", $uri, $matches)) {
            $this->is_admin();
            $user_id = intval($matches[1], 10); 
            $this->update_email($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)\/pasword$/", $uri, $matches)) {
            $this->is_admin();
            $user_id = intval($matches[1], 10); 
            $this->update_password($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)\/name$/", $uri, $matches)) {
            $this->is_admin();
            $user_id = intval($matches[1], 10); 
            $this->update_name($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)\/username$/", $uri, $matches)) {
            $this->is_admin();
            $user_id = intval($matches[1], 10); 
            $this->update_username($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)\/user_type$/", $uri, $matches)) {
            $this->is_admin();
            $user_id = intval($matches[1], 10); 
            $this->update_usertype($user_id);
        } else {
            throw new ClientException("Not found", 404);
        }
    }

    private function update_email(int $user_id): void {
        $json_message = Utils::recvmsg();
        $email = $json_message["email"];
        if(filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new ClientException("Invalid email address provided");
        } 
        $email = filter_var($email, FILTER_SANITIZE_EMAIL); 

        if($this->gateway->update_user_email($user_id, $email)) {
            Utils::sendsuccess("Successfuly updated email address");
        } else {
            Utils::senderr("Could not update email address");
        }
    }

    private function update_password(int $user_id): void {
        $json_message = Utils::recvmsg();
        $password = Utils::filter($json_message["password"]);

        if($this->gateway->update_user_password($user_id, $email)) {
            Utils::sendsuccess("Successfuly updated password");
        } else {
            Utils::senderr("Could not update password");
        }
    }
    
    private function update_name(int $user_id): void {
        $json_message = Utils::recvmsg();
        $name = Utils::filter($json_message["name"]);

        if($this->gateway->update_user_name($user_id, $name)) {
            Utils::sendsuccess("Successfuly updated name");
        } else {
            Utils::senderr("Could not update name");
        }
    }
    
    private function update_username(int $user_id): void {
        $json_message = Utils::recvmsg();
        $username = Utils::filter($json_message["username"]);

        if($this->gateway->update_user_username($user_id, $username)) {
            Utils::sendsuccess("Successfuly updated username");
        } else {
            Utils::senderr("Could not update username");
        }
    }
    
    private function update_usertype(int $user_id): void {
        $json_message = Utils::recvmsg();
        $user_type = Utils::filter($json_message["user_type"]);

        if($this->gateway->update_user_usertype($user_id, $user_type)) {
            Utils::sendsuccess("Successfuly updated user_type");
        } else {
            Utils::senderr("Could not update user_type");
        }
    }

    private function handle_delete(string $uri): void {
        if($uri === "/api/v1/users/me") {
            $user_id = $this->authorization["user_id"];
            $this->delete_user($user_id);
        } else if(preg_match("/^\/api\/v1\/users\/(\d+)$/", $uri, $matches)) {
            $this->is_admin();

            $user_id = intval($matches[1], 10);
            $this->delete_user($user_id);
        } else {
            throw new ClientException("Not found", 404);
        }
    }
    
    private function delete_user(int $user_id): void {
        if($this->gateway->delete_user($user_id)) {
            Utils::sendsuccess("Successfuly deleted user with id $user_id");
        } else {
            Utils::senderr("Could not delete user with id $user_id");
        }
    }
}

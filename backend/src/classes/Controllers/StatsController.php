<?php 

class StatsController implements Controller
{
	private StatsGateway $gateway;
    private array $authorization;    

	public function __construct(StatsGateway $gateway)
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
        $this->is_admin();
        switch ($method) {
            case "GET":
                    $this->handle_get($uri);
                    break;
            default:
                    http_response_code(405);
                    header("Allow: GET");
        }
    }

    private function handle_get(string $uri): void {
        switch($uri) {
            case "/api/v1/stats/all":
                $this->get_all();
                break;
            case "/api/v1/stats/users":
                $this->get_users();
                break;
            case "/api/v1/stats/problems":
                $this->get_problems();
                break;
            case "/api/v1/stats/submissions":
                $this->get_submissions();
                break;
            case "/api/v1/stats/classrooms":
                $this->get_classrooms();
                break;
            case "/api/v1/stats/new_problems":
                $this->get_new_problems();
                break;
            case "/api/v1/stats/schools":
                $this->get_schools();
                break;
            case "/api/v1/stats/comments":
                $this->get_comments();
                break;
            case "/api/v1/stats/ratings":
                $this->get_ratings();
                break;
        }
    }
    
    private function get_all(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => [
                "users" => $this->gateway->number_of_users(),
                "problems" => $this->gateway->number_of_problems(),
                "new_problems" => $this->gateway->number_of_new_problems(),
                "classrooms" => $this->gateway->number_of_classrooms(),
                "submissions" => $this->gateway->number_of_submissions(),
                "schools" => $this->gateway->number_of_schools(),
                "comments" => $this->gateway->number_of_comments(),
                "ratings" => $this->gateway->number_of_ratings(),
            ]
        ]);
    }

    private function get_users(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_users()
        ]);
    }
    private function get_problems(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_problems()
        ]);
    }
    private function get_new_problems(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_new_problems()
        ]);
    }
    private function get_classrooms(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_classrooms()
        ]);
    }
    
    private function get_submissions(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_submissions()
        ]);
    }

    private function get_schools(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_schools()
        ]);
    }
    
    private function get_comments(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_comments()
        ]);
    }

    private function get_ratings(): void {
        Utils::sendmsg([
            "status" => "Success",
            "data" => $this->gateway->number_of_ratings()
        ]);
    }
}

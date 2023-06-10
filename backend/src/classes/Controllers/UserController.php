<?php 

class UserController implements Controller
{
	private $gateway;

	public function __construct(UserGateway $gateway)
	{
		$this->gateway = $gateway;
	}


	public function handle(string $method, string $uri): void
	{

		if(Utils::isAuthorized() === false) {
			Utils::senderr("Not authorized");
		}

		$parts = explode("/", $uri);
		$id = $parts[4] ?? null;

		if ($id) {
			$this->process_id_request($method, $id);
		} else {
			$this->process_collection_request($method);
		}
	}

	private function process_id_request(string $method, string $id): void {
		$new_id = intval($id);
		switch ($method) {
			case "GET":
				echo json_encode($this->gateway->get($id));
				break;
			default:
				http_response_code(405);
				header("Allow: GET");
		}

	}

	private function process_collection_request(string $method): void {
		switch ($method) {
			case "GET":
				echo json_encode($this->gateway->get_all());
				break;
			default:
				http_response_code(405);
				header("Allow: GET");
		}
	}
}

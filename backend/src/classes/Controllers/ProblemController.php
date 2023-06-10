<?php

class ProblemController implements Controller {
	private $gateway;

	public function __construct(ProblemGateway $gateway) {
		$this->gateway = $gateway;
	}

	public function handle(string $method, string $uri): void
	{
		switch($method) {
			"GET":
				$this->handle_get(string $uri);
				break;
			"POST":
				$this->handle_post(string $uri);
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
		}
	}

	private function handle_get(string $uri): void {
		$response = json_encode("");
		if(isset($_GET["filters"])) {
			$tags = json_decode($_GET["filters"]);
			if(gettype($tags) === "array") {
				$response = process_tags($tags);
			}
		}

		return $response; 
	}

	private function process_tags(array $tags): string {
		$problem_collection = array();
		for($tags as $tag) {
			$problems = $this->gateway->get_problems($tag);
			$problems_collection
		}
		return $problem_collection;
	}

	private function handle_post(string $uri): void {
	
	}
}

<?php 

class Route {
	private static $routes = array();

	public static function route_address(string $uri, Controller $handler): void {
		self::$routes[$uri] = $handler;
	}

	public static function handle(string $method, string $uri): void
	{
		$is_handled = false;
		foreach(self::$routes as $key => $handler) {
			if(substr($uri, 0, strlen($key)) === $key) {
				$is_handled = true;
				$handler->handle($method, $uri);
				break;
			}
		}
		if(! $is_handled ) {
			http_response_code(404);
		}
	}
}

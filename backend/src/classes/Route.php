<?php 

class Route {
	private static $routes = array();

	public static function route_address(string $uri, string $handler): void {
		self::$routes[$uri] = $handler;
	}

	public static function handle(string $method, string $uri): void
	{
		$is_handled = false;
		foreach(self::$routes as $key => $handler) {
            if(substr($uri, 0, strlen($key)) === $key) {
                $gateway_class = $handler . "Gateway";
                $controller_class = $handler . "Controller";
                
                $db_connection = DatabaseConnection::getConnection();
                $gateway = new $gateway_class($db_connection);
                $controller = new $controller_class($gateway);
                
                $controller->handle($method, $uri);
                
                $is_handled = true;
				break;
			}
		}
		if(! $is_handled ) {
			http_response_code(404);
		}
	}
}

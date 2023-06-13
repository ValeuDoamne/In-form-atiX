<?php

declare(strict_types=1);

spl_autoload_register(function ($class) {
	if(file_exists(__DIR__ . "/classes/Controllers/$class.php") === true) {
		require __DIR__ . "/classes/Controllers/$class.php";
	}
	if(file_exists(__DIR__ . "/classes/Gateways/$class.php") === true) {
		require __DIR__ . "/classes/Gateways/$class.php";
	}
	if(file_exists(__DIR__ . "/classes/$class.php") === true) {
		require __DIR__ . "/classes/$class.php";
	}
});

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");
header("Content-type: application/json; charset=UTF-8");

DatabaseConnection::init("informatix", "postgres", "postgres", "database");


$connection = DatabaseConnection::getConnection();
$user_gateway = new UserGateway($connection);
$login_gateway = new LoginGateway($connection);
$register_gateway = new RegisterGateway($connection);
$search_gateway = new SearchGateway($connection);
$problem_gateway = new ProblemGateway($connection);

Route::route_address("/api/v1/users",    new UserController($user_gateway));
Route::route_address("/api/v1/login",    new LoginController($login_gateway));
Route::route_address("/api/v1/register", new RegisterController($register_gateway));
Route::route_address("/api/v1/search",   new SearchController($search_gateway));
Route::route_address("/api/v1/problems", new ProblemController($problem_gateway));

$method = $_SERVER["REQUEST_METHOD"];
$uri    = $_SERVER["REQUEST_URI"];
Route::handle($method, $uri);

?>

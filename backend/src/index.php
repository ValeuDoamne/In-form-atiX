<?php

declare(strict_types=1);

spl_autoload_register(function ($class) {
    require __DIR__ . "/classes/$class.php";
});

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");
header("Content-type: application/json; charset=UTF-8");
header("HTTP/1.1 200 OK");

DatabaseConnectionPool::init("informatix", "postgres", "postgres", "database");


$user_conn = DatabaseConnectionPool::getConnection();
$user_gateway = new UserGateway($user_conn);

$login_conn = DatabaseConnectionPool::getConnection();
$login_gateway = new LoginGateway($login_conn);
$register_conn = DatabaseConnectionPool::getConnection();
$register_gateway = new RegisterGateway($register_conn);

Route::route_address("/api/v1/users", new UserController($user_gateway));
Route::route_address("/api/v1/login", new LoginController($login_gateway));
Route::route_address("/api/v1/register", new RegisterController($register_gateway));

$method = $_SERVER["REQUEST_METHOD"];
$uri    = $_SERVER["REQUEST_URI"];
Route::handle($method, $uri);

DatabaseConnectionPool::releaseConnection($register_conn);
DatabaseConnectionPool::releaseConnection($login_conn);
DatabaseConnectionPool::releaseConnection($user_conn);

?>

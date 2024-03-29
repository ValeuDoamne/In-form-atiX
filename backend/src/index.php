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

Route::route_address("/api/v1/users",    "User");
Route::route_address("/api/v1/login",    "Login");
Route::route_address("/api/v1/register", "Register");
Route::route_address("/api/v1/search",   "Search");
Route::route_address("/api/v1/problems", "Problem");
Route::route_address("/api/v1/stats", "Stats");
Route::route_address("/api/v1/announcements", "AdminPost");
Route::route_address("/api/v1/classrooms", "Classroom");
Route::route_address("/api/v1/unreleased_problems", "UnreleasedProblem");
Route::route_address("/api/v1/homework", "Homework");


$method = $_SERVER["REQUEST_METHOD"];
$uri    = $_SERVER["REQUEST_URI"];
Route::handle($method, $uri);

?>

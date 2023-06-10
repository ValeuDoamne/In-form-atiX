<?php

interface Controller {
	public function handle(string $method, string $uri): void;
}

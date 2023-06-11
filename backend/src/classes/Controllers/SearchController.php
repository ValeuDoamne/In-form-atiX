<?php

class SearchController implements Controller {
    private SearchGateway $gateway;

    public function __construct(SearchGateway $gateway) {
        $this->gateway = $gateway;
    }    

    public function handle(string $method, string $uri): void {

    }
}

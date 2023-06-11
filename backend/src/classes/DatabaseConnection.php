<?php

class DatabaseConnection {
    private static $connection = null;
    
    public static function init($dbname, $user, $password, $host = 'localhost', $port = 5432) {
        self::$connection = new PostgreSQLDB($dbname, $user, $password, $host, $port);
    }
    
    public static function getConnection(): PostgreSQLDB
    {
        return self::$connection;
    }
}

?>

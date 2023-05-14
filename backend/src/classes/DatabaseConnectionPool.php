<?php

class DatabaseConnectionPool {
    private static $connections = array();
    private static $limit;
    
    public static function init($dbname, $user, $password, $host = 'localhost', $port = 5432, $limit = 10) {
        self::$limit = $limit;
        for ($i = 0; $i < self::$limit; $i++) {
            $conn = new PostgreSQLDB($dbname, $user, $password, $host, $port);
            if (!$conn) {
                throw new Exception("Failed to connect to PostgreSQL database");
            }
            self::$connections[] = $conn;
        }
    }
    
    public static function getConnection() {
        if (empty(self::$connections)) {
            throw new Exception("Connection pool is empty");
        }
        return array_pop(self::$connections);
    }
    
    public static function releaseConnection($conn) {
        if (count(self::$connections) < self::$limit) {
            self::$connections[] = $conn;
        } else {
            pg_close($conn);
        }
    }
}

?>

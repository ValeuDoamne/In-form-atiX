<?php

class AdminPostGateway {
    private PostgreSQLDB $conn;

    function __construct(PostgreSQLDB $conn) {
        $this->conn = $conn;
    }

    public function get_announcements(): array {
        $query = "SELECT p.id, p.title, p.content, u.username, p.date_created FROM admin_posts p JOIN users u ON p.author = u.id ORDER BY p.date_created";
        $result = $this->conn->execute_query($query);
            
        $posts = array();
        while($row = pg_fetch_assoc($result)) {
            $posts[] = $row;
        }
        return $posts;
    } 

    public function insert_post(int $user_id, string $title, string $content): bool {
        $query = "INSERT INTO admin_posts(author, title, content) VALUES ($1, $2, $3)";
        $result = $this->conn->execute_prepared("insert_admin_announcement", $query, $user_id, $title, $content);
        
        if(pg_affected_rows($result) === 1)
            return true;
        return false;
    }
    
    public function delete_post(int $post_id): bool {
        if($this->conn->records_are_present("exists_admin_post", "SELECT * FROM admin_posts WHERE id=$1", $post_id) === false) {
            throw new ClientException("No such id $post_id");
        }
        $query = "DELETE FROM admin_posts WHERE id=$1";
        $result = $this->conn->execute_prepared("delete_admin_announcement", $query, $post_id);
        
        if(pg_affected_rows($result) === 1)
            return true;
        return false;
    }
}

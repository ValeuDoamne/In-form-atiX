<?php

class JWT {
	public static function generateToken(int $userId, string $userType, int $expireTime = 60*60*24): string {
		$header = json_encode(['typ' => 'JWT', 'alg' => 'HS512']);
		$payload = json_encode(['user_id' => $userId, 'user_type' => $userType, 'exp' => time() + $expireTime]);
		$base64UrlHeader = self::base64UrlEncoder($header); 
		$base64UrlPayload = self::base64UrlEncoder($payload); 

		$signature = hash_hmac('sha512', $base64UrlHeader . "." . $base64UrlPayload, Secrets::JWTSecret, true);
		$base64UrlSignature = self::base64UrlEncoder($signature); 

		return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
	}
	
	public static function decodeToken(string $jwtToken): array
    {
		$tokenParts = explode('.', $jwtToken);
		if(count($tokenParts) !== 3) {
			throw new ClientException("Not a valid JWT", 401);
		}
		$signature = self::base64UrlDecoder($tokenParts[2]); 
		$valid = hash_hmac('sha512', $tokenParts[0] . "." . $tokenParts[1], Secrets::JWTSecret, true);
		if (!hash_equals($valid, $signature)) {
			throw new ClientException("Not a valid JWT", 401);
		}
		$header = self::base64UrlDecoder($tokenParts[0]); 
		$payload = json_decode(self::base64UrlDecoder($tokenParts[1]), true);
		return $payload;
	}

	public static function base64UrlEncoder(string $data):string {
		return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
	}
	public static function base64UrlDecoder(string $data):string {
		return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
	}

	private static function isExpired(int $expireTime): bool  {
		if(time() <= $expireTime) {
			return false;
		}
	    return true;	
	}
	
	public static function validateAuthorization(string $jwtToken): array {
		$payload = self::decodeToken($jwtToken);
		if(self::isExpired($payload["exp"])) {
			http_response_code(401);
			header("Location: /login.html");
		}
		return $payload;
	}
	
    private static function getAuthorizationHeader(): string
    {
		$headers = null;
		if (isset($_SERVER['Authorization'])) {
			$headers = trim($_SERVER["Authorization"]);
		} else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
			$headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
		} else if (function_exists('apache_request_headers')) {
			$requestHeaders = apache_request_headers();
			$requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
			if (isset($requestHeaders['Authorization'])) {
				$headers = trim($requestHeaders['Authorization']);
			}
        }
        if($headers === null)
            return "";
		return $headers;
	}

    public static function getBearerToken(): string
    {
		$headers = self::getAuthorizationHeader();
		if (!empty($headers)) {
			if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
				return $matches[1];
			}
		}
		http_response_code(401);
		throw new ClientException("Not Authorized", 401);
	}

}

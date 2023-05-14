<?php

class JWT {
	public static function generateToken(int $userId, string $userType, string $secretKey, int $expireTime = 60*60*24): string {
		$header = json_encode(['typ' => 'JWT', 'alg' => 'HS512']);
		$payload = json_encode(['user_id' => $userId, 'user_type' => $userType, 'exp' => time() + $expireTime]);
		$base64UrlHeader = self::base64UrlEncoder($header); 
		$base64UrlPayload = self::base64UrlEncoder($payload); 

		$signature = hash_hmac('sha512', $base64UrlHeader . "." . $base64UrlPayload, $secretKey, true);
		$base64UrlSignature = self::base64UrlEncoder($signature); 

		return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
	}
	
	public static function decodeToken(string $jwtToken, string $secretKey): array
    {
		$tokenParts = explode('.', $token);
		if(count($tokenParts) !== 3) {
			throw new Exception("Not a valid JWT");
		}
		$signature = self::base64UrlDecoder($tokenParts[2]); 
		$valid = hash_hmac('sha512', $tokenParts[0] . "." . $tokenParts[1], $secretKey, true);
		if (!hash_equals($valid, $signature)) {
			throw new Exception("Not a valid JWT");
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
}

/**
 * Checks if a user is logged in by validation the JWT from local storage
 */
export default async function checkAuthState(){
  const token = localStorage.getItem('token');
  if(!token) {
    return false;
  }
  const decodedToken = decodeJWT(token);
  if(decodedToken?.payload?.exp < Date.now() / 1000) {
    return false;
  }
  return decodedToken?.payload?.user_type;
}


/**
 * Decodes a JWT
 * @param {string} token The JWT to decode 
 * @returns An object containing the header and payload of the JWT
 */
function decodeJWT(token) {
  const [headerEncoded, payloadEncoded] = token.split('.');
  const header = JSON.parse(base64UrlDecode(headerEncoded));
  const payload = JSON.parse(base64UrlDecode(payloadEncoded));

  return {
    header,
    payload
  };
}

/**
 * Helper function to decode a base64url encoded string
 * @param {string} str A base64 encoded string
 * @returns Decoded string
 */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

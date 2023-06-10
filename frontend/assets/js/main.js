import authCheck from './auth-check.js';

//Check auth state
const authState = await authCheck();

console.log(`Authenticated: ${authState}`);

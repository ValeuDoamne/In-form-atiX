import header from '../components/header.js';
import authCheck from './auth-check.js';

//Check auth state
const authState = await authCheck();

console.log(`Authenticated: ${authState}`);

//generating the page header
const headerElement = document.querySelector('header');
if(headerElement) {
  headerElement.classList.add('topnav');
  headerElement.insertAdjacentHTML('afterbegin', header(authState));
}

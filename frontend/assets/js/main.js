import header from './header.js';
import {authCheck} from './auth-check.js';

//Check auth state
const authState = authCheck();

console.log(`Authenticated: ${authState}`);

//generating the page header
const headerElement = document.querySelector('header');
if(headerElement) {
  headerElement.classList.add('topnav');
  headerElement.insertAdjacentHTML('afterbegin', header(authState));
}

/**
 * Logout function. Removes token from local storage
 */
window.logout = function logout() {
  localStorage.removeItem('token');
  location.href = "/index.html";
}

const modals = document.querySelectorAll('.modal');
if(modals.length) {
  window.onload = () => {
    modals.forEach((modal) => {
      //add close button
      const closeButton = document.createElement('span');
      closeButton.classList.add('close-btn');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        hideModal(modal.getAttribute('id'));
      });
    });
  }
}

/**
 * Show toggle for modal
 * @param {string} modalId The id of the modal to show
 */
window.showModal = function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('active');
  const container = modal.querySelector('.container');
  if(container.clientHeight > window.innerHeight) {
    container.classList.add('scroll');
  }
  document.addEventListener('click', (e) => {
    if (e.target.id === modalId) {
      hideModal(modalId);
    }
  });
}

/**
 * Hide toggle for modal
 * @param {string} modalId The id of the modal to hide
 */
window.hideModal = function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  document.removeEventListener('click', (e) => {
    if (e.target.id === modalId) {
      hideModal(modalId);
    }
  });
}

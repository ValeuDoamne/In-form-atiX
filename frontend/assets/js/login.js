/**
 * Temporary login simulation
 */
function login(){
  localStorage.clear('auth');
  const username = document.querySelector("form.login input[name='username']").value;
  const password = document.querySelector("form.login input[name='password']").value;
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  //save data in localstorage
  localStorage.setItem('auth', JSON.stringify({username, password}));

  //redirect to homepage
  window.location.replace('/');

  // return false; //prevents page reload
}


/**
 * Temporary check for a "logged in" user
 */
function checkAuthState(){
  const authData = JSON.parse(localStorage.getItem('auth'));
  if(!authData || !Object.keys(authData).includes("username")) {
    return;
  }
  const location = document.getElementById("auth-check");
  const usernameP = document.createElement("p");
  usernameP.appendChild(document.createTextNode(`Authenticated user: ${authData.username}`));
  location.insertAdjacentElement('afterbegin', usernameP);
}

// add on load event to check for the authstate
document.addEventListener("DOMContentLoaded", function() {
  checkAuthState();
});
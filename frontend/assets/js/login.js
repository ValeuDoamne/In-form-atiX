/**
 * Temporary login simulation
 */
function login(){
  const username = document.querySelector("form.login input[name='username']").value;
  const password = document.querySelector("form.login input[name='password']").value;

  //send data to backend
  fetch("http://localhost:8000/api/v1/login", {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({username, password})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.status == "Success") {
      localStorage.setItem('token', data.token);
    } else if (data.status == "Invalid") {
      console.log(data.message);
    }
  })
  .catch(console.error)
  .finally(() => {
    //redirect to homepage
    // window.location.replace('/');
  });
}


/**
 * Temporary check for a "logged in" user
 */
function checkAuthState(){
  const token = localStorage.getItem('token');
  if(!token) {
    return;
  }
  const location = document.getElementById("auth-check");
  const usernameP = document.createElement("p");
  usernameP.appendChild(document.createTextNode(`A user is logged in!`));
  location.insertAdjacentElement('afterbegin', usernameP);
}

// add on load event to check for the authstate
document.addEventListener("DOMContentLoaded", function() {
  checkAuthState();
});
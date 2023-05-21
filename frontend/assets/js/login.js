/**
 * Temporary login simulation
 */
function login(){
  localStorage.clear('auth');
  const username = document.querySelector("form.login input[name='username']").value;
  const password = document.querySelector("form.login input[name='password']").value;

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
      const token = data.token;
      localStorage.setItem('token', token);
    } else if (data.status == "Invalid") {
      console.log("Invalid username or password");
    } else {
      return data;
    }
  })
  .catch(console.error)
  .finally(() => {
    //redirect to homepage
    // window.location.replace('/');
  });

  //save data in localstorage
  // localStorage.setItem('auth', JSON.stringify({username, password}));
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
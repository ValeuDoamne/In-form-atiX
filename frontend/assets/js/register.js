//check for changes in the hash
document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();

  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});

/**
 * Account type setter that replaces the hash with the given param
 * @param {string} type asd
 */
function setAccountType(type) {
  window.location.hash = type.toString();
}

/**
 * Conditionally renders page elements based on the hash
 * @returns {void}
 */
function renderPage(){
  const hash = window.location.hash.slice(1);
  if(["student", "teacher"].includes(hash)) {
    let element = document.getElementById(hash);
    if(!element) return;
    element.classList.add("active");
    //remove from the other element
    element = document.getElementById(["student", "teacher"].filter(el => el != hash));
    if(!element) return;
    element.classList.remove("active");
    //remove active from choose account type
    document.getElementById("select-account-type").classList.remove("active");
    document.getElementById("select-account-type").classList.add("hidden");

    /* add event listeners on the action of rendering the page */
    document.getElementById("register_username").addEventListener('focusout', checkUsername);
    document.getElementById("register_email").addEventListener('focusout', checkEmail);
    document.getElementById("register_teacher_username").addEventListener('focusout', checkUsername);
    document.getElementById("register_teacher_email").addEventListener('focusout', checkEmail);
  } else {
    document.getElementById("select-account-type").classList.add("active");
    document.getElementById("select-account-type").classList.remove("hidden");
  }
}

/* after the the user typed the username and unfocused the input it will be checked */
function checkUsername(){
    const username = document.querySelector(window.location.hash+" form.register input[name='username']").value;
    fetch("http://localhost:8000/api/v1/register?username="+username)
    .then(response => response.json())
    .then(data => {
        displayNotification(data.status, data.message);
    }).catch(err => {
        console.log(err);
        displayNotification("error", "An error ocurred");
    });
}

/* after the the user typed the email and unfocused the input it will be checked */
function checkEmail(){
    const email = document.querySelector(window.location.hash+" form.register input[name='email']").value;
    fetch("http://localhost:8000/api/v1/register?email="+email)
    .then(response => response.json())
    .then(data => {
        displayNotification(data.status, data.message);
    }).catch(err => {
        console.log(err);
        displayNotification("error", "An error ocurred");
    });
}

function filterUsername(username) {
  if(username.length == 0) {
    displayNotification("Invalid", "The username cannot be empty");
    return false;
  } 
  if(username.indexOf(" ") !== -1 || username.indexOf("/") !== -1 ||
    username.indexOf("\\") !== -1 || username.indexOf("@") !== -1 ||
    username.indexOf("\'") !== -1 || username.indexOf("\"") !== -1) {
    displayNotification("Invalid", "The username cannot contain '\\/@' \"'");
    return false;
  }
  return true;
}

function filterPassword(password) {
  if(password.length < 8) {
    displayNotification("Invalid", "The password cannot be less than 8 characters");
    return false;
  }
  return true;
}

/**
 * Student register function
 */
function registerStudent(){
  
  /* Get all the data that must be send */
  const type = "student";
  const username = document.querySelector("#student form.register input[name='username']").value;
  const email = document.querySelector("#student form.register input[name='email']").value;
  const name = document.querySelector("#student form.register input[name='fullName']").value;
  const password = document.querySelector("#student form.register input[name='password']").value;
  const confirmPassword = document.querySelector("#student form.register input[name='confirmPassword']").value;
 
  /* Filter from the client what the user does not need to set */
  if(filterUsername(username) === false || filterPassword(password) === false) {
    return;
  }

  /* Filter from the client what the user does not need to set */
  if(password !== confirmPassword) {
    displayNotification("invalid", "The passwords do not match");
    return;
  }

  fetch("http://localhost:8000/api/v1/register", {
    method: 'POST',
    headers: {
       "Content-Type": "application/json"
    },
    body: JSON.stringify({username, email, password, type, name})
  }).then(res => res.json())
    .then(data => {
      displayNotification(data.status, data.message);
      if(data.status === "Success") {
        window.location.replace('/login.html');
      }
  }).catch(err => {
      console.log(err);
      //display error notification
      displayNotification("error", "An error occurred!");
  });
}

/**
 * Teacher register function
 */
function registerTeacher(){

  /* Get all the data that must be send */
  const type = "teacher";
  const username = document.querySelector("#teacher form.register input[name='username']").value;
  const email = document.querySelector("#teacher form.register input[name='email']").value;
  const name = document.querySelector("#teacher form.register input[name='fullName']").value;
  const password = document.querySelector("#teacher form.register input[name='password']").value;
  const confirmPassword = document.querySelector("#teacher form.register input[name='confirmPassword']").value;
  const school = document.querySelector("#teacher form.register input[name='school']").value;

  /* Filter from the client what the user does not need to set */
  if(filterUsername(username) === false || filterPassword(password) === false) {
    return;
  }

  /* Check if the password is confirmed */
  if(password !== confirmPassword) {
    displayNotification("invalid", "The passwords do not match");
    return;
  }

  /* Send the request to the backend */
  fetch("http://localhost:8000/api/v1/register", {
    method: 'POST',
    headers: {
       "Content-Type": "application/json"
    },
    body: JSON.stringify({username, email, password, type, name, school})
  }).then(res => res.json())
    .then(data => {
      displayNotification(data.status, data.message);
      if(data.status === "Success") {
        window.location.replace('/login.html');
      }
  }).catch(err => {
      console.log(err);
      //display error notification
      displayNotification("error", "An error occurred!");
  });
}

function displayNotification(type, message){
  const notificationBox = document.querySelector(window.location.hash+" .notification-box");
  //remove all children
  notificationBox.textContent = "";
  //reset classes
  notificationBox.classList = "notification-box";
  //add message
  notificationBox.classList.add(type.toLowerCase());
  notificationBox.appendChild(document.createTextNode(message));
}


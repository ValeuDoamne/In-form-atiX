/**
 * Function to handle the login form submission
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
    if (data.status == "Success") {
      //set token in local storage
      localStorage.setItem('token', data.token);
      //display success notification
      displayNotification("success", "Successfully logged in!");
      window.location.replace('/');
    } else if (data.status == "Invalid") {
      console.log(data);
      //display invalid notification
      displayNotification("error", "Invalid username or password!");
    }
  })
  .catch(err => {
    console.log(err);
    //display error notification
    displayNotification("error", "An error occurred!");
  });
}

/**
 * Helper function to display a notification on the page
 * @param {string} type The message type (added as classname to the notification box)
 * @param {string} message The message to display in the notification box
 */
function displayNotification(type, message){
  const notificationBox = document.querySelector(".notification-box");
  //remove all children
  notificationBox.textContent = "";
  //reset classes
  notificationBox.classList = "notification-box";
  //add message
  notificationBox.classList.add(type);
  notificationBox.appendChild(document.createTextNode(message));
}

//add keypress event listener to the login button
document.addEventListener("keypress", function(event){
  if (event.key == "Enter") {
    login();
  }
});

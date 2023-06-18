import { verifyAdminLogin } from "./auth-check.js";

const user  = await verifyAdminLogin();
if(user == null) {
  window.location.href = "/login.html";
} else {
  document.getElementById("loader").remove();
  const main = document.querySelector("main");
  main.querySelector(".waiting-auth").classList.remove("waiting-auth");
}

let users = await getUsers();
generateTable(users);

function generateTable(users) {
  if(users != null) {
    const table = document.getElementById("users-table");
    table.textContent = "";
    for(const user of users) {
      const row = document.createElement("tr");
      const id = document.createElement("td");
      id.textContent = user.id;
      const name = document.createElement("td");
      name.textContent = user.name;
      const email = document.createElement("td");
      email.textContent = user.email;
      const username = document.createElement("td");
      username.textContent = user.username;
      const dateCreated = document.createElement("td");
      dateCreated.textContent = user.date_created;
      const userType = document.createElement("td");
      userType.textContent = user.user_type;
      const deleteBtnCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      const editUserBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      editUserBtn.classList.add("view-btn");
      editUserBtn.textContent = "Edit";
      row.appendChild(id);
      row.appendChild(name);
      row.appendChild(email);
      row.appendChild(username);
      row.appendChild(dateCreated);
      row.appendChild(userType);
      row.appendChild(deleteBtnCell);
      deleteBtnCell.appendChild(deleteBtn);
      deleteBtnCell.appendChild(editUserBtn);
      table.appendChild(row);
      deleteBtn.addEventListener("click", async () => {
        deleteUser(user.id);
      });
      editUserBtn.addEventListener("click", async () => {
        editUser(user.id);
      });
    }
  }
}

async function getUsers() {
  const users = await fetch("http://localhost:8000/api/v1/users/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.users;
  }
  ).catch(err => {
    console.error(err);
    return null;
  });

  let userData = [];
  for(const user of users) {
    await fetch(`http://localhost:8000/api/v1/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => response.json())
    .then(data => {
      if(data.status == "Success") {
        userData.push(data.user);
      }
    }).catch(err => {
      console.error(err);
    });
  }
  return userData;
}

async function changeEmail(userId, email) {
  await fetch('http://localhost:8000/api/v1/users/'+userId+'/email', {
    method: 'POST',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({email})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            displayNotification(data.status, data.message);
            console.log(data);
        }
    }).catch(err => {
    console.log(err);
  })
}

async function changePassword(userId, password) {
  await fetch('http://localhost:8000/api/v1/users/'+userId+'/password', {
    method: 'POST',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({password})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            displayNotification(data.status, data.message);
            console.log(data);
        }
    }).catch(err => {
    console.log(err);
  })
}

async function changeUsername(userId, username) {
  await fetch('http://localhost:8000/api/v1/users/'+userId+'/username', {
    method: 'POST',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({username})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            displayNotification(data.status, data.message);
            console.log(data);
        }
    }).catch(err => {
    console.log(err);
  })
}

async function changeName(userId, name) {
  await fetch('http://localhost:8000/api/v1/users/'+userId+'/name', {
    method: 'POST',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({name})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            displayNotification(data.status, data.message);
            console.log(data);
        }
    }).catch(err => {
    console.log(err);
  })
}

async function changeUserType(userId, userType) {
  await fetch('http://localhost:8000/api/v1/users/'+userId+'/user_type', {
    method: 'POST',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({user_type: userType})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            displayNotification(data.status, data.message);
            console.log(data);
        }
    }).catch(err => {
    console.log(err);
  })
}
const validEmail = (email) => {
  return String(email)
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null;
}

async function editUserForReal(userId) {
  const usernameElement = document.getElementById('modal-username');
  const nameElement = document.getElementById('modal-name');
  const emailElement = document.getElementById('modal-email');
  const newPasswordElement = document.getElementById('modal-new-password');
  const newPasswordConfirmElement = document.getElementById('modal-new-password-confirm');
  const userTypeElement = document.getElementById('modal-edit-user-type');

  const email = emailElement.value;
  if (email.length > 0) {
    if(validEmail(email)) {
      await changeEmail(userId, email);
    } else {
      displayNotification("invalid", "Not a valid email address");
      return;
    }
  }

  const password = newPasswordElement.value;
  if (password.length > 0) {
      const newPasswordConfirm = newPasswordConfirmElement.value;
      if (password.length < 8) {
        displayNotification("invalid", "The password cannot be less than 8");
        return;
      }
      if (password == newPasswordConfirm) { 
        changePassword(userId, password);
      } else {
        displayNotification("invalid", "The password does not match confirmation");
        return;
      }
  }
  
  const name = nameElement.value;
  if (name.length > 0) {
    await changeName(userId, name);
  }

  const username = usernameElement.value;
  if (username.length > 0) {
    await changeUsername(userId, username);
  }
 
  const userType = userTypeElement.value;
  if(userType.length > 0) {
    await changeUserType(userId, userType);
  }


  usernameElement.value='';
  emailElement.value='';
  nameElement.value='';
  newPasswordElement.value='';
  usernameElement.value='';
  hideModal('modal-edit-profile');

  const users = await getUsers();
  generateTable(users);
}



async function editUser(userId) {
  document.getElementById("modal-edit-save-button").addEventListener('click', async function () {
    await editUserForReal(userId);
  });
  showModal('modal-edit-profile');
}

async function deleteUserForReal(userId) {
  await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.data;
  }).catch(err => {
    console.error(err);
    return null;
  });
  users = users.filter(user => user.id != userId);
  generateTable(users);
  hideModal('modal-delete-account');
}

function deleteUser(userId) {
  document.getElementById("delete-account-button-modal").addEventListener('click', async function() {
    await deleteUserForReal(userId);
  });  
  showModal('modal-delete-account');
}

function displayNotification(type, message){
  const notificationBox = document.querySelector(".notification-box");
  //remove all children
  notificationBox.textContent = "";
  //reset classes
  notificationBox.classList = "notification-box";
  //add message
  notificationBox.classList.add(type.toLowerCase());
  notificationBox.appendChild(document.createTextNode(message));
}

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
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      row.appendChild(id);
      row.appendChild(name);
      row.appendChild(email);
      row.appendChild(username);
      row.appendChild(dateCreated);
      row.appendChild(userType);
      row.appendChild(deleteBtnCell);
      deleteBtnCell.appendChild(deleteBtn);
      table.appendChild(row);
      deleteBtn.addEventListener("click", async () => {
        deleteUser(user.id);
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

async function deleteUser(userId) {
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
}
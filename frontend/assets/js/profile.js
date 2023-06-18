

function capitalizeFirstLetter(text) {
  return text[0].toUpperCase()+text.slice(1);
}

function deleteAccount() {
  fetch("http://localhost:8000/api/v1/users/me",
    {
       method: "DELETE",
       headers: { Authorization: "Bearer "+localStorage.getItem('token') } 
    }).then(response => response.json())
    .then(data => {
      if(data.status!="Success")
      {
        console.log(data);
      }
   }).catch(err => {
     console.log(err);
   });
  localStorage.removeItem('token');
  window.location.replace("/index.html");
}

async function getClassrooms() {
    let classrooms = undefined;
    await fetch('http://localhost:8000/api/v1/classrooms/mine', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
            classrooms = data.data;
        }
      }).catch(err => {
        console.log(err);
      })
    return classrooms;
}

async function renderContentAccademic(userType) {
  if(userType == "student") {
    const profileImage = document.querySelector(".card img");
    profileImage.src = "assets/imgs/student.svg";
  } else {
    const profileImage = document.querySelector(".card img");
    profileImage.src = "assets/imgs/teacher.svg";
  }
  const content = document.querySelector("main #content");
  content.insertAdjacentHTML('afterbegin', `
      <div class="news-container">
        <div class="news-content">
          <h2 id="myclasses-title">My Classes</h2>
          <button id="view-classrooms" class="submit">View classrooms</button>
        </div>
      </div>`);
  document.getElementById(`view-classrooms`).addEventListener('click', function() {
     window.location.replace("/classrooms.html#");
  });
  const classrooms = await getClassrooms();
  const classesTitle = document.getElementById("myclasses-title");
  for(const i in classrooms) {
    const classroom = classrooms[i];
    classesTitle.insertAdjacentHTML('afterend', `
        <div class="news-container">
          <div class="news-content profile">
            <div>
            <h4>
              <span class="highlight">Class:</span>
              <span>${classroom.name}</span>
            </h4>
            <h5>
              <span class="highlight">School Name:</span>
              <span>${classroom.school_name}</span>
            </h5>
            </div>
            <div>
              <button class="submit" id="class-button-${i}">View</button>
            </div>
          </div>
        </div>
        `);
     document.getElementById(`class-button-${i}`).addEventListener('click', function() {
        window.location.replace("/classroom.html#"+classroom.id);
     });
  } 
}

function adminCreatePost() {
    const titleElement = document.querySelector("input[name='title']");
    const contentElement = document.querySelector("textarea[name='content']");
    const title = titleElement.value;
    const content = contentElement.value;
    fetch("http://localhost:8000/api/v1/announcements", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer "+localStorage.getItem("token")
        },
        body: JSON.stringify({
           title, content 
        })
    }).then(data => data.json())
      .then(data => {
            console.log(data.status);
            console.log(data.message);
      }).catch(err => {
        console.log(err);
      });
    titleElement.value="";
    contentElement.value=""
}

function adminManageUsers() {
    window.location.replace("/admin/manage-users.html");
}
function adminManageProblems() {
    window.location.replace("/admin/manage-problems.html");
}
function adminManageNewProblems() {
    window.location.replace("/admin/manage-new-problems.html");
}

async function renderContentAdmin() {
  const content = document.querySelector("main #content");
  const innerContent = document.createElement("div");
  const postContent = document.createElement("div");
  await fetch('http://localhost:8000/api/v1/stats/all',
    {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }
  ).then(data => data.json())
   .then(data => {
     if(data.status == "Success") {
        innerContent.insertAdjacentHTML('afterbegin', `
            <h2>Site Statistics</h2>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of Users: ${data.data.users}</h3>
                   <div>
                     <button id="admin-profile-manage-users" class="submit">Manage</button>
                   </div>
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of problems: ${data.data.problems}</h3> 
                   <div>
                     <button id="admin-profile-manage-problems" class="submit">Manage</button>
                   </div>
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of New Problems: ${data.data.new_problems}</h3> 
                   <div>
                     <button id="admin-profile-manage-new-problems" class="submit">Manage</button>
                   </div>
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of Submissions: ${data.data.submissions}</h3> 
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of Schools: ${data.data.schools}</h3> 
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of comments: ${data.data.comments}</h3> 
                </div>
            </div>
            <div class="news-container">
                <div class="news-content profile">
                   <h3>Number of ratings: ${data.data.ratings}</h3> 
                </div>
            </div>
            `);
     }
   })
   .catch(err => {
     console.log(err);
   });

  postContent.insertAdjacentHTML('afterbegin', `
        <h2>Post Announcement</h2>
        <input name="title" class="admin-profile-post" placeholder="Title"></input>
        <textarea name="content" class="admin-profile-post" placeholder="Whats in your mind..."></textarea>
        <button id="admin-create-post" class="submit">Create Admin Post</button>
      `);

  content.insertAdjacentHTML('afterbegin', `
      <div class="news-container">
        <div class="news-content">
            ${postContent.innerHTML}
        </div>
      </div>
      <div class="news-container">
        <div class="news-content">
            ${innerContent.innerHTML}
        </div>
      </div>`);
  document.getElementById("admin-create-post").addEventListener('click', adminCreatePost);
  document.getElementById("admin-profile-manage-users").addEventListener('click', adminManageUsers);
  document.getElementById("admin-profile-manage-problems").addEventListener('click', adminManageProblems);
  document.getElementById("admin-profile-manage-new-problems").addEventListener('click', adminManageNewProblems);
}

const validEmail = (email) => {
  return String(email)
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null;
}

async function refreshProfileCard() {
  const fullName = document.querySelector(".card #user-fullName");
  const username = document.querySelector(".card #user-username");
  const usertype = document.querySelector(".card #user-type");
  const email = document.querySelector(".card #user-email");

  await fetch("http://localhost:8000/api/v1/users/me",
    {
       headers: { Authorization: "Bearer "+localStorage.getItem('token') } 
    }).then(response => response.json())
    .then(data => {
      if(data.status=="Success")
      {
        fullName.textContent = data.user.name;
        username.textContent = data.user.username;
        email.textContent = data.user.email;
        usertype.textContent = capitalizeFirstLetter(data.user.user_type);
      }
   }).catch(err => {
     console.log(err);
   });
}

async function changeEmail(email) {
  await fetch('http://localhost:8000/api/v1/users/me/email', {
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

async function changePassword(password) {
  await fetch('http://localhost:8000/api/v1/users/me/password', {
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

async function changeName(name) {
  await fetch('http://localhost:8000/api/v1/users/me/name', {
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

async function submitEditProfile() {
  const nameElement = document.getElementById('modal-name');
  const emailElement = document.getElementById('modal-email');
  const newPasswordElement = document.getElementById('modal-new-password');
  const newPasswordConfirmElement = document.getElementById('modal-new-password-confirm');

  const email = emailElement.value;
  if (email.length > 0) {
    if(validEmail(email)) {
      await changeEmail(email);
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
        changePassword(password);
      } else {
        displayNotification("invalid", "The password does not match confirmation");
        return;
      }
  }
  
  const name = nameElement.value;
  if (name.length > 0) {
    await changeName(name);
  }


  emailElement.value='';
  nameElement.value='';
  newPasswordElement.value='';
  await refreshProfileCard();
  hideModal('modal-edit-profile');
}

function editAccountDetails() {
    showModal('modal-edit-profile');
}

function renderContent(accountType) {
  switch(accountType) {
    case "student":
      renderContentAccademic(accountType);
      break;
    case "teacher":
      renderContentAccademic(accountType);
      break;
    case "admin":
      renderContentAdmin();
      break;
  }
}

function renderProfileCard() {
  const fullName = document.querySelector(".card #user-fullName");
  const username = document.querySelector(".card #user-username");
  const usertype = document.querySelector(".card #user-type");
  const email = document.querySelector(".card #user-email");

  fetch("http://localhost:8000/api/v1/users/me",
    {
       headers: { Authorization: "Bearer "+localStorage.getItem('token') } 
    }).then(response => response.json())
    .then(data => {
      if(data.status=="Success")
      {
        fullName.textContent = data.user.name;
        username.textContent = data.user.username;
        email.textContent = data.user.email;
        usertype.textContent = capitalizeFirstLetter(data.user.user_type);
        renderContent(data.user.user_type);
      }
   }).catch(err => {
     console.log(err);
   });
}


renderProfileCard();

document.getElementById("edit-profile-details").addEventListener('click', editAccountDetails);
document.getElementById("modal-save-button").addEventListener('click', submitEditProfile);
document.getElementById("delete-account-button-modal").addEventListener('click', deleteAccount);


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


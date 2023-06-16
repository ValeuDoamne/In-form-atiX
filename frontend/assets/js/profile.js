

function capitalizeFirstLetter(text) {
  return text[0].toUpperCase()+text.slice(1);
}

function teacherCreateClass() {
    window.location.replace("teacher/create-class.html");
}

function renderContentTeacher() {
  const profileImage = document.querySelector(".card img");
  profileImage.src = "assets/imgs/teacher.svg";
  const content = document.querySelector("main #content");

  content.insertAdjacentHTML('afterbegin', `
      <div class="news-container">
        <div class="news-content">
          <h2>My Classes</h2>
          <button id="teacher-profile-class" class="submit">Create Class</button>
        </div>
      </div>`);

  document.getElementById("teacher-profile-class").addEventListener('click', teacherCreateClass);
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

function editAccountDetails() {
    window.location.replace("/edit-profile.html");
}

function renderContent(accountType) {
  switch(accountType) {
    case "student":
      renderContentStudent();
      break;
    case "teacher":
      renderContentTeacher();
      break;
    case "admin":
      renderContentAdmin();
      break;
  }
}

const fullName = document.querySelector(".card #user-fullName");
const username = document.querySelector(".card #user-username");
const usertype = document.querySelector(".card #user-type");
const email = document.querySelector(".card #user-email");

fetch("http://localhost:8000/api/v1/users/me",
   {
       headers: { Authorization: "Bearer "+localStorage.getItem('token') } 
   })
  .then(response => response.json())
  .then(data => {
    if(data.status=="Success")
    {
        fullName.textContent = data.user.name;
        username.textContent = data.user.username;
        email.textContent = data.user.email;
        usertype.textContent = capitalizeFirstLetter(data.user.user_type);
        renderContent(data.user.user_type);
    }
  });

document.getElementById("edit-profile-details").addEventListener('click', editAccountDetails);

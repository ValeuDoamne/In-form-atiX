
function formatData(id, name, code, teacher_name, school_name) {
    return `
        <div class="classcard">
            <p class="name">${name}</p>
            <p class="info">Code: ${code}</p>
            <p class="info">Teacher: ${teacher_name}</p>
            <p class="info">${school_name}</p>
            <a href="/classroom.html#${id}"><p class = "info">View this class →</p></a>

        </div>
    `
}


async function createClassroom() {
    const name = document.getElementById("new-classroom-title").value;
    if(name.length == 0) {
        return;
    }
    await fetch('http://localhost:8000/api/v1/classrooms/create', {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({name}),
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
          const classContainer = document.querySelector("div.classContainer");
          getClassrooms(classContainer);
        } else {
            console.log(data);
        }
    }).catch(err => {
        console.log(err);
    });
    hideModal('modal-create-classroom');
}

async function joinClassroom() {
    const code = document.getElementById("join-classroom-code").value;
    if(code.length == 0) {
        return;
    }
    await fetch('http://localhost:8000/api/v1/classrooms/join', {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({code}),
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
          const classContainer = document.querySelector("div.classContainer");
          hideModal('modal-add-classroom')
          getClassrooms(classContainer);
        } else {
            console.log(data);
        }
    }).catch(err => {
        console.log(err);
    });
}
async function getClassrooms(classContainer) {
  classContainer.innerHTML='';
  /* Make get the classerooms from the server */
  await fetch('http://localhost:8000/api/v1/classrooms/mine', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        for(const i in data.data) {
            const classroom = data.data[i];
            classContainer.insertAdjacentHTML('afterbegin', formatData(classroom.id, data.data[i].name, 
                classroom.code, classroom.teacher_name, classroom.school_name));
        }
      } else {
        console.log(data);
      }
    }).catch(err => {
        console.log(err);
    });
}

async function renderPage() {
  const classContainer = document.querySelector("div.classContainer");
  /* Make sure of the usertype send from the server back */
  let userType = undefined;
  await fetch('http://localhost:8000/api/v1/users/me/user_type', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
        if(data.status == "Success") {
            userType = data.user_type;
        }
    }).catch(err => {
        console.log(err);
    });

  await getClassrooms(classContainer);
  /* If user is teacher add button to create new classrooms */
  if(userType == "teacher") {
    classContainer.insertAdjacentHTML('beforebegin', `<button type="button" onclick="showModal('modal-create-classroom')" class="fullButton">Create a new class</button>
        <div class="modal" id="modal-create-classroom">
          <div class="container">
            <h2>Create a new classroom</h2>
            <div class="input-list">
              <h4>
                <span>
                  Classroom Name:
                </span>
                <span>
                  <input id="new-classroom-title" class="input-modal" placeholder="Class 10 B..."></input>
                </span>
              </h4>
            </div>
            <div class="button-list">
              <button type="button" class="submit" onclick="createClassroom()">Create</button>
              <button type="button" class="cancel" onclick="hideModal('modal-create-classroom')">Cancel</button>
            </div>
          </div>
        </div>
    `);
  } else if(userType == "student") {
    classContainer.insertAdjacentHTML('beforebegin', `<button type="button" onclick="showModal('modal-add-classroom')" class="fullButton">Join a new class</button>
        <div class="modal" id="modal-add-classroom">
          <div class="container">
            <h2>Join a new classroom</h2>
            <div class="input-list">
              <h4>
                <span>
                  Classroom Code:
                </span>
                <span>
                  <input id="join-classroom-code" class="input-modal" placeholder="Code..."></input>
                </span>
              </h4>
            </div>
            <div class="button-list">
              <button type="button" class="submit" onclick="joinClassroom()">Join</button>
              <button type="button" class="cancel" onclick="hideModal('modal-add-classroom')">Cancel</button>
            </div>
          </div>
        </div>
    `);

  }
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();
});

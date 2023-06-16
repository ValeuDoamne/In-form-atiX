
function createStudentRecord(id, name, username, problems_solved, problems_submitted, email, userType) {
    return `
        <tr>
          <td>${name}</td>
          <td>${username}</td>
          <td>${problems_solved}</td>
          <td>${problems_submitted}</td>
          <td>${email}</td>
          ${userType == "teacher" ? `<td><button class="buttonSubmit" onclick="removeStudent(${id})">Remove</button></td>` : ``}
        </tr>
    `
}

async function getUserType() {
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
  return userType;
}

function drainTable(tableHeader) {
    let elementAfter = tableHeader.nextElementSibling;
    while(elementAfter) {
        const tmp = elementAfter.nextElementSibling;
        elementAfter.remove();
        elementAfter = tmp;
    }
}

function removeStudentAction(student_id) {
  const class_id = window.location.hash.slice(1);
  fetch('http://localhost:8000/api/v1/classrooms/remove_student', {
    method: 'DELETE',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({class_id, student_id}) 
  }).then(data => data.json())
    .then(data => {
        if(data.status == "Success") {
            const tableHeader = document.querySelector("table.students #header");
            drainTable(tableHeader);
            getColleagues(tableHeader, "teacher");
        } else {
            console.log(data);
        }
    }).catch(err => {
        console.log(err);
    });
  hideModal('modal-remove-student-classroom');
}

function removeStudent(student_id) {
  const removeStudentButton = document.getElementById("button-modal-remove-student");
  removeStudentButton.addEventListener('click', function() { removeStudentAction(student_id) });
  showModal('modal-remove-student-classroom');
}

async function getColleagues(tableHeader, userType) {
  /* Make get the classerooms from the server */
  const class_id = window.location.hash.slice(1);
  console.log(class_id);
  await fetch('http://localhost:8000/api/v1/classrooms/colleagues?class_id='+class_id, {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        for(const i in data.data) {
            const colleague = data.data[i];
            tableHeader.insertAdjacentHTML('afterend', createStudentRecord(colleague.id, colleague.name, colleague.username, 
                colleague.problems_solved, colleague.problems_submitted, colleague.email, userType));
        }
      } else {
        console.log(data);
      }
    }).catch(err => {
        console.log(err);
    });
}

async function getClassroomDetails() {
  let classroomName = document.querySelector("div.mainClass h1");
  let classroomCode = document.querySelector("div.mainClass #code");
  let classroomSchoolName = document.querySelector("div.mainClass #school-name");
  let classroomTeacherName = document.querySelector("div.mainClass #teacher");
  const class_id = parseInt(window.location.hash.slice(1));
  /* Make get the classerooms from the server */
  await fetch('http://localhost:8000/api/v1/classrooms/'+class_id, {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        const classroom = data.data;
        classroomName.innerText=classroom.name;
        classroomCode.innerText="Code: "+classroom.code;
        classroomSchoolName.innerText=classroom.school_name;
        classroomTeacherName.innerText=classroom.teacher_name;
      } else {
        console.log(data);
      }
    }).catch(err => {
        console.log(err);
    });
}

async function deleteClassroom() {
  const class_id = parseInt(window.location.hash.slice(1));
  await fetch('http://localhost:8000/api/v1/classrooms/'+class_id, {
    method: "DELETE",
    headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        window.location.replace("/classrooms.html");
      } else {
        console.log(data);
      }
  }).catch(err => {
    console.log(err);
  });
}

async function changeClassroomName() {
  const elementWithClassname = document.getElementById("change-classroom-name");
  const name = elementWithClassname.value;
  const class_id = parseInt(window.location.hash.slice(1));
  await fetch('http://localhost:8000/api/v1/classrooms/change_name', {
    method: "POST",
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({name, class_id})
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        getClassroomDetails();
      } else {
        console.log(data);
      }
  }).catch(err => {
    console.log(err);
  });
  elementWithClassname.value = '';
  hideModal('modal-change-classroom-name')
}

function renderStudentPage() {
    const table = document.querySelector("table.students");
    table.insertAdjacentHTML('beforebegin', `
            <button id="view-homework" type="button" class="fullButtonHomework">View homeworks</button>
        `);
    document.getElementById("view-homework").addEventListener('click', function() {
      window.location.replace("viewhomeworks.html"+window.location.hash);
    });
}

function renderTeacherPage() {
    const table = document.querySelector("table.students");
    table.insertAdjacentHTML('beforebegin', `
            <button id="create-homework" style="background-color: green; border-color: green;" type="button" class="fullButtonHomework">Create homework</button>
        `);
    document.getElementById("create-homework").addEventListener('click', function() {
      window.location.replace("createhomework.html"+window.location.hash);
    });
    table.insertAdjacentHTML('beforebegin', `
            <button id="view-homework" type="button" class="fullButtonHomework">View homeworks</button>
        `);
    document.getElementById("view-homework").addEventListener('click', function() {
      window.location.replace("viewhomeworks.html"+window.location.hash);
    });
    table.insertAdjacentHTML('afterend', `
            <div class="buttonHomeworkContainer">
                <button type="button" class="fullButtonHomework" onclick="showModal('modal-change-classroom-name')">Change Classroom Name</button>
                <button type="button" style="background-color: red;" class="fullButtonHomework" onclick="showModal('modal-delete-classroom')">Delete Classroom</button>
            </div>
            <div class="modal" id="modal-delete-classroom">
              <div class="container">
                <h2>Are you sure?</h2>
                <div class="button-list">
                  <button type="button" class="submit" style="background-color: red; border-color: red;" onclick="deleteClassroom()">Delete Classroom</button>
                  <button type="button" class="cancel" onclick="hideModal('modal-delete-classroom')">Cancel</button>
                </div>
              </div>
            </div>
        `);
    table.insertAdjacentHTML('afterend', `
            <div class="modal" id="modal-change-classroom-name">
              <div class="container">
                <h2>Insert new classroom name</h2>
                <div class="input-list">
                  <h4>
                    <span>
                      Classroom Name:
                    </span>
                    <span>
                      <input id="change-classroom-name" class="input-modal" placeholder="Clasa a 12a A..."></input>
                    </span>
                  </h4>
                </div>
                <div class="button-list">
                  <button type="button" class="submit" onclick="changeClassroomName()">Change Name</button>
                  <button type="button" class="cancel" onclick="hideModal('modal-change-classroom-name')">Cancel</button>
                </div>
              </div>
            </div>
        `);
    table.insertAdjacentHTML('afterend', `
            <div class="modal" id="modal-remove-student-classroom">
              <div class="container">
                <h2>Are you sure?</h2>
                <div class="button-list">
                  <button type="button" class="submit" id="button-modal-remove-student">Yes</button>
                  <button type="button" class="cancel" onclick="hideModal('modal-remove-student-classroom')">No</button>
                </div>
              </div>
            </div>
        `);
}

async function renderPage() {
  const tableHeader = document.querySelector("table.students #header");
  const userType = await getUserType();
  /* Make sure of the usertype send from the server back */
  await getClassroomDetails();
  await getColleagues(tableHeader, userType);
  /* If user is teacher add button to create new classrooms */
  if(userType == "teacher") {
    renderTeacherPage();
  } else {
    renderStudentPage();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();
});

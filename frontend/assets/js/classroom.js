
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

async function getAllProblemsTags() {
    const options = document.getElementById("tagsList");
    await fetch('http://localhost:8000/api/v1/problems/all/tags', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
           for(const i in data.tags) {
               options.insertAdjacentHTML("afterbegin", `
                        <option value="${data.tags[i]}">${data.tags[i]}</option>
                   `); 
           }
        } else { console.log(data); }
      }).catch(err => {
        console.log(err);
      });
}

async function getProblemsTags(problem_id) {
    const problemTags = document.getElementById(`tags-problem-${problem_id}`);
    problemTags.innerHTML='';
    await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/tags', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
           for(const i in data.tags) {
               problemTags.insertAdjacentHTML("afterbegin", `
                    <p class="tag">${data.tags[i]}</p>             
                   `); 
           }
        } else { console.log(data); }
      }).catch(err => {
        console.log(err);
      });
}

let PROBLEMS_IDS_FOR_HOMEWORK = [];

function addToSend(id) {
    const button = document.getElementById(`button-add-problem-${id}`);
    if(button.innerText == "Add") {
        button.innerText = "Remove";
        PROBLEMS_IDS_FOR_HOMEWORK.push(id);
    } else if(button.innerText == "Remove") {
        button.innerText = "Add";
        PROBLEMS_IDS_FOR_HOMEWORK = PROBLEMS_IDS_FOR_HOMEWORK.filter(function(item) {
          return item !== id;
        });
    }
}

function goToProblemPage(id) {
   window.open("/problem.html#"+id, "_blank").focus();
}

async function getAllProblems() {
    const tableHeader = document.getElementById("header-problems");
    drainTable(tableHeader);
    await fetch('http://localhost:8000/api/v1/problems/all', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
           for(const i in data.problems) {
               tableHeader.insertAdjacentHTML("afterend", `
                   <tr> 
                   <td>${data.problems[i].name}</td>
                   <td id="tags-problem-${data.problems[i].id}"></td>
                   <td><button class="buttonSubmit" id="button-add-problem-${data.problems[i].id}" onclick="addToSend(${data.problems[i].id})">Add</button></td>
                   <td><button class="buttonSubmit id="button-view-${data.problems[i].id}" onclick="goToProblemPage(${data.problems[i].id})">View</button></td>
                   </tr> 
                `);
               getProblemsTags(data.problems[i].id);
           }
        } else { console.log(data); }
      }).catch(err => {
        console.log(err);
      });
}

async function filterProblems() {
    const tagElement = document.getElementById("propose-homework");

    if(tagElement.value == '') {
        const tableHeader = document.getElementById("header-problems");
        let elementAfter = tableHeader.nextElementSibling;
        while(elementAfter) {
            const tmp = elementAfter.nextElementSibling;
            elementAfter.classList.remove('hidden');
            elementAfter = tmp;
        }
    } else {
        const tableHeader = document.getElementById("header-problems");
        let elementAfter = tableHeader.nextElementSibling;
        while(elementAfter) {
            const tmp = elementAfter.nextElementSibling;
            if(elementAfter.innerHTML.includes(tagElement.value) == false) {
                elementAfter.classList.add('hidden');
            } else {
                elementAfter.classList.remove('hidden');
            }
            elementAfter = tmp;
        }
    }

    tagElement.value = '';
}

function generatePostgreSQLTimestamp(numberOfDays) {
  const now = new Date();
  now.setDate(now.getDate() + numberOfDays);
  const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
  return timestamp;
}

async function createHomework() {

    if(PROBLEMS_IDS_FOR_HOMEWORK.length == 0) {
        return;
    }
    const nameElement = document.getElementById('homework-name');
    const number_of_days = parseInt(document.getElementById("daysSelect").value);
    const time_limit = generatePostgreSQLTimestamp(number_of_days);
    const name = nameElement.value;
    const class_id = parseInt(window.location.hash.slice(1));

    if(name.length == 0) {
        return;
    }

    await fetch('http://localhost:8000/api/v1/homework/post/'+class_id, {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({name, time_limit, problems: PROBLEMS_IDS_FOR_HOMEWORK})
    }).then(data => data.json())
    .then(data => {
        if(data.status != "Success")
            console.log(data);
    }).catch(err => {
        console.log(err);
    });

    nameElement.value = '';
    
    for(const i in PROBLEMS_IDS_FOR_HOMEWORK) {
        document.getElementById(`button-add-problem-${PROBLEMS_IDS_FOR_HOMEWORK[i]}`).innerText = 'Add';
    }
    PROBLEMS_IDS_FOR_HOMEWORK = [];
    hideModal('modal-create-homework');
}

async function renderTeacherPage() {
    const table = document.querySelector("table.students");
    table.insertAdjacentHTML('beforebegin', `
            <button id="create-homework" onclick="showModal('modal-create-homework')" style="background-color: green; border-color: green;" type="button" class="fullButtonHomework">Create homework</button>
        `);
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
    table.insertAdjacentHTML('afterend', `
            <div class="modal" id="modal-create-homework">
              <div class="container">
                <h2>Select problems</h2>
                <div class="input-list">
                  <h3>
                    <span>
                      Time to finish:
                    </span>
                    <span>
                      <select id="daysSelect">
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                        <option value="6">6 days</option>
                        <option value="7">7 days</option>
                      </select>
                    </span>
                  </h3>

                  <h4>
                    <span>
                      Name:
                    </span>
                    <span>
                      <input id="homework-name" class="input-modal" placeholder="Programare dinamica..."></input>
                    </span>
                  </h4>

                  <h4>
                    <span>
                      Tags:
                    </span>
                    <span>
                      <input id="propose-homework" class="input-modal" list="tagsList" placeholder="usoara..."></input>
                      <datalist id="tagsList">
                      </datalist>
                    </span>
                    <span>
                      <button id="button-filter-problem" onclick="filterProblems()" class="buttonSubmit">Filter</button>
                    </span>
                  </h4>
                </div>
                <div id="tagsSelected">

                </div>
                <table class="students" style="margin-bottom: 20px;">
                    <tbody>
                        <tr id="header-problems">
                            <th>Problem Name</th>
                            <th>Tags</th>
                            <th>Status</th>
                            <th>Problem Details</th>
                        </tr>
                    <tbody>
                </table>
                <div class="button-list">
                  <button type="button" class="submit" onclick="createHomework()" id="button-modal-create-homework">Post</button>
                  <button type="button" class="cancel" onclick="hideModal('modal-create-homework')">Cancel</button>
                </div>
              </div>
            </div>
        `);

    await getAllProblemsTags();
    await getAllProblems();
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

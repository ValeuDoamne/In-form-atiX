
function formatData(name, username, problems_solved, problems_submitted, email) {
    return `
        <tr>
          <td>${name}</td>
          <td>${username}</td>
          <td>${problems_solved}</td>
          <td>${problems_submitted}</td>
          <td>${email}</td>
        </tr>
    `
}


async function getColleagues(tableHeader) {
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
            tableHeader.insertAdjacentHTML('afterend', formatData(colleague.name, colleague.username, 
                colleague.problems_solved, colleague.problems_submitted, colleague.email));
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
  let classroomCode = document.querySelector("div.mainClass h2");
  /* Make get the classerooms from the server */
  await fetch('http://localhost:8000/api/v1/classrooms/mine', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        const class_id = parseInt(window.location.hash.slice(1));
        console.log(window.location.search);
        for(const i in data.data){
            if(data.data[i].id == class_id) {
                const classroom = data.data[i];
                classroomName.innerText=classroom.name;
                classroomCode.innerText="Code: "+classroom.code;
            }
        }
      } else {
        console.log(data);
      }
    }).catch(err => {
        console.log(err);
    });
}


async function renderPage() {
  const tableHeader = document.querySelector("table.students #header");
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
  await getClassroomDetails();
  await getColleagues(tableHeader);
  /* If user is teacher add button to create new classrooms */
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();
});

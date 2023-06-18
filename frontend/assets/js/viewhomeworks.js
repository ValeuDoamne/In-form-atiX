

async function getProblemDetails(problem_id) {
    let problem_data = undefined;
    await fetch('http://localhost:8000/api/v1/problems/'+problem_id, {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
            problem_data = data.problem;
        } else {
            console.log(data);
        }
      }).catch(err => {
        console.log(err);
      });
    return problem_data;
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

async function getHomeworks(classroom_id) {
    let homeworks = undefined;
    await fetch('http://localhost:8000/api/v1/homework/given/'+classroom_id, {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
            homeworks = data.homework;
        } else {
            console.log(data);
        }
      }).catch(err => {
        console.log(err);
      });
    return homeworks;
}

async function getAllProblems() {
    const problems = [];
    await fetch('http://localhost:8000/api/v1/problems/all', {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
           for(const i in data.problems) {
            problems.push(data.problems[i]);
           }
        } else { console.log(data); }
      }).catch(err => {
        console.log(err);
      });
    return problems;
}

function newTabProblem(id) {
   window.open("/problem.html#"+id, "_blank").focus();
}

function viewSubmissions(id) {
   window.location.replace("/viewhomeworksubmissions.html#"+id);

}

async function deleteHomework(id) {
    await fetch(`http://localhost:8000/api/v1/homework/${id}`, {
        method: "DELETE",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
    .then(data => {
        if(data.status != "Success") {
            console.log(data);
        }
    }).catch(err => {
        console.log(err);
    });

    renderPage();
}

function genereteDropdowns(homeworks_given, all_problems, user_type) {
    const solutionCotainer = document.getElementById('solution-container');
    solutionCotainer.innerHTML = '';
    for(const i in homeworks_given) {
        solutionCotainer.insertAdjacentHTML('afterbegin', `
                <button class="btn" id="btn-${i}">
                    <div class="profile" style="width: 100%">
                        <p><span class="highlight">Homework: </span><span>${homeworks_given[i].name}</span></p>
                        <p>
                            <span class="highlight">Time Limit: </span><span>${homeworks_given[i].time_limit}</span>
                        </p>
                    </div>
                </button>
                
                <div id="dropdown-${i}" class="dropdown">
                    <table class="students" style="margin-bottom: 20px">
                        <tbody>
                            <tr id="homework-problems-${homeworks_given[i].id}">
                                <th>Name</th>
                                <th>Page</th>
                            </tr>
                        </tbody>
                    </table>
                    ${user_type == "teacher" ? `
                            <button onclick="viewSubmissions(${homeworks_given[i].id})" id="view-homework-submissions-${homeworks_given[i].id}" style="margin-bottom: 20px" class="buttonHomeworkPage">View Submissions</button>
                            <button onclick="deleteHomework(${homeworks_given[i].id})" id="delete-homework-${homeworks_given[i].id}" style="background-color: red; margin-bottom: 20px" class="buttonHomeworkPage">Delete</button>
                            ` : ``}
                </div>
            `);
        document.getElementById(`btn-${i}`).addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById(`dropdown-${i}`).classList.toggle("show");
        })
        
        const tableHeader = document.getElementById(`homework-problems-${homeworks_given[i].id}`);
        console.log(all_problems);
        for(const j in homeworks_given[i].problems) {
            for(const k in all_problems) {
                if(homeworks_given[i].problems[j] == all_problems[k].id) {
                    tableHeader.insertAdjacentHTML('afterend', `
                            <tr>
                                <td>${all_problems[k].name}</td>
                                <td><button class="buttonHomeworkPage" id="view-${homeworks_given[i].id}-${all_problems[k].id}" onclick="newTabProblem(${all_problems[k].id})">View</button></td>
                            </tr>
                        `);
                    break;
                }
            }
        }
    } 
}

async function renderPage() {
    const classroom_id = parseInt(window.location.hash.slice(1));
    const page_title = document.getElementById("problemTitle");
    const homeworks_given = await getHomeworks(classroom_id);
    const all_problems = await getAllProblems();
    const user_type = await getUserType();
    page_title.innerText = "Homeworks";


    genereteDropdowns(homeworks_given, all_problems, user_type);
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();

  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});

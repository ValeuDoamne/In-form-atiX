

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

async function getSubmissions(homework_id) {
    let submissions = undefined;
    await fetch('http://localhost:8000/api/v1/homework/submissions/'+homework_id, {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
      .then(data => {
        if(data.status == "Success") {
            submissions = data.submissions;
        } else {
            console.log(data);
        }
      }).catch(err => {
        console.log(err);
      });
    return submissions;
}

async function giveScore(solution_id, student_id) {
    const scoreElement = document.getElementById(`submit-score-text-${solution_id}`);
    const score = parseInt(scoreElement.value);
    await fetch('http://localhost:8000/api/v1/homework/submission/'+solution_id, {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({score, student_id})
    }).then(data => data.json())
    .then(data => {
        if(data.status != "Success"){
            console.log(data);
        }
    }).catch(err => {
        console.log(err);
    });
    scoreElement.value='';
}

function genereteDropdowns(submission_map) {
    const solutionCotainer = document.getElementById('solution-container');
    solutionCotainer.innerHTML = '';
    for(const student of submission_map) {
        solutionCotainer.insertAdjacentHTML('afterbegin', `
                <button class="btn" id="btn-${student[0]}">
                        <p><span class="highlight">Student: </span><span>${student[0]}</span></p>
                </button>
                <div id="dropdown-${student[0]}" class="dropdown">
                <div>
            `);
        
        const dropDownSubmissions = document.getElementById(`dropdown-${student[0]}`);

        document.getElementById(`btn-${student[0]}`).addEventListener('click', function(e) {
            e.stopPropagation();
            dropDownSubmissions.classList.toggle("show");
        });
        for(const solution of student[1]) {
            dropDownSubmissions.insertAdjacentHTML('afterbegin',`
                <button class="btn" id="btn-${solution.id}">
                    <div class="profile" style="width: 100%; border-style: solid;">
                        <p><span class="highlight">Submission ID: </span><span>${solution.id}</span></p>
                        <p>
                            <span class="highlight">Username: </span><span>${solution.username}</span>
                        </p>
                        <p>
                            <span class="highlight">Time Submitted: </span><span>${solution.date_submitted}</span>
                        </p>
                    </div>
                </button>
                <div id="dropdown-${solution.id}" class="dropdown">
                    <h4>Solution Code</h4>
                    ${solution.score != null ? `<p>Previously given score: ${solution.score}}</p>` : ``}
                    <p>Programming language: ${solution.programming_language}</p>
                    <code class="submissionCode">
                        <pre>${solution.solution}</pre>
                    </code>
                    <input class="submitScoreProblem" id="submit-score-text-${solution.id}" placeholder="0 to 100" type="text"></input>
                    <button id="submit-score-${solution.id}" class="buttonSubmit" onclick="giveScore(${solution.id}, ${solution.user_id})">Give score</button>
                <div>
            `);
            document.getElementById(`btn-${solution.id}`).addEventListener('click', function(e) {
                e.stopPropagation();
                document.getElementById(`dropdown-${solution.id}`).classList.toggle("show");
            });

        }
    }


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
    const submissions_given = await getSubmissions(classroom_id);
    page_title.innerText = "Homeworks";
   

    const submission_map = new Map();

    for(const element of submissions_given) {
        submission_map.set(element.full_name, []);
    }
    
    for(const element of submissions_given) {
        submission_map.get(element.full_name).push(element);
    }

    console.log(submission_map);

    genereteDropdowns(submission_map);
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();

  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});

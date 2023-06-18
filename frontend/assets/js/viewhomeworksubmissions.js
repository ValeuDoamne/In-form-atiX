

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
                <button class="btn" id="btn-${student[1][0].username}">
                        <span class="highlight">Student: </span><span>${student[0]}</span>
                </button>
                <div id="dropdown-${student[1][0].username}" class="dropdown">
                <div>
            `);
        
        const dropDownSubmissions = document.getElementById(`dropdown-${student[1][0].username}`);

        document.getElementById(`btn-${student[1][0].username}`).addEventListener('click', function(e) {
            e.stopPropagation();
            dropDownSubmissions.classList.toggle("show");
        });
        for(const solution of student[1]) {
            dropDownSubmissions.insertAdjacentHTML('afterbegin',`
                <button class="btn profile" style="width: 100%; border-style: solid;" id="btn-${solution.id}">
                        <span><span class="highlight">Submission ID: </span><span>${solution.id}</span></span>
                        <span>
                            <span class="highlight">Time Submitted: </span><span>${solution.date_submitted}</span>
                        </span>
                </button>
                <div id="dropdown-${solution.id}" class="dropdown">
                    <h4>Solution Code</h4>
                    <p>
                        <span class="highlight">Username: </span><span>${solution.username}</span>
                    </p>
                    <p>
                        <span class="highlight">Problem Name: </span><span>${solution.problem_name}</span>
                    </p>
                    <p>
                        <span class="highlight">Time Submitted: </span><span>${solution.date_submitted}</span>
                    </p>
                    ${solution.score != null ? `<p>Previously given score: ${solution.score}</p>` : ``}
                    <p>Programming language: ${solution.programming_language}</p>
                        <pre class="submissionCode">${solution.solution}</pre>
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
}

async function renderPage() {
    const classroom_id = parseInt(window.location.hash.slice(1));
    const page_title = document.getElementById("problemTitle");
    const submissions_given = await getSubmissions(classroom_id);
    page_title.innerText = "Submissions";
   

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

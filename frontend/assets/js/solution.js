

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

async function getProblemSubmissions(problem_id) {
    let submissions = undefined;
    await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/submissions', {
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

function genereteDropdowns(problem_submissions) {
    const solutionCotainer = document.getElementById('solution-container');
    solutionCotainer.innerHTML = '';
    for(const i in problem_submissions) {
        solutionCotainer.insertAdjacentHTML('afterbegin', `
                <button class="btn" id="btn-${i}">Solution #${problem_submissions[i].submission_id}</button>
                
                <div id="dropdown-${i}" class="dropdown">
                    <h5>
                        <span class="highlight">Programming Laguage:</span>
                        <span>${problem_submissions[i].programming_language}</span>
                    </h5>
                    ${problem_submissions[i].score == null ? 
                        `<h5><span class="highlight">Not Yet Evaluated<span></h5>` : 
                        `<h5><span class="highlight">Score:</span>
                        <span>${problem_submissions[i].score}/100</span></h5>
                        `}
                    <div class="solutionPanel">
                        <code>
                            <pre>${problem_submissions[i].solution}</pre>
                        </code>
                    </div>
                </div>
            `);
        document.getElementById(`btn-${i}`).addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById(`dropdown-${i}`).classList.toggle("show");
        })
    } 
}

async function renderPage() {
    const problem_id = parseInt(window.location.hash.slice(1));
    const solution_title = document.getElementById("problemTitle");
    const problem_data = await getProblemDetails(problem_id);
    const problem_submissions = await getProblemSubmissions(problem_id);
    solution_title.innerText = problem_data.name + " Solutions";
    console.log(problem_submissions);


const dropdownBtn = document.getElementById("btn");
const dropdownMenu = document.getElementById("dropdown");

// Toggle dropdown function
const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
};

// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown();
});
    genereteDropdowns(problem_submissions);
}

document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();

  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});

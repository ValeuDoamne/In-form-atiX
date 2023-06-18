import { verifyAdminLogin } from "./auth-check.js";

const user  = await verifyAdminLogin();
if(user == null) {
  window.location.href = "/login.html";
} else {
  document.getElementById("loader").remove();
  const main = document.querySelector("main");
  main.querySelector(".waiting-auth").classList.remove("waiting-auth");
}

let problems = await getProblems();
renderProblems(problems);

async function getProblems() {
  const problems = await fetch("http://localhost:8000/api/v1/unreleased_problems/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.unreleased_problems;
  }
  ).catch(err => {
    console.error(err);
    return null;
  });
  return problems;
}

function renderProblems(problems) {
  const location = document.getElementById("problems");
  if(problems != null) {
    problems.forEach(problem => {
      const problemCard = document.createElement("div");
      problemCard.classList.add(`problem-${problem.id}`);
      problemCard.insertAdjacentHTML("afterbegin", `
        <h2 class="problem-title">${problem.name}</h2>
        <p class="username">@${problem.author}</p>
        <p>(${problem.programming_language} - ${problem.date_submitted.split(' ')[0]})</p>
        <p>${problem.description}</p>
        <h3>Solutia propusa:</h3>
        <pre>${problem.solution}</pre>
        <hr>
      `);
      const accept = document.createElement("button");
      accept.classList.add("view-btn");
      accept.textContent = "Accept";
      const reject = document.createElement("button");
      reject.classList.add("delete-btn");
      reject.textContent = "Reject";
      problemCard.appendChild(accept);
      problemCard.appendChild(reject);
      accept.addEventListener("click", async () => {
        acceptProblem(problem.id);
      });
      reject.addEventListener("click", async () => {
        rejectProblem(problem.id);
      });
      location.appendChild(problemCard);
    });
  }
}

async function acceptProblem(id) {
  console.log(id);
  await fetch(`http://localhost:8000/api/v1/unreleased_problems/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      verdict: "approve"
    })
  }).then(response => response.json())
  .then(data => {
    if(data.status == "Success") {
      document.querySelector(`.problem-${id}`).remove();
    }
  }).catch(err => {
    console.error(err);
  });
}

async function rejectProblem(id) {
  console.log(id);
  await fetch(`http://localhost:8000/api/v1/unreleased_problems/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      verdict: "deny"
    })
  }).then(response => response.json())
  .then(data => {
    if(data.status == "Success") {
      document.querySelector(`.problem-${id}`).remove();
    }
  }).catch(err => {
    console.error(err);
  });
}
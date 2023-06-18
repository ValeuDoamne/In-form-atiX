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
generateTable(problems);

function generateTable(problems) {
  if(problems != null) {
    console.log(problems);
    const table = document.getElementById("problems-table");
    table.textContent = "";
    for(const problem of problems) {
      const row = document.createElement("tr");
      const id = document.createElement("td");
      id.textContent = problem.id;
      const name = document.createElement("td");
      name.textContent = problem.name;
      const description = document.createElement("td");
      description.textContent = problem.description;
      const dateSubmitted = document.createElement("td");
      dateSubmitted.textContent = problem.date_submitted;
      const actionsCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      const viewBtn = document.createElement("button");
      viewBtn.classList.add("view-btn");
      viewBtn.textContent = "View";
      row.appendChild(id);
      row.appendChild(name);
      row.appendChild(description);
      row.appendChild(dateSubmitted);
      row.appendChild(actionsCell);
      actionsCell.appendChild(deleteBtn);
      actionsCell.appendChild(viewBtn);
      table.appendChild(row);
      deleteBtn.addEventListener("click", async () => {
        deleteProblem(problem.id);
      });
      viewBtn.addEventListener("click", async () => {
        window.location.href = `/problem.html#${problem.id}`;
      });
    }
  }
}

async function getProblems() {
  const problems = await fetch("http://localhost:8000/api/v1/problems/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.problems;
  }
  ).catch(err => {
    console.error(err);
    return null;
  });

  let problemsData = [];
  for(const problem of problems) {
    await fetch(`http://localhost:8000/api/v1/problems/${problem.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => response.json())
    .then(data => {
      if(data.status == "Success") {
        problemsData.push(data.problem);
      }
    }).catch(err => {
      console.error(err);
    });
  }
  return problemsData;
}

async function deleteProblem(problemId) {
  await fetch(`http://localhost:8000/api/v1/problems/${problemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.data;
  }).catch(err => {
    console.error(err);
    return null;
  });
  problems = problems.filter(problem => problem.id != problemId);
  generateTable(problems);
}
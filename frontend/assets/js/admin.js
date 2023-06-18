import {verifyAdminLogin} from "./auth-check.js";

const user  = await verifyAdminLogin();
if(user == null) {
  window.location.href = "/login.html";
} else {
  document.getElementById("loader").remove();
  const main = document.querySelector("main");
  main.querySelector(".waiting-auth").classList.remove("waiting-auth");
}

const stats = await getStats();
if(stats != null) {
  document.getElementById("total-users").textContent = stats.users;
  document.getElementById("total-problems").textContent = stats.problems;
  document.getElementById("total-proposed-problems").textContent = stats.new_problems;
}

async function getStats() {
  const stats = await fetch("http://localhost:8000/api/v1/stats/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success") {
      return null;
    }
    return data.data;
  }
  ).catch(err => {
    console.error(err);
    return null;
  });
  return stats;
}
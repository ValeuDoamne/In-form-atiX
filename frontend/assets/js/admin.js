import authCheck from "./auth-check.js";

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
    console.log(stats)
    document.getElementById("total-users").textContent = stats.users;
    document.getElementById("total-problems").textContent = stats.problems;
    document.getElementById("total-proposed-problems").textContent = stats.new_problems;
}

/**
 * Verifies if the user is logged in and is an admin
 * @returns user data if logged in, null if not logged in
 */
export default async function verifyAdminLogin() {
  if(authCheck() == false) {
    return null;
  }
  const adminInfo = fetch("http://localhost:8000/api/v1/users/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    } 
  }).then(response => response.json())
  .then(data => {
    if(data.status!="Success" || data.user.user_type != "admin") {
      return null;
    }
    return data.user;
  }).catch(err => {
    console.error(err);
    return null;
  });
  return adminInfo;
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
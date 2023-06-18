
function proposeProblem() {
    const problemTitleElem = document.getElementById("problem-title");
    const problemDescriptionElem = document.getElementById("problem-description");
    const problemSolutionElem = document.getElementById("problem-solution");
    const programming_language = document.getElementById("languages").value;   
    const title = problemTitleElem.value;
    const description = problemDescriptionElem.value;
    const solution = problemSolutionElem.value;

    if(title.length == 0 || description.length == 0 || solution.length == 0) {
        displayNotification("invalid", "All field are required");
        return;
    }

    fetch('http://localhost:8000/api/v1/unreleased_problems/propose', {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({name: title, description, solution, programming_language})
    }).then(data => data.json())
      .then(data => {
          displayNotification(data.status, data.message);
      }).catch(err => {
        console.log(err);
      });

    problemTitleElem.value = '';
    problemDescriptionElem.value = '';
    problemSolutionElem.value = '';
}

function displayNotification(type, message){
  const notificationBox = document.querySelector(".notification-box");
  //remove all children
  notificationBox.textContent = "";
  //reset classes
  notificationBox.classList = "notification-box";
  //add message
  notificationBox.classList.add(type.toLowerCase());
  notificationBox.classList.add("notification-bigger");
  notificationBox.appendChild(document.createTextNode(message));
}


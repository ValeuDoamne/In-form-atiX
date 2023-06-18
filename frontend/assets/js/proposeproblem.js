
function proposeProblem() {
    const problemTitleElem = document.getElementById("problem-title");
    const problemDescriptionElem = document.getElementById("problem-description");
    const problemSolutionElem = document.getElementById("problem-solution");
    const programming_language = document.getElementById("languages").value;   
    const title = problemTitleElem.value;
    const description = problemDescriptionElem.value;
    const solution = problemSolutionElem.value;

    if(title.length == 0 || description.length == 0 || solution.length == 0) {
        displayNotification("invalid", "All fields are required");
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

async function importProblem(event) {
  const fileList = event.target.files;
  if(fileList.length > 0) {
    //validate file extension
    const file = fileList[0];
    const fileExtension = file.name.split('.').pop();
    if(fileExtension != 'json' && fileExtension != 'csv') {
      displayNotification("invalid", "Invalid file extension (allowed: .json, .csv)");
      return;
    }
    //handle import
    const fileContent = await file.text();
    if(fileExtension === "json") {
      const data = JSON.parse(fileContent);
      const {name, description, solution, programming_language} = data;
      document.getElementById("problem-title").value = name;
      document.getElementById("problem-description").value = description;
      document.getElementById("problem-solution").value = solution;
      document.getElementById("languages").value = programming_language;
    } else if(fileExtension === "csv") {
      const rows = fileContent.split('\n');
      const header = rows[0].split(',');
      let data = rows[1].split(',');
      data = data.map((item, index) => {
        if(data[index][0] === '"' && data[index][data[index].length-1] === '"'){
          return data[index].substring(1, data[index].length-1);
        }
      });
      if(header.includes("name")){
        document.getElementById("problem-title").value = data[header.indexOf("name")];
      }
      if(header.includes("description")){
        document.getElementById("problem-description").value = data[header.indexOf("description")];
      }
      if(header.includes("solution")){
        document.getElementById("problem-solution").value = data[header.indexOf("solution")];
      }
      if(header.includes("programming_language")){
        document.getElementById("languages").value = data[header.indexOf("programming_language")];
      }
    }
  }
}
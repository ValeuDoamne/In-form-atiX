
function goToSubmissions() {
    window.location.replace("/solution.html"+window.location.hash);
}

let PROBLEM_JSON_DATA = undefined;

function downloadJSON(data, filename) {
  // Convert JSON object to a string
  const json = JSON.stringify(data);
  
  // Create a blob from the JSON string
  const blob = new Blob([json], { type: 'application/json' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // Set the filename for the downloaded file
  link.download = filename;

  // Append the link to the document body
  document.body.appendChild(link);

  // Simulate a click event to trigger the download
  link.click();

  // Clean up the temporary link
  document.body.removeChild(link);
}

function escapeQuotes(str) {
  return str.replace(/"/g, '\\"');
}

// Function to convert JSON to CSV
function convertToCSV(objArray) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    const keys = Object.keys(array);
    const values = Object.values(array);
    const header = keys.join(',');
    let array_values = [];
    for(const element of values) {
       if(typeof element === "string") {
           array_values.push(`"${escapeQuotes(element)}"`); 
       } else {
           array_values.push(element); 
       }
    }
    const values_string = array_values.join(',');
    return header+"\r\n"+values_string;
}
// Function to download CSV file
function downloadCSV(data, filename) {
  const csv = convertToCSV(data);
  
  // Create a blob from the CSV string
  const blob = new Blob([csv], { type: 'text/csv' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // Set the filename for the downloaded file
  link.download = filename;

  // Append the link to the document body
  document.body.appendChild(link);

  // Simulate a click event to trigger the download
  link.click();

  // Clean up the temporary link
  document.body.removeChild(link);
}

function exportProblemCSV() {
    downloadCSV(PROBLEM_JSON_DATA, "export.csv");
}

function exportProblemJSON() {
    downloadJSON(PROBLEM_JSON_DATA, "export.json");
}

function exportProblem() {
    showModal("modal-export-problem")
}

async function getUser() {
  let user = undefined;
  await fetch('http://localhost:8000/api/v1/users/me',
      {
          headers: {Authorization: "Bearer "+localStorage.getItem('token')}
      }).then(data => data.json())
        .then(data => {
            if(data.status == "Success")
                user = data.user;
        }).catch(err => {
          console.log(err);
        })
    return user
}

async function submitRating() {
  const problem_id=parseInt(window.location.hash.slice(1));
  const ratingGivenElem = document.getElementById("rating-score-input");
  const rating = parseInt(ratingGivenElem.value);
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/ratings', {
        method: 'POST',
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({rating})
  }).catch(err => {
    console.log(err);
  });
  ratingGivenElem.value = '';
  await getScore();
}

async function getScore() {
  const problem_id=parseInt(window.location.hash.slice(1));
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/ratings',
      {
          headers: {Authorization: "Bearer "+localStorage.getItem('token')}
      }).then(data => data.json())
        .then(data => {
            if(data.status == "Success") {
                const overallRating = document.getElementById("overallRating");
                overallRating.innerHTML = `<h3>
                                        <span class="highlight">Total Ratings: </span>
                                        <span>${data.rating}/5</span>
                                    </h3>
                    `;
            }
        }).catch(err => {
          console.log(err);
        });

}

async function getRaport() {
  const raport = document.getElementById("raport");
  const problem_id=parseInt(window.location.hash.slice(1));
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/raport',
      {
          headers: {Authorization: "Bearer "+localStorage.getItem('token')}
      }).then(data => data.json())
        .then(data => {
            if(data.status == "Success") {
                const raport = document.getElementById("raport");
                raport.innerHTML = `<h3>
                                        <span class="highlight">Total submissions: </span>
                                        <span>${data.raport.total_submissions}</span>
                                    </h3>
                                    <h3>
                                        <span class="highlight">Correct submissions: </span>
                                        <span>${data.raport.successful_submissions}</span>
                                    </h3>`;
            }
        }).catch(err => {
          console.log(err);
        });
}

async function fetchComments() {
  const comments_section = document.getElementById('comments-section');
  const problem_id = parseInt(window.location.hash.slice(1));
  comments_section.innerHTML='';
  const user = await getUser();
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/comments', {
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
  }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
          for(const i in data.comments) {
            const comment = data.comments[i];
            comments_section.insertAdjacentHTML('beforeend', `
                <div class="comment">
                  <div class="profile">
                    <div>
                    <p style="text-align: left;">
                     <span class="highlight">Date:</span>
                     <span>${comment.date_submitted}</span>
                    </p>
                    <p style="text-align: left;">
                     <span class="highlight">Username:</span>
                     <span>${comment.username}</span>
                    </p>
                    </div>
                  ${(user.user_type == "admin" || user.username == comment.username) ? `<div><button class="buttonSubmit" onclick="deleteCommentModal(${comment.comment_id})">Delete</button></div>` : ``} 
                  </div>
                  <div>
                    <pre class="comment-content">${comment.comment_text}</pre>
                  </div>
                </div>`);
          }
      } else {
        console.log(data);
      } 
  }).catch(err => {
    console.log(err);
  });

}

async function addNewTag() {
    const newTagElem = document.getElementById('modal-input-tag');
    const newTag = newTagElem.value;
    const problem_id = parseInt(window.location.hash.slice(1));
    fetch("http://localhost:8000/api/v1/problems/"+problem_id+"/tags", {
        method: "POST",
        headers: {Authorization: "Bearer "+localStorage.getItem('token')},
        body: JSON.stringify({tag: newTag})
    }).then(data => data.json())
    .then(data => {
        if(data.status != "Success")
            console.log(data);
    }).catch(err => console.log(err));

    newTagElem.value = '';
    hideModal('modal-tag-problem')
    await getTags();
}

async function addTagModal() {
    const tags = document.getElementById('tags');
    const user = await getUser();
    if(user.user_type == "admin" || user.user_type == "teacher") {
        const modalTaguri = `
                <div class="modal" id="modal-tag-problem">
                  <div class="container">
                    <h2 style="margin: 0 auto;">Add tag</h2>
                        <div style="display: flex; flex-flow: column; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <input type="text" id="modal-input-tag">
                        <button type="button" class="buttonSubmit" id="modal-add-tag-button">Add</button>
                        </div>
                    <div class="button-list">
                      <button type="button" class="cancel" onclick="hideModal('modal-tag-problem')">Close</button>
                    </div>
                 </div>
               </div>
        `;
        tags.insertAdjacentHTML('beforeend', modalTaguri);
        const buttonAddTag = document.createElement('button');
        tags.appendChild(buttonAddTag);
        buttonAddTag.innerText = "Add tag";
        buttonAddTag.classList.add("buttonSubmit"); 
        buttonAddTag.addEventListener('click', function() {
            showModal('modal-tag-problem');
        });
        document.getElementById('modal-add-tag-button').addEventListener('click', addNewTag);
    } 
}

async function deleteComment(comment_id) {
  const problem_id = parseInt(window.location.hash.slice(1));
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/comments', {
      method: 'DELETE',
      headers: {Authorization: 'Bearer '+localStorage.getItem('token')},
      body: JSON.stringify({comment_id})
    }).then(data => data.json())
        .then(data => {if(data.status != "Success") console.log(data); })
      .catch(err => {
        console.log(err);
      });
  await fetchComments();
  hideModal('modal-delete-comment');
} 

async function deleteCommentModal(comment_id) {
  document.getElementById('delete-comment-button').addEventListener('click', function() {
    deleteComment(comment_id);
  });
  showModal('modal-delete-comment');
}

async function sendComment() {
  const commentElement = document.getElementById('send-comment');
  const comment = commentElement.value;
  const problem_id = parseInt(window.location.hash.slice(1));

  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/comments', {
    method: "POST",
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({comment})
  }).then(data => data.json())
    .then(data => {
        if(data.status != "Success")
        {
            console.log(data);
        }
    }).catch(err => {
      console.log(err);
    });

  await fetchComments();
  commentElement.value = '';
}

function sendUploadFile(contents) {
  const programming_language = document.getElementById('languages').value;
  const problem_id = parseInt(window.location.hash.slice(1));
  fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/submit', {
    method: "POST",
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({source_code: contents, programming_language})
  }).then(data => data.json())
    .then(data => {
      if(data.status != "Success") {
        console.log(data);
      } 
  }).catch(err => {
    console.log(err);
  });
}

function sendProblemSolution() {
  const editor = document.getElementById('editor');
  const upload = document.getElementById('upload');
 
  if(editor.value.length == 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const contents = e.target.result;
        sendUploadFile(contents);
      }
      if(upload.files.length > 0) {
        reader.readAsText(upload.files[0]);
        upload.value = null;
      }
  } else {
     sendUploadFile(editor.value);
     editor.value='';
  }
}

async function getTags() {
  const problem_id = parseInt(window.location.hash.slice(1));
  const tags = document.getElementById('tags');
  tags.innerHTML = ''; 
  await fetch('http://localhost:8000/api/v1/problems/'+problem_id+'/tags',
    {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        tags.innertext="";
        for(const i in data.tags) {
            tags.innerHTML+='<p class="highlight tag" >#'+data.tags[i]+" </p>";
        } 
      } else {
        console.log(data);
      }
    }).catch(err => {
      console.log(err);
    });
} 

function renderPage() {
  const problem_id = parseInt(window.location.hash.slice(1));
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const sendSolution = document.getElementById('send-solution');
  const sendCommentButton = document.getElementById('send-comment-button');
  sendSolution.addEventListener('click', sendProblemSolution);
  sendCommentButton.addEventListener('click', sendComment);
  document.getElementById('go-to-submissions').addEventListener('click', goToSubmissions);
  document.getElementById('export-problem-data').addEventListener('click', exportProblem);
  document.getElementById('modal-export-json').addEventListener('click', exportProblemJSON);
  document.getElementById('modal-export-csv').addEventListener('click', exportProblemCSV);

  fetch('http://localhost:8000/api/v1/problems/'+problem_id,
    {
        headers: {Authorization: "Bearer "+localStorage.getItem('token')}
    }).then(data => data.json())
    .then(data => {
      if(data.status == "Success") {
        PROBLEM_JSON_DATA = data.problem;
        title.innerText = data.problem.name;
        description.innerHTML = `<h4>Description:</h4><br>${data.problem.description}`;
        if(data.problem.solution != undefined) {
          const prevOfficialSolution = document.getElementById('official-solution');
          if(prevOfficialSolution != undefined)
          {
            prevOfficialSolution.remove();
          }
          description.insertAdjacentHTML('afterend', `
                <div id="official-solution" class="problemInfo">
                  <h4>Official Solution:</h4>
                  <h5>
                    <span class="highlight">Programming Language:</span>
                    <span>${data.problem.programming_language}</span>
                  </h5>
                  <code>
                   ${data.problem.solution}
                  </code>
                </div>
              `);
        }
      } else {
        console.log(data);
      }
    }).catch(err => {
      console.log(err);
    });
 

  getTags();
  getScore();
  getRaport();
  fetchComments();
  addTagModal();
}

//check for changes in the hash
document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();
  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});



async function deletePost(id) {
  await fetch('http://localhost:8000/api/v1/announcements', {
    method: 'DELETE',
    headers: {Authorization: "Bearer "+localStorage.getItem('token')},
    body: JSON.stringify({id})
  })
    .then(data => data.json())
    .then(data => {if(data.status != "Success") console.log(data);})
    .catch(err => {
        console.log(err);
    })
  await getNews();
  hideModal('modal-delete-post');
} 

async function deletePostModal(id) {
   document.getElementById('modal-delete-post-button').addEventListener('click', function() {
    deletePost(id);
   });
  showModal('modal-delete-post');
}

async function getUserType() {
  let userType = undefined;
  await fetch('http://localhost:8000/api/v1/users/me/user_type', {
    headers: {Authorization: "Bearer "+localStorage.getItem('token')}
  }).then(response => response.json())
    .then(data => {
        if(data.status == "Success")
            userType = data.user_type;
        else console.log(data);
    }).catch(err => {
      console.log(err);
    });
  return userType;
}

async function getNews() {
  const userType = await getUserType();
  const news = document.querySelector("#news h1");
  let element = news.nextSibling;
  while(element != null){
    const tmp = element.nextSibling;
    element.remove();
    element=tmp;
  }
  await fetch('http://localhost:8000/api/v1/announcements')
    .then(data => data.json())
    .then(data => {
        if(data.status == "Success") {
          for(const i in data.announcements) {
            const title = data.announcements[i].title;
            const content = data.announcements[i].content;
            const author = data.announcements[i].username;
            const date = data.announcements[i].date_created;
            const id = data.announcements[i].id;
            
            const post = `
                <div class="news-container">
                  <div class="news-content">
                    <p class="news-date">
                      <span class="highlight">Date: </span>
                      <span>${date}</span>
                    </p>
                    <p class="news-date">
                      <span class="highlight">Author: </span>
                      <span>${author}</span>
                    </p>
                    <h2>
                        ${title}
                    </h2>
                    <pre class="comment-content" id="post-content">
                        ${content} 
                    </pre>
                  ${userType == "admin" ? `<button class="buttonSubmit" onclick="deletePostModal(${id})">Delete</button>`: ``}
                  </div>
                </div>
              `;
            news.insertAdjacentHTML('afterend', post);
          }
        }
    })
    .catch(err => {
      console.log(err);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    getNews();
})

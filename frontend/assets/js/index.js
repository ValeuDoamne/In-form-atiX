

async function getNews() {
  const news = document.querySelector("#news h1")
    
  await fetch('http://localhost:8000/api/v1/announcements')
    .then(data => data.json())
    .then(data => {
        if(data.status == "Success") {
          for(const i in data.announcements) {
            const title = data.announcements[i].title;
            const content = data.announcements[i].content;
            const author = data.announcements[i].username;
            const date = data.announcements[i].date_created;
            
            const post = `
                <div class="news-container">
                  <div class="news-content">
                    <p class="news-date">
                        Date: ${date}
                    </p>
                    <p class="news-date">
                        Author: ${author}
                    </p>
                    <h2>
                        ${title}
                    </h2>
                    <p id="post-content">
                        ${content} 
                    </p>
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

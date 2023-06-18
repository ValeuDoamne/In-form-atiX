export default function header(authState){
  //check pathname depth
  const locationDepth = window.location.pathname.split("/").length;
  let adjustedPaths = "";
  for(let i=0; i<locationDepth-1; i++) {
    adjustedPaths += "../";
  }
  const headerContents = `
    <a href="${adjustedPaths}index.html" class="title">In-form-atiX</a>
    <input class="toggle"  id="toggle" type="checkbox">
    <label class="hamburger" for="toggle">
    <span class="top"></span>
    <span class="meat"></span>
    <span class="bottom"></span>
    </label>
    <nav class="menu">
      <a href="${adjustedPaths}about.html">About</a>
      <a href="${adjustedPaths}help.html">Help</a>
      ${!authState ?
        `<a href="${adjustedPaths}login.html">Login</a>
        <a href="${adjustedPaths}register.html">Register</a>`
      :  
        `
        ${authState == "teacher" || authState == "admin" ? 
        `<a href="${adjustedPaths}proposeproblem.html">Propose Problem</a>` : ``
        }
        ${authState == "student" || authState == "teacher" ? 
        `<a href="${adjustedPaths}classrooms.html">Classrooms</a>`
        : authState == "admin" ?
        `<a href="${adjustedPaths}admin/index.html">Admin</a>`
        : ""
        }
        <a href="${adjustedPaths}profile.html">Profile</a>
        <span class="modal-button" onclick="showModal('modal-logout')">Logout</span>
        <div class="modal" id="modal-logout">
          <div class="container">
            <h2>Logout from your account</h2>
            <div class="button-list">
              <button type="button" class="submit" onclick="logout()">Logout</button>
              <button type="button" class="cancel" onclick="hideModal('modal-logout')">Cancel</button>
            </div>
          </div>
        </div>
        `
      }
    </nav>
  `;
  return headerContents;
}

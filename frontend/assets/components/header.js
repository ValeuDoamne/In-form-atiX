export default function header(authState){
  const headerContents = `
    <a href="index.html" class="title">In-form-atiX</a>
    <input class="toggle"  id="toggle" type="checkbox">
    <label class="hamburger" for="toggle">
    <span class="top"></span>
    <span class="meat"></span>
    <span class="bottom"></span>
    </label>
    <nav class="menu">
      <a href="about.html">About</a>
      <a href="help.html">Help</a>
      ${!authState ?
        `<a href="login.html">Login</a>
        <a href="register.html">Register</a>`
      :
        `
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

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
      <a href="./search.php">Search</a>
      <a href="about.html">About</a>
      <a href="help.html">Help</a>
      <a href="login.html">${!authState ? "Login" : "Logout"}</a>
      ${!authState ? '<a href="register.html">Register</a>' : ''}
    </nav>
  `;
  return headerContents;
}
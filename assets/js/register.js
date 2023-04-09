//check for changes in the hash
document.addEventListener("DOMContentLoaded", function() {
  //initialize the page
  renderPage();

  //add hash change listener
  onhashchange = () => {
    renderPage();
  };
});

/**
 * Account type setter that replaces the hash with the given param
 * @param {string} type asd
 */
function setAccountType(type) {
  window.location.hash = type.toString();
}

/**
 * Conditionally renders page elements based on the hash
 * @returns {void}
 */
function renderPage(){
  const hash = window.location.hash.slice(1);
  if(["student", "teacher"].includes(hash)) {
    let element = document.getElementById(hash);
    if(!element) return;
    element.classList.add("active");
    //remove from the other element
    element = document.getElementById(["student", "teacher"].filter(el => el != hash));
    if(!element) return;
    element.classList.remove("active");
    //remove active from choose account type
    document.getElementById("select-account-type").classList.remove("active");
    document.getElementById("select-account-type").classList.add("hidden");
  } else {
    document.getElementById("select-account-type").classList.add("active");
    document.getElementById("select-account-type").classList.remove("hidden");
  }
}
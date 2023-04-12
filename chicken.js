var homeScreen
var loginScreen;
var registerScreen;
var gameScreen;
var configureScreen;
var modalDialog;
var users;
var registerForm;
var loginForm;

function setupGame(){
    users = {
        p : "testuser"
    }
    registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", registerUser);
    loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", loginUser);
    configureForm = document.getElementById("configurationForm");
    configureForm.addEventListener("submit", checkPreferences);

    homeScreen = document.getElementById("home");
    homeScreen.style.display = "block";
    loginScreen = document.getElementById("login");
    configureScreen =  document.getElementById("configuration");
    registerScreen = document.getElementById("register");
    gameScreen = document.getElementById("game");
    modalDialog = document.getElementById('about');
    document.getElementById('close-modal').addEventListener('click', () => {
        modalDialog.close();
      });
    
    document.addEventListener("click", function(event){
        if (event.target == modalDialog &&modalDialog.open){
            modalDialog.close();
          }
      });
    window.addEventListener("keydown", function(event) {
        if (event.keyCode === 27) {
          modalDialog.close();
        }
     });
}
// update the configuration time range
function updateTimeValue(value) {
    document.getElementById("rangeValue").innerHTML = value;
  }

// validation of different input fields
function validateDetails(inputValue, type="password") {
    let regex;
    if(type == "name"){
        regex = /\d/;
    }
    else if( type == "email"){
        regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    }
    else if( type == "keyboard"){
        regex = /^[a-zA-Z\s]$/;
    }
    // password
    else{
        regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    }
    return regex.test(inputValue);
  }

  // check configuration setting
function checkPreferences(event){
    let shootKey = document.getElementById("shootKey").value;
    if(!validateDetails(shootKey,"keyboard")){
        alert("You can only choose one letter or the space key");
        return;
    }
    let gameTime = document.getElementById("timeGame").value;

    //Next define game configuration..
    loginForm.reset();
    configureScreen.style.display = "none";
    gameScreen.style.display = "block";
    
}

function registerUser(event) {
    event.preventDefault();
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let passwordValidation = document.getElementById("passwordValidation").value;
    let email = document.getElementById("email").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;

    // check if username exist
    if( username in users){
        alert("username already exist, try different username.");
    }
    // check if password is valid ( at least 8 characters, 1 letter, 1 number )
    else if( !validateDetails(password)){
        alert("Password is not valid! need to be at least 8 characters, 1 letter, 1 number");
    }
    // check if passwords validation match to password
    else if(passwordValidation != password){
        alert("Password validation doesn't match the password.");
    }
    // check if first or last name don't contain numbers
    else if( validateDetails(firstName,"name") || validateDetails(lastName,"name")){
        alert("Your name can't contain numbers in it.");
    }
    // check if email address is valid
    else if(!validateDetails(email,"email")){
        alert("Email address is not valid.");
    }
    // add new user
    else{
        users[username] = password;
        alert("Registration completed successfuly!");
        registerForm.reset();
        registerScreen.style.display = "none";
        loginScreen.style.display = "block";

    }

  }

  function loginUser(event){
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    // check if password valid
    if(!(username  in users)){
        alert("Username don't exist.");
    }
    else if(users[username] != password){
        alert("Password is not correct.");
    }
    else{
        // Need to figure out why screen wont change here 
        alert("you logged in successfuly!");
        loginForm.reset();
        loginScreen.style.display = "none";
        configureScreen.style.display = "block";
    }

  }
// Change screen by the menu buttons
function switchScreen(event){
    let className = event.className;
    let screens = [homeScreen,loginScreen,registerScreen,gameScreen,configureScreen];
    if (className != "aboutButton"){
        screens.forEach( function(screen){
            screen.style.display = "none";
        })
    }

    if( className == "homeButton"){
        homeScreen.style.display = "block";
    }
    else if( className == "loginButton"){
        loginScreen.style.display = "block";
    }
    else if( className == "registerButton"){
        registerScreen.style.display = "block";

    }
    else if(className == "aboutButton"){
        modalDialog.showModal();
    }
    
}


window.addEventListener("load", setupGame, false);

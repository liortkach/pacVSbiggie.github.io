var homeScreen
var loginScreen;
var registerScreen;
var gameScreen;
var configureScreen;
var modalDialog;
var users;
var registerForm;
var loginForm;
var currentScreen;
var currentMusic;
var isMusicPlaying;
var isLoggedIn;

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
    loginScreen = document.getElementById("login");
    configureScreen =  document.getElementById("configuration");
    registerScreen = document.getElementById("register");
    gameScreen = document.getElementById("game");
    modalDialog = document.getElementById('about');

    isMusicPlaying = true;
    isLoggedIn = false;
    currentMusic = document.getElementById("bgmusic-home");
    document.getElementById("bgmusic-game").pause();
    currentScreen = homeScreen;
    switchScreen("home");

    document.getElementById('close-modal').addEventListener('click', () => {
        modalDialog.close();
      });

    document.getElementById("mute-btn").addEventListener("click", handleMuteMusic);
    
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

  // mute music button
  function handleMuteMusic(){

    if (isMusicPlaying) {
        // Mute the music
        currentMusic.muted = true;
        isMusicPlaying = false;
      }
       else {
        currentMusic.muted = false;
        isMusicPlaying = true;
      }
      
      // Update the button img
      var btn = document.getElementById("mute-btn");
      if (isMusicPlaying) {
        btn.style.backgroundImage = "url('images/speaker-filled-audio-tool.png')";
    } else {
        btn.style.backgroundImage = "url('images/volume-off-indicator.png')";
      }
 }
  
  // check configuration setting
function checkPreferences(event){
    event.preventDefault();
    let shootKey = document.getElementById("shootKey").value;
    if(!validateDetails(shootKey,"keyboard")){
        alert("You can only choose one letter or the space key");
        return;
    }
    let gameTime = document.getElementById("timeGame").value;

    //Next define game configuration..
    configureForm.reset();
    switchScreen("game");
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
        switchScreen("login");
    }
}

function loginUser(event){
    event.preventDefault();
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
        alert("you logged in successfuly!");
        loginForm.reset();
        updateUserStatus();
        switchScreen("config");
    }
}
// update button of logout to login and vice versa
function updateUserStatus(){
    let buttons = document.querySelectorAll('.login-btn');
    if(!isLoggedIn){
        isLoggedIn = true;
        buttons.forEach( button => {
            button.textContent = 'Log-out';
        })
    }
    else {
        isLoggedIn = false;
        buttons.forEach( button => {
            button.textContent = 'Log-in';
        })
        switchScreen("home");
    }
}

function switchMusic(name){
// only two kinds of audio for now   
    currentMusic.pause();
    currentMusic = document.getElementById("bgmusic-" + name);
    console.log(currentMusic.id);
    currentMusic.currentTime = 0;
    currentMusic.play();
}

// Change screen by the menu buttons
function switchScreen(className){

    // close all screens
    let screens = [homeScreen,loginScreen,registerScreen,gameScreen,configureScreen];
    if (className != "about-btn"){
        screens.forEach( function(screen){
            screen.style.display = "none";
        })
    }
    
    if(currentScreen.id == "game" && !className.includes("game")){
        console.log(currentScreen.id);
        switchMusic("home");
    }
    //show only the chosen one
    switch(true) {
        case className.includes("home"):
            homeScreen.style.display = "block";
            currentScreen = homeScreen;
            break;

        case className.includes("login"):
            if(!isLoggedIn){
                loginScreen.style.display = "block";
                currentScreen = loginScreen;
            }else {
                updateUserStatus();
            }
            break;

        case className.includes("register"):
            registerScreen.style.display = "block";
            currentScreen = registerScreen;
            break;

        case className.includes("config"):
            configureScreen.style.display = "block";
            currentScreen = configureScreen;            
            break;

        case className.includes("game"):
            if(isLoggedIn){
                gameScreen.style.display = "block";
                if(currentScreen.id != "game"){
                    currentScreen = gameScreen; 
                    switchMusic("game");
                }
             }
            else{
                alert("You must login first.");
                currentScreen.style.display = "block";
            }
            break;

        default:
            modalDialog.showModal();
            break;
    }

}


window.addEventListener("load", setupGame, false);

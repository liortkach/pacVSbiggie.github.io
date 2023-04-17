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
    homeScreen.style.display = "block";
    homeScreen.style.opacity = 1;

    //toggleScreen(currentScreen);

    document.getElementById('close-modal').addEventListener('click', () => {
        modalDialog.close();
      });

    document.getElementById("mute-btn").addEventListener("click", handleMuteMusic);

    // close about modal
    document.addEventListener("click", (event) => {
        if (event.target == modalDialog &&modalDialog.open){
            modalDialog.close();
          }
      });

    window.addEventListener("keydown", (event) => {
        if (event.keyCode === 27) {
          modalDialog.close();
        }
     });
    
     // close button on alerts messages
     let closeButtons = document.getElementsByClassName("close-btn");
     for (let i = 0; i < closeButtons.length; i++) {
       closeButtons[i].onclick = function(){
         this.parentElement.style.display = "none";
       }
    } 
    document.getElementById('shootKey').addEventListener('keydown', function(event){
        // Check if the pressed key is the space key
        if (event.key === ' ') {
          // Prevent the default behavior of typing a space character
          event.preventDefault();
          console.log("dfddf");
          this.value += "|space|";
        }
      });


}
// update the configuration time range
function updateTimeValue(value) {
    document.getElementById("rangeValue").innerHTML = value;
}

function showSuccessMessage(message) {
    var successAlert = document.getElementById("success-alert");
    successAlert.querySelector(".alert-message").innerHTML = message;
    successAlert.style.display = "block";
    successAlert.classList.add("success");
  
    setTimeout(function(){
      successAlert.style.display = "none";
      successAlert.classList.remove("success");
    }, 3000);
}
  
function showWarningMessage(message) {
    var warningAlert = document.getElementById("warning-alert");
    warningAlert.querySelector(".alert-message").innerHTML = message;
    warningAlert.style.display = "block";
    warningAlert.classList.add("warning");
  
    setTimeout(function(){
      warningAlert.style.display = "none";
      warningAlert.classList.remove("warning");
    }, 3000);
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
    if(shootKey != "|space|" && !validateDetails(shootKey,"keyboard")){
        showWarningMessage("You can only choose one letter or the space key");
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
        showWarningMessage("username already exist, try different username.");
    }
    // check if password is valid ( at least 8 characters, 1 letter, 1 number )
    else if( !validateDetails(password)){
        showWarningMessage("Password is not valid! need to be at least 8 characters, 1 letter, 1 number");
    }
    // check if passwords validation match to password
    else if(passwordValidation != password){
        showWarningMessage("Password validation doesn't match the password.");
    }
    // check if first or last name don't contain numbers
    else if( validateDetails(firstName,"name") || validateDetails(lastName,"name")){
        showWarningMessage("Your name can't contain numbers in it.");
    }
    // check if email address is valid
    else if(!validateDetails(email,"email")){
        showWarningMessage("Email address is not valid.");
    }
    // add new user
    else{
        users[username] = password;
        showSuccessMessage("Registration completed successfuly!");
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
        showWarningMessage("Username don't exist.");
    }
    else if(users[username] != password){
        showWarningMessage("Password is not correct.");
    }
    else{
        showSuccessMessage("you logged in successfuly!");
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

function toggleScreen(screen1,screen2) {

    screen1.style.opacity = "0";
    setTimeout(function() {
        screen1.style.display = "none";
        screen2.style.display = "block";
        screen2.style.opacity = "1";
      }, 300);

}

// Change screen by the menu buttons
function switchScreen(className){

    if(currentScreen.id == "game" && !className.includes("game")){
        switchMusic("home");
    }

    if(className.includes(currentScreen.id)){
        return;
    }
    if( className.includes("about")){
        modalDialog.showModal();
        return;
    }
    let previousScreen = currentScreen;
    //show only the chosen one
    switch(true) {
        case className.includes("home"):
            //homeScreen.style.display = "block";
            currentScreen = homeScreen;
            break;

        case className.includes("login"):
            if(!isLoggedIn){
                //loginScreen.style.display = "block";
                currentScreen = loginScreen;

            }else {
                updateUserStatus();
                showSuccessMessage("You log out successfuly.")
                return;
            }
            break;

        case className.includes("register"):
            //registerScreen.style.display = "block";
            currentScreen = registerScreen;
            break;

        case className.includes("config"):
            //configureScreen.style.display = "block";
            currentScreen = configureScreen; 
            break;
        
        default:
            if(isLoggedIn){
                //gameScreen.style.display = "block";
                if(currentScreen.id != "game"){
                    currentScreen = gameScreen; 
                    switchMusic("game");
                }
             }
            else{
                showWarningMessage("You must login first.");
                return;
                //currentScreen.style.display = "block";
            }
            break;
    }
    toggleScreen(previousScreen,currentScreen);

}
window.addEventListener("load", setupGame, false);

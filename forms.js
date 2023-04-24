
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
    event.preventDefault();

    if(!isLoggedIn){
        showWarningMessage("You must login first.");
        return;
    }
    let chosenKey = document.getElementById("shootKey").value;
    let tupacIcon = document.getElementById("tupac-radio");
    let biggieIcon = document.getElementById("biggie-radio");

    // check valid choise to shot
    if(chosenKey != "|s|" && !validateDetails(chosenKey,"keyboard")){
        showWarningMessage("You can only choose one letter or the space key");
        return;
    }

    if(!tupacIcon.checked && !biggieIcon.checked){
        showWarningMessage("You must pick a character.");
        return;
    }
    // check user character pick
    if(tupacIcon.checked ){
        currentCharacter = "Tupac";
        spaceshipImage.src = "images/tupacIcon.png";
        chickenImage.src = "images/biggieIcon.png";
        gameMusic = tupacPlaying;
        lostMusic = biggieGotShotMusic;
    } 
    else 
    {
        currentCharacter = "Biggie";
        spaceshipImage.src = "images/biggieIcon.png";
        chickenImage.src = "images/tupacIcon.png";
        gameMusic = biggiePlaying;
        lostMusic = pacGotShotMusic;
    }

    if(chosenKey == "|s|"){
        shootKey = 32; // Key code for the spacebar
    }
     else
    {
        shootKey = chosenKey.toUpperCase().charCodeAt(0) - 65 + 65; // Key code for the upper-case letter
    }

    timeLeft = document.getElementById("timeGame").value * 60;
    configureForm.reset();
    
    switchScreen("game");
    switchMusic(gameMusic);
    newGame();

}

// update the configuration time range
function updateTimeValue(value) {
    document.getElementById("rangeValue").innerHTML = value;
}
  
function registerUser(event) {
    event.preventDefault();

    let username = document.getElementById("registerUsername").value;
    let user_password = document.getElementById("registerPassword").value;
    let passwordValidation = document.getElementById("passwordValidation").value;
    let email = document.getElementById("email").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    var birthDay = new Date(document.getElementById("dob").value);
    var currentDate = new Date();

    // check if username exist
    if( username in users){
        showWarningMessage("username already exist, try different username.");
    }
    // check if password is valid ( at least 8 characters, 1 letter, 1 number )
    else if( !validateDetails(user_password)){
        showWarningMessage("Password is not valid! need to be at least 8 characters, 1 letter, 1 number");
    }
    // check if passwords validation match to password
    else if(passwordValidation != user_password){
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
    // check if birth day date is in the past
    else if(birthDay > currentDate) { 
        showWarningMessage("Your Birth Day cannot be in the future.");
    }
        
    // valid form
    else{
        addNewUser(username,user_password);
        showSuccessMessage("Registration completed successfuly!");
        registerForm.reset();
        switchScreen("login");
    }
}

function addNewUser(userName,userPassword){
    users[userName] = {
        password: userPassword,
        scores: []
    };
}

function loginUser(event){
    event.preventDefault();
    let username = document.getElementById("loginUsername").value;
    let user_password = document.getElementById("loginPassword").value;

    // check if password valid
    if(!(username  in users)){
        showWarningMessage("Username don't exist.");
    }
    // check password is correct
    else if(users[username]["password"] != user_password){
        showWarningMessage("Password is not correct.");
    }
    else{
        currentUser = username;
        showSuccessMessage("you logged in successfuly!");
        loginForm.reset();
        updateUserStatus();
        switchScreen("config");
    }
}


function showScoreBoard() {
  
    // Sort the scores in descending order
    const sortedScores = users[currentUser]["scores"].sort((a, b) => b - a);
  
    // Create a list item for each score and add it to the list
    sortedScores.forEach((score, index) => {
      const rankItem = document.createElement("td");
      const kingItem = document.createElement("td");
      const pointsItem = document.createElement("td");
      const newScore = document.createElement("tr");


      rankItem.textContent  = `#${index + 1}`;
      kingItem.textContent  = `${currentCharacter}`;
      pointsItem.textContent  = `${score}`;

      newScore.appendChild(rankItem);
      newScore.appendChild(kingItem);
      newScore.appendChild(pointsItem);
      document.getElementById("score-body").appendChild(newScore);

    });
  
    // Show the scoreboard
    scoreScreen.style.display = "flex";
  }


// update button of logout to login and vice versa
function updateUserStatus(){
    let buttons = document.querySelectorAll('.login-btn');
    buttons.forEach( button => { 
        button.classList.add("fade-out");
    });
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
    buttons.forEach( button => { 
        button.classList.remove("fade-out");
    });
}

function toggleScreen(screen1,screen2) {
    
    // same screen will not effect
    if(screen1 == screen2){
        return;
    }

    if(screen2 == gameScreen){
        document.getElementById("game-footer").style.display = "none";
        document.getElementById("game-header").style.display = "none";
    }
    if(screen1 == gameScreen ){
        document.getElementById("game-footer").style.display = "block";
        document.getElementById("game-header").style.display = "block";
    }
    
    if (screen2 == configureScreen){
        document.getElementById("game-footer").style.display = "none";
    }

    if ( screen1 == configureScreen && screen2 != gameScreen ){
        document.getElementById("game-footer").style.display = "block";
    }


    let displayType = screen2 == scoreScreen? "flex": "block";

    screen1.style.opacity = "0";
    setTimeout(function() {
        screen1.style.display = "none";
        screen2.style.display = displayType;
        screen2.style.opacity = "1";
      }, 300);

}

// Change screen by the menu buttons
function switchScreen(className){

    //  if the user exit the game screen while the game is runing
    if(currentScreen.id == "game" && !className.includes("game")){
        gamePaused = true;
        switchMusic(homeMusic);
    }

    // same screen do nothing
    if(className.includes(currentScreen.id)){
        return;
    }

    let previousScreen = currentScreen;
    //show only the chosen one
    switch(true) {

        case className.includes("home"):
            currentScreen = homeScreen;
            break;

        case className.includes("login"):
            if(!isLoggedIn){
                currentScreen = loginScreen;

            }else {
                updateUserStatus();
                showSuccessMessage("You log out successfuly.")
                return;
            }
            break;

        case className.includes("register"):
            currentScreen = registerScreen;
            break;

        case className.includes("config"):
            currentScreen = configureScreen; 
            break;
        
        case className.includes("score"):
            currentScreen = scoreScreen;
            break;

        default:
            currentScreen = gameScreen; 
            break;
    }
    toggleScreen(previousScreen,currentScreen);

}
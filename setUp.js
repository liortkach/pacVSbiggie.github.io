var homeScreen
var loginScreen;
var registerScreen;
var gameScreen;
var configureScreen;
var scoreScreen;
var aboutDialog;
var gameDialog;

var users;
var registerForm;
var loginForm;

var pacGotShotMusic;
var biggieGotShotMusic;
var homeMusic;
var tupacPlaying;

var biggiePlaying;
var endOfGame;
var gameMusic;
var lostMusic;

var currentScreen;
var currentMusic;
var currentUser;
var currentCharacter;
var isMusicPlaying;
var isLoggedIn;
var playerIcon;

function setupGame(){
    users = {
        p : {
            password :"testuser",
            scores: []
        }
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
    scoreScreen = document.getElementById("score-board");
    scoreScreen.style.display = "none";

    //first show the home page
    homeScreen.style.display = "block";
    homeScreen.style.opacity = 1;

    aboutDialog = document.getElementById('about-dialog');
    aboutDialog.style.display = "none"
    gameDialog = document.getElementById('game-dialog');
    gameDialog.style.display = "none"

    // music set up
    pacGotShotMusic = new Audio('audio/pacGotShot.mp3')
    biggieGotShotMusic = new Audio('audio/biggieGotShot.mp3')
    homeMusic = new Audio('audio/home.mp3');
    tupacPlaying = new Audio("audio/tupacPlaying.mp3");
    biggiePlaying = new Audio("audio/biggiePlaying.mp3");
    endOfGame = new Audio("audio/gf.mp3");
    hitMusic = new Audio("audio/hit.mp3")

    isMusicPlaying = true;
    isLoggedIn = false;
    currentScreen = homeScreen;
    currentMusic = homeMusic;
    currentMusic.play();

    // for testing the game looks on different screen sizes.
    window.addEventListener('resize', function () {
        console.log('Width:', window.innerWidth);
        console.log('Height:', window.innerHeight); 
    });
    

    document.getElementById("about-btn").addEventListener("click", (event) => {
        // Stop the click event from propagating to the document
        event.stopPropagation();
        // Show the dialog
        aboutDialog.style.display = "flex";

    });
  
    // close dialog button
    document.getElementById('close-modal').addEventListener('click', (event) => {
        event.stopPropagation();
        aboutDialog.style.display = "none";

    });

    document.addEventListener("click", (event) => {
        let isClickInside = aboutDialog.contains(event.target);

        // If the dialog is visible and the click is outside the dialog, hide it
        if(aboutDialog.style.display = "flex" && !isClickInside ){
            aboutDialog.style.display = "none";
        }
      });

    window.addEventListener("keydown", (event) => {

        if (event.keyCode === 27) {
            aboutDialog.style.display = "none";
        }
     });

     document.getElementById("mute-btn").addEventListener("click", handleMuteMusic);

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
          this.value += "|s|";
        }
      });
    
    document.getElementById("show-scoreboard").addEventListener("click", () => {
        // Hide the dialog
        gameDialog.style.display = "none";
        // Show the user's personal scoring board on a different screen
        showScoreBoard();
        switchScreen("score");
    });

    // Select all play again buttons
    const playButtons = document.getElementsByClassName('play-again-btn');
    // Loop through the buttons and add the click event listener to each
    for (let i = 0; i < playButtons.length; i++){
            playButtons[i].addEventListener('click', () => {
            
            if (currentMusic == lostMusic){
                triggerEndedEvent(currentMusic);
                return;
            }

            if(gameDialog.style.display != "none"){
                gameDialog.style.display = "none";
                switchScreen("config");
                return;

            }
            scoreScreen.style.display == "flex"? switchScreen("game"): null;
            clear();
            newGame();
            switchMusic(gameMusic);

        });
    };

      
}

window.addEventListener("load", setupGame, false);

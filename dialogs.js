
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

function showDialog(gameOverReason, score) {
    const title = document.getElementById("game-dialog-title");
    const message = document.getElementById("game-dialog-message");
    const description = document.getElementById("game-dialog-description");
    if (gameOverReason === "lost") {

      title.textContent = "You got Killed!";
      description.textContent = "The King is disapointed. Play again or get shot, your choise."
      gameDialog.style.backgroundImage = "url('images/lost.png')";

    } else if (gameOverReason === "time") {

        if(score < 100){
            title.textContent = "You can do better...";
            gameDialog.style.backgroundImage = "url('images/lost.png')";
        }else{
            title.textContent = "Winner!";
            gameDialog.style.backgroundImage = "url('images/king_bg.png')";
        }

      description.textContent = `There is more ${currentCharacter}s out there walking. You shold finish what you started.`

    } else if (gameOverReason === "champion") {

      title.textContent = "Champion!!";
      description.textContent = `You make the real king proud. go get youself a nice whore on ${currentCharacter} expense.`
      gameDialog.style.backgroundImage = "url('images/king_bg.png')";

    }
  
    message.textContent = `Game score: ${score}`;
  
    gameDialog.style.display = "flex";
}
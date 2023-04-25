// Vars for canvas settings

var canvas  // The canvas
var ctx     // after 2d
var canvasWidth     // For Canvas Width
var canvasHeight    // For Canvas Height


// Vars for the game

var spaceship   // Spaceship
var spaceshipImage  // Spaceship Image
var bgImage     // Canvas background
var chicken     // The Bad Spaceship
var chickenImage    // Image For Bad Spaceship
var chickens2DArray     // 2D Array For The 5X4 Bad Spaceships
var defualtChickenCoordinateX   // Default X to place the bad spaceships
var defualtChickenCoordinateY   // Default y to place the bad spaceships
var bullet      // The spaceship fire shot
var bulletImage     // The image for spaceship fire shot
var bulletArray     // Save all the bullets that are currentlly alive
var chickenVelocity     // To change the movement of bad spaceships from lift to right after reaching the corner
var initialChickenVelocity      // Start To go right
var padding     // Padding for space between elements
var startDrawChickensIndexX     // The current x to start drawing all alive bad spaceships
var startDrawChickensIndexY     // The current y corner to start drawing all alive bad spaceships
var egg     // Bad spaceship fire shot
var eggImage    // Image for bad spaceship fire shot
var eggArray    // All bad spaceships fire shots that are alive now
var visiableChickens    // 1D array for only alive bad spaceships
var psilot      // Number of lives left to the player
var eggPrior    // Controls how fast the bad spaceship fire shot will move
var shooting    // Controls that the spaceship will fire after little delay each time and not like machine gun



// Vars for controling the game

var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var gamePoints  // How many points the player achieved so far
var now     // The time now
var intervalTimerMain   // Interval of main function
var delta   // The difference between last time checked and now
var then    // The last time checked
var keysDown    // Which key is pressed
var keyUp       // Which key is up
var prior       // Controls how fast the bad spaceships are moving
var shootKey    // Which key the user chose to fire with
var gamePaused  // If the game is paused 
var intervalUpdateTime  // Interval for update time function
var timeLeft       // How much time left
var intervalsActivated      // To check if the intervals are setted in the first time


window.addEventListener("load", setupGamePlay, false);


function setupGamePlay() {
    // Get the canvas
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;

    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.8;

    canvasWidth = canvas.width
    canvasHeight = canvas.height

    bgImage = new Image()
    bgImage.src = "images/game_bg.png"

    spaceshipImage = new Image()

    chickenImage = new Image()


    bulletImage = new Image()
    bulletImage.src = "images/fireshot.png"

    eggImage = new Image()
    eggImage.src = "images/enemyFire.png"

    intervalsActivated = false


    // Check for keys pressed where key represents the keycode captured
    document.addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);

    document.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);

    // add points to the score when the div is clicked
    document.getElementById("score").addEventListener("click", function () {
        score += 10;
        updateScore();
    });

}


/* // set up interval timer to update game
function startTimer() {
    canvas.addEventListener("click", fireCannonball, false);
    intervalTimerMain = window.setInterval(updatePositions, TIME_INTERVAL);
} // end function startTimer */


function degreesToRadians(degrees) {
    return (Math.PI / 180) * degrees
}


// Reset the spaceship and chickens positions
function reset() {
    // Reset spaceship position
    spaceship.x = canvasWidth / 2.2
    spaceship.y = canvasHeight * 0.9

    defualtChickenCoordinateX = (canvasWidth / 11) * 4
    defualtChickenCoordinateY = (canvasHeight / 13)

    padding = canvasWidth * 0.01

    startDrawChickensIndexX = defualtChickenCoordinateX
    startDrawChickensIndexY = defualtChickenCoordinateY

    initialChickenVelocity = canvasWidth / 2

    //setDefaultBullet()
    /*     setDefaultChickens()*/
    eggArray = []
    bulletArray = []
}


function setDefaultChickens() {
    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {

            // Draw Chickens in defualt 5X4

            chickens2DArray[col][row].x = defualtChickenCoordinateX + col * (chickenImage.width + padding)
            chickens2DArray[col][row].y = defualtChickenCoordinateY + row * (chickenImage.height + padding)
            chickens2DArray[col][row].visiable = true
        }
    }
}


/* function setDefaultBullet(bullet) {
    bullet.x = spaceship.x + spaceshipImage.width / 2 - bulletImage.width / 2
    bullet.y = spaceship.y - 30
} */


// Blank the chicken who got shot
function hideChicken(chicken) {
    chicken.visiable = false
    let index = visiableChickens.indexOf(chicken)
    if (index !== -1) {
        visiableChickens.splice(index, 1);
    }
}



function userShot() {
    if (!gamePaused) {

        let newbullet = new Object()
        newbullet.visiable = true
        newbullet.x = spaceship.x
        newbullet.y = spaceship.y
        bulletArray.unshift(newbullet)
        /* if (bulletArray.length == 0) {
            let newbullet = new Object()
            newbullet.visiable = true
            newbullet.x = spaceship.x
            newbullet.y = spaceship.y
            bulletArray.push(newbullet)
        }
        else if (bulletArray.length < 2 && bulletArray[bulletArray.length - 1].y < canvasHeight * 0.25) {
            let newbullet = new Object()
            newbullet.visiable = true
            newbullet.x = spaceship.x
            newbullet.y = spaceship.y
            bulletArray.push(newbullet)
        } */
    }
}

// Update game objects - change player position based on key pressed

function updatePositions(modifier) {
    if (!gamePaused) {
        if ((38 in keysDown && spaceship.y > canvasHeight * 0.6)) { // Player holding up
            spaceship.y -= spaceship.speed * modifier;
        }
        if ((40 in keysDown && spaceship.y < canvasHeight * 0.9)) { // Player holding down
            spaceship.y += spaceship.speed * modifier;
        }
        if (37 in keysDown && spaceship.x > padding) { // Player holding left
            spaceship.x -= spaceship.speed * modifier;
        }
        if (39 in keysDown && spaceship.x + 25 < canvasWidth - padding) { // Player holding right
            spaceship.x += spaceship.speed * modifier;
        }

        // You Dont Have Machine Gun 
        if (shootKey in keysDown && !shooting) { // Player holding shoot key 
            userShot()

            shooting = true;

            // You DontHave Machine Gun (TOO EASY)
            setTimeout(() => {
                shooting = false;
            }, 500);  // set a timeout to stop shooting after 0.5 seconds

        }
    }
    var chickenUpdate = TIME_INTERVAL / 15000.0 * chickenVelocity * prior;
    startDrawChickensIndexX += chickenUpdate;

    for (let j = 0; j < bulletArray.length; j++) {
        bulletArray[j].y -= bullet.speed * modifier

    }

    for (let j = 0; j < eggArray.length; j++) {
        eggArray[j].y += egg.speed * modifier * eggPrior

    }

    if (bulletArray.length > 0 && bulletArray[bulletArray.length - 1].y < bulletImage.height) {
        bulletArray.pop()
    }

    if (eggArray.length > 0 && eggArray[eggArray.length - 1].y > canvasHeight - eggImage.height) {
        eggArray.pop()
    }

    /*     if (bulletArray[j].visiable == false) {
            setDefaultBullet(bulletArray[j])
        } */

    collisionDetection()

    updateScore()

    // Check if user won
    if (visiableChickens.length == 0) {
        gameOver();
    }
}

// Check if bullet and chicken collider and if need to end game
function collisionDetection() {
    chickens2DArray.forEach(chickenArr => {
        chickenArr.forEach(chicken => {
            bulletArray.forEach(bullet => {
                if (
                    /* bullet.visiable == true
                    && */ chicken.visiable == true
                    && bullet.x <= (chicken.x + 16)
                    && chicken.x <= (bullet.x + 16)
                    && bullet.y <= (chicken.y + 16)
                    && chicken.y <= (bullet.y + 16)
                ) {
                    let index = chickenArr.indexOf(chicken)
                    gamePoints += (5 - index) * 5;
                    bullet.visiable = false
                    bulletArray.pop()
                    hideChicken(chicken)
                    setTimeout(100)
                    return
                }
            })
        });
    });

    eggArray.forEach(egg => {
        if (
            egg.x <= (spaceship.x + 12)
            && spaceship.x <= (egg.x + 12)
            && egg.y <= (spaceship.y + 12)
            && spaceship.y <= (egg.y + 12)
        ) {
            psilot -= 1

            switchMusic(lostMusic)

            gamePaused = true

            currentMusic.addEventListener('ended', function () {

                // Set gamePaused to false when audio finishes playing


                // No more chances
                if (psilot > 0) {

                    // TODO - Music needs to continue from where it stopped
                    switchMusicAfterGotShot(gameMusic)
                    reset()
                    gamePaused = false;
                }
                else {
                    switchMusic(endOfGame)
                    gameOver()
                }

                return
            });

        }
    })
}


function gameOver() {
    //clear()
    gamePaused = true;
    users[currentUser]["scores"].push(gamePoints);
    // Game over because the player lost all lives
    if (!psilot) {
        showDialog("lost", gamePoints);
    }
    // Game over because the time is up, and the player scored 120 points
    else if (!timeLeft) {
        showDialog("time", gamePoints);
    }
    // Game over because the player killed all bad spaceships
    else {
        showDialog("champion", gamePoints);
    }

}




function stopTimer() {
    window.clearInterval(intervalTimerMain);
}


function newGame() {

    // Game Objects
    spaceship = { speed: 256 }
    chickens2DArray = new Array(5)
    bullet = { speed: 256 }
    egg = { speed: 128 }
    prior = 1
    eggPrior = 1

    bulletArray = []
    eggArray = []
    visiableChickens = []

    keysDown = {}

    gamePaused = false

    shooting = false

    gamePoints = 0

    psilot = 3



    updateScore(); // initial display of the score
    updateTime(); // initial display of the time

    for (let i = 0; i < chickens2DArray.length; i++) {
        chickens2DArray[i] = new Array(4)
    }

    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {
            chickens2DArray[col][row] = new Object() // Objects for chickens
            chickens2DArray[col][row].bgImage = new Image()
            visiableChickens.unshift(chickens2DArray[col][row])
        }
    }

    setDefaultChickens()

    reset();

    chickenImage.width = canvasWidth * 0.05
    chickenImage.height = canvasHeight * 0.05 * 1.5

    spaceshipImage.width = canvasWidth * 0.05
    spaceshipImage.height = canvasHeight * 0.05 * 1.5

    bulletImage.width = canvasWidth * 0.04
    bulletImage.height = canvasHeight * 0.04

    eggImage.width = canvasWidth * 0.04
    eggImage.height = canvasHeight * 0.04


    chickenVelocity = initialChickenVelocity
    startDrawChickensIndexX = defualtChickenCoordinateX
    startDrawChickensIndexY = defualtChickenCoordinateY

    then = Date.now();


    if (intervalsActivated) {
        clearInterval(intervalTimerMain)
        clearInterval(intervalTimeEggs)
        clearInterval(intervalTimerPrior)
        clearInterval(intervalUpdateTime)
    }

    intervalTimerMain = setInterval(main, 1); // main loop 
    intervalTimeEggs = setInterval(createNewEgg, 2000) // create egg each custume time
    intervalTimerPrior = setInterval(updatePrior, 6500) // update the speed of the chickens and creation of eggs
    intervalUpdateTime = setInterval(updateTime, 1000); // update the time every second


    intervalsActivated = true;


    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {
            chickens2DArray[col][row].bgImage = chickenImage
        }
    }
}

function main() {

    now = Date.now()
    delta = now - then

    if (!gamePaused) {
        updatePositions(delta / 1000)
        draw()
    }
    then = now
}


function draw() {
    clear()
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceshipImage.width, spaceshipImage.height)
    drawChickens()
    drawBullets()
    drawEggs()
}


function drawChickens() {

    // if the blocker hit the top or bottom, reverse direction

    if (startDrawChickensIndexX - padding < 0 || startDrawChickensIndexX + 5 * (chickenImage.width + padding) > canvasWidth)
        chickenVelocity *= -1;

    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {

            // Draw Chickens in defualt 5X4

            chickens2DArray[col][row].x = startDrawChickensIndexX + col * (chickenImage.width + padding)
            chickens2DArray[col][row].y = startDrawChickensIndexY + row * (chickenImage.height + padding)

            if (chickens2DArray[col][row].visiable == true) {
                ctx.drawImage(chickens2DArray[col][row].bgImage, chickens2DArray[col][row].x,
                    chickens2DArray[col][row].y, chickenImage.width, chickenImage.height)
            }
        }
    }
}


function drawBullets() {

    for (let i = 0; i < bulletArray.length; i++) {
        if (bulletArray[i].visiable == true) {
            ctx.drawImage(bulletImage, bulletArray[i].x, bulletArray[i].y, bulletImage.width, bulletImage.height)
        }

    }

}


function drawEggs() {

    for (let i = 0; i < eggArray.length; i++) {
        ctx.drawImage(eggImage, eggArray[i].x, eggArray[i].y, eggImage.width, eggImage.height)
    }

}


function updatePrior() {
    if (!gamePaused) {
        if (prior < 5) {
            prior++
            eggPrior++
            clearInterval(intervalTimeEggs)
            intervalTimeEggs = setInterval(createNewEgg, 2000 / eggPrior)
        }
    }
}


function createNewEgg() {

    if (!gamePaused) {
        // Pick Random Chicken to shot
        if (eggArray.length == 0) {
            var index = Math.floor(Math.random() * visiableChickens.length);


            var chosenVisiableChicken = visiableChickens[index]
            var newEgg = new Object()
            newEgg.x = chosenVisiableChicken.x
            newEgg.y = chosenVisiableChicken.y
            eggArray.unshift(newEgg)
        }

        else if (eggArray[eggArray.length - 1].y < canvasHeight * 0.75) {
            var index = Math.floor(Math.random() * visiableChickens.length);


            var chosenVisiableChicken = visiableChickens[index]
            var newEgg = new Object()
            newEgg.x = chosenVisiableChicken.x
            newEgg.y = chosenVisiableChicken.y
            eggArray.unshift(newEgg)
        }
    }
}


function clear() {
    ctx.fillStyle = '#d0e7f9';
    //set active color to #d0e... (nice blue)  
    //UPDATE - as 'Ped7g' noticed - using clearRect() in here is useless, we cover whole surface of the canvas with //blue rectangle two lines below. I just forget to remove that line  
    //ctx.clearRect(0, 0, canvas.width, canvas.height);  
    //clear whole surface  
    ctx.beginPath();
    //start drawing  
    ctx.rect(0, 0, canvas.width, canvas.height);
    //draw rectangle from point (0, 0) to  
    //(width, height) covering whole canvas  
    ctx.closePath();
    //end drawing  
    ctx.fill();
    //fill rectangle with active  
    //color selected before  
};

function updateScore() {
    document.querySelector("#score .value").innerHTML = gamePoints;
}

// update the time left and display it
function updateTime() {
    if (!gamePaused) {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(intervalUpdateTime); // stop the timer when time is up
            document.getElementById("time").innerHTML = "Time's Up!";
        } else {
            document.querySelector("#time .value").innerHTML = timeLeft + " seconds";
        }
    }
}


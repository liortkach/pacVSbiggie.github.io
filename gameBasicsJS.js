var canvas
var ctx
var canvasWidth
var canvasHeight
var pacGotShotMusic
var biggieGotShotMusic

var spaceship
var spaceshipImage
var bgImage
var chicken
var chickenImage
var chickens2DArray
var defualtChickenCoordinateX
var defualtChickenCoordinateY
var bullet
var bulletImage
var bulletArray
var chickenVelocity
var initialChickenVelocity
var widthMoveSize
var heightMoveSize
var padding
var startDrawChickensIndexX
var startDrawChickensIndexY
var egg
var eggImage
var eggArray
var visiableChickens
var psilot
var eggPrior
var shooting

var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var gamePoints
var now
var intervalTimerMain
var delta
var then
var keysDown
var keyUp
var prior
var userTimeMinutes
var choshenKey
var totalTime
var gamePaused
var lastTimeShot
var intervalId
var timeLeft

window.addEventListener("load", setupGamePlay, false);


function setupGamePlay() {
    // Get the canvas
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;

    canvasWidth = canvas.width
    canvasHeight = canvas.height

    // start a new game
    document.getElementById("start-btn").addEventListener("click", newGame, false)
    document.getElementById("startButton").addEventListener("click", newGame, false)


    bgImage = new Image()
    bgImage.src = "images/background.jpg"

    spaceshipImage = new Image()
    spaceshipImage.src = "images/spaceship.jpg"


    chickenImage = new Image()
    chickenImage.src = "images/logo.png"


    bulletImage = new Image()
    bulletImage.src = "images/fireshot.jpg"


    eggImage = new Image()
    eggImage.src = "images/egg.jpg"


    pacGotShotMusic = new Audio('audio/pacGotShot.mp3')
    biggieGotShotMusic = new Audio('audio/biggieGotShot.mp3')


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
    spaceship.speed = 256

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
        bulletArray.push(newbullet)
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
        if (68 in keysDown && !shooting) { // Player holding d for shoot
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
            egg.x <= (spaceship.x + 8)
            && spaceship.x <= (egg.x + 8)
            && egg.y <= (spaceship.y + 8)
            && spaceship.y <= (egg.y + 8)
        ) {
            // TODO - need to finish what happen when egg hits
            psilot -= 1

            pacGotShotMusic.play()

            gamePaused = true

            currentMusic = document.getElementById("bgmusic-game");
            currentMusic.pause()

            pacGotShotMusic.addEventListener('ended', function () {

                // Set gamePaused to false when audio finishes playing
                gamePaused = false;

                currentMusic.play()

                // No more chances
                if (psilot > 0) {
                    reset()
                }
                else {
                    gameOver()
                }

                return
            });


            /*             // No more chances
                        if (psilot > 0) {
                            reset()
                        }
                        else {
                            gameOver()
                        } */
        }
    })
}


function gameOver() {
    clear()
    alert("Game over")

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

    bulletArray = []
    eggArray = []
    visiableChickens = []

    keysDown = {}

    gamePaused = false

    shooting = false

    gamePoints = 0

    timeLeft = 60

    updateScore(); // initial display of the score
    updateTime(); // initial display of the time

    for (let i = 0; i < chickens2DArray.length; i++) {
        chickens2DArray[i] = new Array(4)
    }

    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {
            chickens2DArray[col][row] = new Object() // Objects for chickens
            chickens2DArray[col][row].bgImage = new Image()
            visiableChickens.push(chickens2DArray[col][row])
        }
    }

    setDefaultChickens()

    reset();

    prior = 1
    eggPrior = 1

    psilot = 3

    chickenImage.width = canvasWidth * 0.04
    chickenImage.height = canvasHeight * 0.04

    spaceshipImage.width = canvasWidth * 0.04
    spaceshipImage.height = canvasHeight * 0.04

    bulletImage.width = canvasWidth * 0.03
    bulletImage.height = canvasHeight * 0.03

    eggImage.width = canvasWidth * 0.035
    eggImage.height = canvasHeight * 0.035


    chickenVelocity = initialChickenVelocity
    startDrawChickensIndexX = defualtChickenCoordinateX
    startDrawChickensIndexY = defualtChickenCoordinateY

    then = Date.now();
    intervalTimerMain = setInterval(main, 1); // main loop 
    intervalTimeEggs = setInterval(createNewEgg, 2000) // create egg each custume time
    intervalTimerPrior = setInterval(updatePrior, 6500) // update the speed of the chickens and creation of eggs
    intervalId = setInterval(updateTime, 1000); // update the time every second


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
    ctx.drawImage(bgImage, 0, 0)
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
            eggArray.push(newEgg)
        }

        else if (eggArray.length < 2 && eggArray[eggArray.length - 1].y < canvasHeight * 0.75) {
            var index = Math.floor(Math.random() * visiableChickens.length);


            var chosenVisiableChicken = visiableChickens[index]
            var newEgg = new Object()
            newEgg.x = chosenVisiableChicken.x
            newEgg.y = chosenVisiableChicken.y
            eggArray.push(newEgg)
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

// update the score
function updateScore() {
    document.getElementById("score").innerHTML = "Score: " + gamePoints;
}

// update the time left and display it
function updateTime() {
    document.getElementById("time").innerHTML = "Time Left: " + timeLeft + " seconds";
    if (!gamePaused) {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(intervalId); // stop the timer when time is up
            document.getElementById("time").innerHTML = "Time's Up!";
        }
    }
}


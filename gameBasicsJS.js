var canvas
var ctx
var canvasWidth
var canvasHeight

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

var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var gamePoints
var now
var intervalTimerMain
var delta
var then
var keysDown
var keyUp
var prior

window.addEventListener("load", setupGamePlay, false);


function setupGamePlay() {
    // Get the canvas
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    canvasWidth = canvas.width
    canvasHeight = canvas.height

    // start a new game
    document.getElementById("startButton").addEventListener("click", newGame, false)


    bgImage = new Image()
    bgImage.src = "images/world.jpg"


    spaceshipImage = new Image()
    spaceshipImage.src = "images/spaceship.jpg"


    chickenImage = new Image()
    chickenImage.src = "images/logo.png"


    bulletImage = new Image()
    bulletImage.src = "images/fireshot.jpg"


    eggImage = new Image()
    eggImage.src = "images/egg.jpg"


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

    gamePoints = 0


    // Check for keys pressed where key represents the keycode captured
    document.addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);

    document.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);

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

// Update game objects - change player position based on key pressed

function updatePositions(modifier) {

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
    if (68 in keysDown) { // Player holding d for shoot

        if (bulletArray.length == 0) {
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
        }
    }

    var chickenUpdate = TIME_INTERVAL / 15000.0 * chickenVelocity * prior;
    startDrawChickensIndexX += chickenUpdate;

    for (let j = 0; j < bulletArray.length; j++) {
        bulletArray[j].y -= bullet.speed * modifier

    }

    for (let j = 0; j < eggArray.length; j++) {
        eggArray[j].y += egg.speed * modifier

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

    if (visiableChickens.length == 0)
    {
        alert("You Win " + gamePoints)
    }
}
// Check if bullet and chicken collider
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
                    let index = chickens2DArray.indexOf(chickenArr)
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
            egg.x <= (spaceship.x + 16)
            && spaceship.x <= (egg.x + 16)
            && egg.y <= (spaceship.y + 16)
            && spaceship.y <= (egg.y + 16)
        ) {
            // TODO - need to finish what happen when egg hits
            psilot -= 1

            if (psilot > 0) {
                reset()
            }
            else {
                gameOver()
            }
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
    reset();
/*     startTimer(1, 0);
 */
    prior = 1

    psilot = 3

    chickenImage.width = 20
    chickenImage.height = 20

    spaceshipImage.width = 30
    spaceshipImage.height = 30

    bulletImage.width = 10
    bulletImage.height = 10

    eggImage.width = 15
    eggImage.height = 15

    chickenVelocity = initialChickenVelocity
    startDrawChickensIndexX = defualtChickenCoordinateX
    startDrawChickensIndexY = defualtChickenCoordinateY

    then = Date.now();
    intervalTimerMain = setInterval(main, 1);
    intervalTimeEggs = setInterval(createNewEgg, 2000)
    intervalTimerPrior = setInterval(updatePrior, 7500)


    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {
            chickens2DArray[col][row].bgImage = chickenImage
        }
    }
}

function main() {

    now = Date.now()
    delta = now - then

    updatePositions(delta / 1000)
    draw()

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
    if (prior < 16) {
        prior++
    }
    clearInterval(intervalTimeEggs)

    intervalTimeEggs = setInterval(createNewEgg, 2000 / prior)


}


function createNewEgg() {


    // Pick Random Chicken to shot
    var index = Math.floor(Math.random() * visiableChickens.length);


    var chosenVisiableChicken = visiableChickens[index]
    var newEgg = new Object()
    newEgg.x = chosenVisiableChicken.x
    newEgg.y = chosenVisiableChicken.y
    eggArray.push(newEgg)

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

/* 
function startTimer(minutes, seconds) {
    let totalTime = (minutes * 60) + seconds; // Convert minutes and seconds to total seconds
    let timer = setInterval(() => {
        let minutesLeft = Math.floor(totalTime / 60);
        let secondsLeft = totalTime % 60;
        console.log(`${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`); // Display the time remaining
        totalTime--;
        if (totalTime < 0) {
            clearInterval(timer);
            console.log('Timer finished!');
        }
    }, 1000); // Run the timer every 1 second */


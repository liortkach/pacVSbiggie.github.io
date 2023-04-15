var canvas
var ctx

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
var chickenVelocity
var initialChickenVelocity

var gamePoints
var curTime
var intervalTimer


function setupGamePlay() {
    // Get the canvas
    canvas = document.getElementById("theCanvas");
    ctx = canvas.getContext("2d");


    // start a new game
    document.getElementById("submitButton").addEventListener("click", newGame, false)


    // TODO: Set bg image

    bgImage = new Image()


    // TODO: Set spaceship Image

    spaceshipImage = new Image()


    // TODO: Set chicken image

    chickenImage = new Image()


    // TODO: Set bullet image

    bulletImage = new Image()


    // Game Objects
    spaceship = { speed: 64 }
    chickens2DArray = new Array(4)

    for (let i = 0; i < chickens2DArray.length; i++) {
        chickens2DArray[i] = new Array(5)
    }

    for (let i = 0; i < chickens2DArray.length; i++) {
        for (let j = 0; j < chickens2DArray[i].length; j++) {
            chickens2DArray[i][j] = new Object() // Objects for chickens
        }
    }


    gamePoints = 0


    // Check for keys pressed where key represents the keycode captured
    addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);

    addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
}


// set up interval timer to update game
function startTimer()
{
   canvas.addEventListener( "click", fireCannonball, false );
   intervalTimer = window.setInterval( updatePositions, TIME_INTERVAL );
} // end function startTimer


function degreesToRadians(degrees) {
    return (Math.PI / 180) * degrees
}


// Reset the spaceship and chickens positions
function reset() {
    // Reset spaceship position
    spaceship.x = canvas.width / 2
    spaceship.y = canvas.height * 0.99
}


// Blank the chicken who got shot
function hideChicken(i, j) {
    chickens2DArray[i][j].bgImage.src = ''
}

// Update game objects - change player position based on key pressed

function updatePositions(modifier) {
    if ((38 in keysDown)) { // Player holding up
        spaceship.y -= spaceship.speed * modifier;
    }
    if ((40 in keysDown)) { // Player holding down
        spaceship.y += spaceship.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        spaceship.x -= spaceship.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        spaceship.x += spaceship.speed * modifier;
    }


    // Check if bullet and chicken collider
    if (
        bullet.x <= (monster.x + 32)
        && monster.x <= (bullet.x + 32)
        && bullet.y <= (monster.y + 32)
        && monster.y <= (bullet.y + 32)
    ) {
        ++gamePoints;
    }
}


function stopTimer() {
    canvas.removeEventListener( "click", spaceshipShoot, false );
    window.clearInterval( intervalTimer );
}


function newGame() {
    reset()
    s
}

// TODO: To add the coordinate Y so the shoot will be from the top
function spaceshipShoot() {

    ctx.drawImage(bulletImage, spaceships.x, spaceship.y)
    bullet.x = spaceship.x
    bullet.y = spaceship.y
}


function main() {

    curTime = Date.now()

}


function drawChickens() {

    // if the blocker hit the top or bottom, reverse direction
    if (blocker.start.x < 0 || blocker.end.x > canvasHeight)
        chickenVelocity *= -1;

    // if the target hit the top or bottom, reverse direction
    if (target.start.y < 0 || target.end.y > canvasHeight)
        chickenVelocity *= -1;
}


function drawChickensDefault() {

    for (let i = 0; i < chickens2DArray.length; i++) {
        for (let j = 0; j < chickens2DArray[i].length; j++) {
            // Draw Chickens in defualt 5X4
            ctx.drawImage(chickenImage, defualtChickenCoordinateX * i, defualtChickenCoordinateY * j)
        }
    }
}

function drawSmile() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    ctx.clearRect(147, 220, 170, 115);

    ctx.beginPath();
    ctx.arc(225, 225 + 150 / 6, 150 / 2, 0, degreesToRadians(180), false)
    ctx.stroke()
}

function drawSad() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(147, 220, 170, 115);

    ctx.beginPath();
    ctx.arc(225, 225 + 150 / 2, 150 / 2, 0, degreesToRadians(180), true)
    ctx.stroke()
}

// function smile() {
//     document.addEventListener("click", drawSmile, false)
// }

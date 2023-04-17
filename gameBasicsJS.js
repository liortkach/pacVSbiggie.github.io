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
var chickenVelocity
var initialChickenVelocity
var widthMoveSize
var heightMoveSize
var padding
var startDrawChickensIndexX
var startDrawChickensIndexY

var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var gamePoints
var now
var intervalTimer
var delta
var then
var keysDown
var keyUp


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


    // TODO: Set bullet image

    bulletImage = new Image()
    bulletImage.src = "images/fireshot.jpg"

    // Game Objects
    spaceship = { speed: 256 }
    chickens2DArray = new Array(5)
    bullet = { speed: 256 }

    keysDown = {}

    for (let i = 0; i < chickens2DArray.length; i++) {
        chickens2DArray[i] = new Array(4)
    }

    for (let col = 0; col < chickens2DArray.length; col++) {
        for (let row = 0; row < chickens2DArray[col].length; row++) {
            chickens2DArray[col][row] = new Object() // Objects for chickens
            chickens2DArray[col][row].bgImage = new Image()
        }
    }


    gamePoints = 0


    // Check for keys pressed where key represents the keycode captured
    document.addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);

    document.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);

}


// set up interval timer to update game
function startTimer() {
    canvas.addEventListener("click", fireCannonball, false);
    intervalTimer = window.setInterval(updatePositions, TIME_INTERVAL);
} // end function startTimer


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

    setDefaultBullet()
    setDefaultChickens()
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


function setDefaultBullet() {
    bullet.x = spaceship.x + spaceshipImage.width / 2 - bulletImage.width / 2
    bullet.y = spaceship.y - 30
}


// Blank the chicken who got shot
function hideChicken(chicken) {
    chicken.visiable = false
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
        bullet.visiable = true
    }

    var chickenUpdate = TIME_INTERVAL / 15000.0 * chickenVelocity;
    startDrawChickensIndexX += chickenUpdate;

    if (bullet.visiable) {
        bullet.y -= bullet.speed * modifier
    }


    if (bullet.y < bulletImage.height) {
        bullet.visiable = false
        setDefaultBullet()
    }
    

    if (bullet.visiable == false)
    {
        setDefaultBullet()
    }

    
    collisionDetection()
}
// Check if bullet and chicken collider
function collisionDetection() {
    chickens2DArray.forEach(chickenArr => {
        chickenArr.forEach(chicken => {
            if (
                bullet.visiable == true
                && chicken.visiable == true
                && bullet.x <= (chicken.x + 32)
                && chicken.x <= (bullet.x + 32)
                && bullet.y <= (chicken.y + 32)
                && chicken.y <= (bullet.y + 32)
            ) {
                ++gamePoints;
                bullet.visiable = false
                setDefaultBullet()
                hideChicken(chicken)
                setTimeout(100)
                return
            }
        })
    });
}


function stopTimer() {
    window.clearInterval(intervalTimer);
}


function newGame() {
    reset();

    chickenImage.width = 20
    chickenImage.height = 20

    spaceshipImage.width = 30
    spaceshipImage.height = 30

    bulletImage.width = 10
    bulletImage.height = 10
    bullet.visiable = false

    chickenVelocity = initialChickenVelocity
    startDrawChickensIndexX = defualtChickenCoordinateX
    startDrawChickensIndexY = defualtChickenCoordinateY

    then = Date.now();
    intervalTimer = setInterval(main, 1);

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

    if (bullet.visiable) {
        drawBullet()
    }
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
            
            if (chickens2DArray[col][row].visiable == true){
                ctx.drawImage(chickens2DArray[col][row].bgImage, chickens2DArray[col][row].x,
                    chickens2DArray[col][row].y, chickenImage.width, chickenImage.height)
            }
        }
    }
}


function drawBullet() {

    ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletImage.width, bulletImage.height)
}

// function drawChickensDefault() {

//     chickenImage.width = 20
//     chickenImage.height = 20

//     for (let col = 0; col < chickens2DArray.length; col++) {
//         for (let row = 0; row < chickens2DArray[col].length; row++) {
//             // Draw Chickens in defualt 5X4
//             ctx.drawImage(chickenImage, defualtChickenCoordinateX + col * (chickenImage.width + padding),
//                 defualtChickenCoordinateY + row * (chickenImage.height + padding), chickenImage.width, chickenImage.height)
//         }
//     }
// }

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
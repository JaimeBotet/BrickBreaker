var myGameBall;
var mySaveBar;
var myBrick;
var score = 0;
var nameText = document.querySelector('#name-text');
// var offsetX = 230;
var rightPressed = false;
var leftPressed = false;
//Constants of the bricks
var brickRows = 4;
var brickColumns = 7;
var brickWidth = 90;
var brickHeight = 22;
var brickSpacing = 15;
var brickOffsetTop = 34;
var brickOffsetLeft = 34;
var bricks = [];
for (let i = 0; i < brickRows; i++) {
    bricks[i] = [];
    for(let j = 0; j < brickColumns; j++){
        bricks[i][j] = { x: 0, y : 0, status : 0};
    }
}
//To make a quick presentation we enable just one brick:
// bricks[3][6].status = 1;

//Listener to start the game
document.querySelector('.game_process').addEventListener('click', globalClick);

function globalClick(e) {
    if (e.target.id === 'start-button') startButtonClick();
    if (e.target.id === 'restart-button') restartGame();
}

function startButtonClick() {
    const playerName = nameText.value;
    if (playerName) newGame(playerName);
}

function newGame(playerName) {
    score = 0;
    player = playerName;
    next(".game_intro", ".game_play");
    //We make all the blocks visible again
    for (let i = 0; i < brickRows; i++) {
        for(let j = 0; j < brickColumns; j++){
            bricks[i][j].status = 1;
        }
    }
    //To make a quick presentation we enable just one brick:
    // bricks[3][6].status = 1;

    let userInfo = document.createElement("div");
    userInfo.className = "game__user";
    let usercontent = `<p class="user__name">${player}</p>
       <p class="user__score">Is currently playing...</p>`;
    userInfo.innerHTML = usercontent;

    document.querySelector(".score__box").prepend(userInfo);

    startGame();
}

function next(current, next) {
    document.querySelector(current).style.left = "-100%"
    document.querySelector(next).style.left = "0%"
    if (next === ".game_finsh") {
        setTimeout(() => {
            document.querySelector(current).style.left = "100%"
        }, 1000);
    }
}

function startGame(){
    myGameBall = new createBall( 10, "red", 390, 450); //we make a ball
    mySaveBar = new createPaddle(60, 8, "blue", 360, 480); //we create the save bar
    myGameArea.start();
}

function restartGame() {
    nameText.value = ''
  //   next(".game__end", ".game__start")
    document.querySelector(".game_finish").style.left = "100%"
    document.querySelector(".game_intro").style.left = "0%"
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start : function() {
        this.canvas.setAttribute("class", "my_canvas_cl");
        this.canvas.setAttribute("width", "788px");
        this.canvas.setAttribute("height", "490px");
        this.context = this.canvas.getContext("2d");
        var canvas_section = document.getElementById("my_canvas_id");
        //We append the <canvas> element under the <div> we want
        canvas_section.insertBefore(this.canvas, canvas_section.childNodes[0]);
        this.interval = setInterval(updateGameArea,10);
        //We make the bar responsive to the mouse
        this.canvas.addEventListener("mousemove", function(e){
            //we add a listener so the bar moves with the mouse
            myGameArea.x = e.offsetX;
            // myGameArea.x = e.clientX -offsetX;
            myGameArea.y = e.clientY;
        });
        //We make the bar responsive to the keyboard arrow side keys
        document.addEventListener("keydown", function(e){
            if(e.key == 'Right' || e.key == 'ArrowRight'){
                rightPressed = true;
            }
            if(e.key == 'Left' || e.key == 'ArrowLeft'){
                leftPressed = true;
            }
        });
        document.addEventListener("keyup", function(e){
            if(e.key == 'Right' || e.key == 'ArrowRight'){
                rightPressed = false;
            }
            if(e.key == 'Left' || e.key == 'ArrowLeft'){
                leftPressed = false;
            }
        });
        console.log(bricks);
    },
    clear : function(){
        //Here we can either use the "clearRect" method, which just clears the screen
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Or add a trailing effect, redrawing everything with semitransparent frames
        this.context.fillStyle = 'rgba(0, 255, 255, 0.3)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //The stop function will make the game stop by stop "refreshing"(updating) the frames
    stop : function(){
        clearInterval(this.interval);
    }
}

function createBall(radius, color, x, y){
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.bounce = 1;
    this.speedX = 1; //gives movement in the X axis
    this.speedY = -1; // give movement in the Y axis
    this.update = function(){
        let ctx = myGameArea.context;
        //here we draw the circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    //This function checks if the ball is hitting the walls or the saveBar
    this.hitObject = function() {
        var sideHitRight = myGameArea.canvas.width - radius;
        var sideHitLeft = radius;
        var topHit = radius;
        var bottomHit = myGameArea.canvas.height - radius;
        var bottomMargin = 5;
        collisionDetector();
        if(this.x >= sideHitRight) {
            this.x = sideHitRight;
            this.speedX *= -this.bounce;
        }
        else if(this.x < sideHitLeft) {
            this.x = sideHitLeft;
            this.speedX *= -this.bounce;
        }
        else if(this.y < topHit) {
            this.y = topHit;
            this.speedY *= -this.bounce;
        }
        else if(this.y > bottomHit-bottomMargin) {
            if(this.x > mySaveBar.x && this.x < mySaveBar.x + mySaveBar.width){
                this.speedY *= -this.bounce;
            }
            else{
                //These 2 lines implement the end of the game!
                myGameArea.stop();
                // alert("You lose!💀💀💀");
                document.querySelector('#final-message').innerText = 'You lose!💀💀💀';
                document.querySelector('.score-p').textContent = `Your score is ${score}.`;
                document.querySelector('.user__score').textContent = score;
                next(".game_play", ".game_finish");
            }
        }
    }
}

function createPaddle(width, height, color, x, y,){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    //This function updates the position of the saveBar when it is controled with the keyboard
    this.newPos = function(){
        if(rightPressed){
            myGameArea.x = false; //if the arrow right key is pressed we disable the mousemove event
            this.x += 3;
            if(this.x + this.width > myGameArea.canvas.width){
                this.x = myGameArea.canvas.width - this.width;
            }
        }
        else if(leftPressed){
            myGameArea.x = false; //if the arrow right left is pressed we disable the mousemove event
            this.x -= 3;
            if(this.x < 0){
                this.x = 0;
            }
        }
    }
}
//we are drawing the bricks that have the parameter "status" == 1
//When we want to hide a brick that it is destroyed, we switch the bricks[i][j].status -> 0 => check collisionDetector() below
function showBricks(rowsNumber, columnsNumber, color){
    let ctx = myGameArea.context;
    for (let i = 0; i < rowsNumber; i++) {
        for(let j = 0; j < columnsNumber; j++){
            if(bricks[i][j].status === 1){
                let brickX = brickOffsetLeft + j*(brickWidth + brickSpacing);
                let brickY = brickOffsetTop + i*(brickHeight + brickSpacing);
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.fillStyle = color;
                ctx.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            }
        }
    }
}

function collisionDetector() {
    for (let i = 0; i < brickRows; i++) {
        for(let j = 0; j < brickColumns; j++){
            let brick = bricks[i][j];
            if(brick.status == 1){
                //If it enters in the "area" of a brick then it means collision
                if(myGameBall.x >= brick.x && myGameBall.x <= (brick.x + brickWidth) && myGameBall.y >= brick.y && myGameBall.y <= (brick.y + brickHeight)){
                    //TODO
                    //Since the ball moves in multiples of 2 pixels, it will only hit exactly the boundaries of the bricks
                    //half of the times. To make sure that we can check this case 100% of the times
                    // we force the boundaries to be a number multiple by 2 by adding or substracting 1 when its an odd number:
                    // if(brick.x%2 == 1){ brick.x++;}
                    // if((brick.x+brickWidth)%2 == 1){ brick.x--;}
                    // if(brick.y%2 == 1){ brick.y++;}
                    // if((brick.y+brickHeight)%2 == 1){ brick.y--;}


                    //We are checking if the collision is horizontal
                    if(myGameBall.x == (brick.x)){ myGameBall.speedX *= -myGameBall.bounce;}
                    if(myGameBall.x == (brick.x+brickWidth)){ myGameBall.speedX *= -myGameBall.bounce;}
                    //Or Vertical
                    if(myGameBall.y == (brick.y)){ myGameBall.speedY *= -myGameBall.bounce;}
                    if(myGameBall.y == (brick.y+brickHeight)){ myGameBall.speedY *= -myGameBall.bounce;}
                    //When a brick is hit, we switch its brick.status -> 0 to make it invisible
                    brick.status = 0;
                }
            }
        }
    }
}
function showScore(){
    let ctx = myGameArea.context;
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#ff9900";
    ctx.fillText("Score: " + score, 8, 20);
}

function checkWin(){
    var count_bricks = 0;
    for (let i = 0; i < brickRows; i++) {
        for(let j = 0; j < brickColumns; j++){
            if(bricks[i][j].status == 0 ){count_bricks++;}
        }
    }
    score = count_bricks;
    showScore();
    if(count_bricks == brickColumns*brickRows){
        myGameArea.stop();
        // alert("You won!!🎉🎉🎉");
        document.querySelector('.score-p').textContent = `Your score is ${score}.`;
        document.querySelector('.user__score').textContent = score;
        next(".game_play", ".game_finish");
    }
}

function updateGameArea(){
    myGameArea.clear();
    //We update the position of the bar with the mouse
    if(myGameArea.x){
        //we just want to move the bar in the horizontal axis
        mySaveBar.x = myGameArea.x - mySaveBar.width/2;
    }
    showBricks(brickRows, brickColumns, "purple");
    //We update the position of the bar with the keyboard
    mySaveBar.newPos();
    mySaveBar.update();
    // We make it bounce when it hits something
    myGameBall.hitObject();
    // collisionDetector();
    myGameBall.newPos();
    myGameBall.update();
    checkWin();
}






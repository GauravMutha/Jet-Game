let canvas = document.getElementById("canvas");
let scoreCanvas=document.getElementById("scoreboard");
let ctx = canvas.getContext("2d");
let Scorectx = scoreCanvas.getContext("2d");
let best=0;
var keystate = {};
let lastTime = 0;
let gameOver = false;
let score=-1;
const SpeedIncrementFactor=0.0001;

const image = new Image();
const planeImage = new Image();
const ast = new Image();
image.src = 'images/space.jpg';
planeImage.src = 'images/hero_sheet.png';
ast.src = 'images/astsheet.png';

const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
const scoCanWidth=scoreCanvas.width=250;
const scoCanHeight=scoreCanvas.height=100;

class Background{
    constructor(){
        this.y1=0;
        this.y2=-722;
        this.gamespeed=5;
    }

    draw(){
        ctx.drawImage(image, 0, this.y1);
        ctx.drawImage(image, 0, this.y2);
    }

    update(){
        this.y1 += this.gamespeed;
        this.y2 += this.gamespeed;
        if (this.y1 > 722) this.y1 = -722 + this.y2;
        if (this.y2 > 722) this.y2 = -722 + this.y1;
        this.gamespeed+=SpeedIncrementFactor;
    }
}

class Enemymaker {
    constructor(ctx, cw, ch,bg) {
        this.bg=bg;
        this.ctx = ctx;
        this.cw = cw;
        this.ch = ch;
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
    }
    update(deltaTime) {
        if (this.enemyTimer > this.enemyInterval) {
            score++;
            this.enemies = this.enemies.filter(element => !element.markedForDeletion);
            this.#addNewEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(element => {
            element.update();
        })
    }
    draw() {
        this.enemies.forEach(element => {
            element.draw(this.ctx);
        })
    }
    #addNewEnemy() {
        this.enemies.push(new Enemy(this))
    }
}

class Enemy {
    constructor(em) {
        this.em = em;
        this.gamewidth = this.em.cw;
        this.gameheight = this.em.ch;
        this.width = 1527 / 4
        this.height = 381.75
        this.dw = this.width / 3;
        this.dh = this.height / 3;
        this.image = ast;
        this.x = Math.floor(Math.random() * 673);
        this.y = 0 - this.dh;
        this.frameX = Math.floor(Math.random() * 3);
        this.speed = em.bg.gamespeed;
        this.markedForDeletion = false;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > this.gameheight){
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.dw, this.dh);
    }
}

class PlaneSprite {
    constructor(){
        this.dx= 0; //change in x position of plane by keyboard controls
        this.dy= 0; //change in y position of plane keyboard controls
        this.speed= 0.5;
        this.frameX=1;
        this.sourceX=196;
        this.sourceY=412;
        this.destWidth=158;
        this.destHeight=98;
        this.destX=CANVAS_WIDTH / 2 - this.destWidth / 2;
        this.destY=CANVAS_HEIGHT - this.destHeight-10;
        this.factor=182;
    }
    
    detectwalls(){
        if (this.destX < 0)
            this.destX = 0;
        if (this.destX + this.destWidth > CANVAS_WIDTH)
            this.destX = CANVAS_WIDTH - this.destWidth;
    }
    update(e_arr){
        this.destX += this.dx;
        this.destY += this.dy;
        e_arr.forEach(e=>{
            let ypos=(this.destY+this.destHeight/2)-(e.y+e.dh/2);
            let xpos=(this.destX+this.destWidth/2)-(e.x+e.dw/2);
            let dis=Math.sqrt(xpos*xpos + ypos*ypos);

            if(dis<=(e.dw/2+this.destHeight/2+5)){
                gameOver=true;
                new Audio('sounds/wrong.mp3').play();
                setTimeout(() => {
                handleGameOver();
                }, 700);
            }
        })
        this.detectwalls();
    }
    

    draw(context){
        context.drawImage(planeImage, this.sourceX+this.factor*this.frameX, this.sourceY, this.destWidth, this.destHeight, this.destX, this.destY, this.destWidth, this.destHeight);
    }
}



const spaceBg=new Background();
const enemymaker = new Enemymaker(ctx, CANVAS_WIDTH, CANVAS_HEIGHT,spaceBg);
const heroPlane = new PlaneSprite();


function displayScore(Scorectx){
    Scorectx.fillStyle="white";
    Scorectx.font='40px Helvetica';
    Scorectx.fillText('Score : ' + score,35,40);
    Scorectx.fillText('Best : '+best,35,80);
}

function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
    Scorectx.clearRect(0,0,scoCanWidth,scoCanHeight);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    spaceBg.draw();
    spaceBg.update();
    
    heroPlane.draw(ctx);
    heroPlane.update(enemymaker.enemies);
    
    enemymaker.draw();
    enemymaker.update(deltaTime);
    
    displayScore(Scorectx);

    if (gameOver == false) requestAnimationFrame(animate);
}

function gameloop() {

    if (keystate['ArrowLeft']) {
        heroPlane.dx -= heroPlane.speed;
        heroPlane.frameX = 0;
    }

    if (keystate['ArrowRight']) {
        heroPlane.dx += heroPlane.speed;
        heroPlane.frameX = 3;
    }
    
    if (!keystate['ArrowLeft'] && !keystate['ArrowRight']) {
        heroPlane.dx = 0;
        heroPlane.frameX = 1;
    }

    setTimeout(gameloop, 10);
}

document.addEventListener("keydown", function(e){
    keystate[e.key] = true;
});
document.addEventListener("keyup", function(e){
    keystate[e.key] = false;
});
gameloop();


function handleStart(){
    document.getElementById("startScreen").style.display="none";
    animate(0);
}
function handleGameOver(){
    document.getElementById("gameOverScreen").style.display="flex";
    Scorectx.clearRect(0,0,scoCanWidth,scoCanHeight);
    best=Math.max(score,best);
}
function handleRestart(){
    document.getElementById("gameOverScreen").style.display="none";
    keystate = {};
    lastTime = 0;
    gameOver = false;
    score=-1;
    enemymaker.enemies=[];
    y1 = 0;
    y2=-722;
    spaceBg.gamespeed=5;
    heroPlane.destX= CANVAS_WIDTH / 2 - heroPlane.destWidth / 2,
    heroPlane.destY= CANVAS_HEIGHT - heroPlane.destHeight-10,
    animate(0);
}

document.addEventListener("keypress",handleStart,{once:true});




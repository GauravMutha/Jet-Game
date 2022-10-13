let canvas = document.getElementById("canvas");
let scoreCanvas=document.getElementById("scoreboard");
let ctx = canvas.getContext("2d");
let Scorectx = scoreCanvas.getContext("2d");

var keystate = {};
let lastTime = 0;
let gameOver = false;
let score=0;

const image = new Image();
const planeImage = new Image();
const ast = new Image();
image.src = 'images/space.jpg';
planeImage.src = 'images/hero_sheet.png';
ast.src = 'images/astsheet.png';

const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
const scoCanWidth=scoreCanvas.width=250;
const scoCanHeight=scoreCanvas.height=50;

const spriteWidth = 158;
const spriteHeight = 98;
const k=182;
const SX=196;
const SY=412;
let y1 = 0, y2 = -722, gamespeed = 5;

const sprite = {
    frameX: 1,
    gameFrame: 0,
    staggerFrame: 10
}

const plane = {
    x: CANVAS_WIDTH / 2 - spriteWidth / 2,
    y: CANVAS_HEIGHT - spriteHeight-10,
    dx: 0,
    dy: 0,
    speed: 0.5
}

class Enemymaker {
    constructor(ctx, cw, ch) {
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
        this.x = Math.floor(Math.random() * 430);
        this.y = 0 - this.dh;
        this.frameX = Math.floor(Math.random() * 3);
        this.speed = 10;
        this.markedForDeletion = false;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > this.gameheight){
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        // ctx.strokeStyle = "yellow";
        // ctx.beginPath();
        // ctx.strokeRect(this.x,this.y,this.dw,this.dh)
        // ctx.arc(this.x + this.dw / 2, this.y + this.dh / 2, this.dw / 2, 0, Math.PI * 2);
        // ctx.stroke();
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.dw, this.dh);
    }
}



const enemymaker = new Enemymaker(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

function displayScore(ctx){
    Scorectx.fillStyle="white";
    Scorectx.font='40px Helvetica';
    Scorectx.fillText('Score : ' + score,35,40);
}

function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    Scorectx.clearRect(0,0,scoCanWidth,scoCanHeight);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(image, 0, y1);
    ctx.drawImage(image, 0, y2);
    
    // ctx.beginPath();
    // ctx.strokeStyle= "yellow";
    // ctx.arc(plane.x + spriteWidth / 2, plane.y + spriteHeight / 2, spriteHeight / 2 +5, 0, Math.PI * 2);
    // ctx.strokeRect(plane.x,plane.y,spriteWidth,spriteHeight)
    // ctx.stroke();
    ctx.drawImage(planeImage, SX+k*sprite.frameX, SY, spriteWidth, spriteHeight, plane.x, plane.y, spriteWidth, spriteHeight);

    enemymaker.update(deltaTime);
    enemymaker.draw();
    newpos(enemymaker.enemies);
    y1 += gamespeed;
    y2 += gamespeed;
    if (y1 > 722) y1 = -722 + y2;
    if (y2 > 722) y2 = -722 + y1;
    displayScore(Scorectx);
    if (gameOver == false) requestAnimationFrame(animate);
}

function kd(e) {
    keystate[e.keyCode] = true;
}
function ku(e) {
    keystate[e.keyCode] = false;
}

function gameloop() {

    if (keystate[37]) {
        plane.dx -= plane.speed;
        sprite.frameX = 0;
    }

    if (keystate[39]) {
        plane.dx += plane.speed;
        sprite.frameX = 3;
    }

    if (!keystate[37] && !keystate[39]) {
        plane.dx = 0;
        sprite.frameX = 1;
    }

    setTimeout(gameloop, 10);
}

function detectwalls() {
    if (plane.x < 0)
        plane.x = 0;
    if (plane.x + spriteWidth > CANVAS_WIDTH)
        plane.x = CANVAS_WIDTH - spriteWidth;
}

function newpos(e_arr) {
    plane.x += plane.dx;
    plane.y += plane.dy;
    e_arr.forEach(e=>{
        let ypos=(plane.y+spriteHeight/2)-(e.y+e.dh/2);
        let xpos=(plane.x+spriteWidth/2)-(e.x+e.dw/2);
        let dis=Math.sqrt(xpos*xpos + ypos*ypos);

        if(dis<=(e.dw/2+spriteHeight/2+5)){
            gameOver=true;
        }
    })
    detectwalls();
}

window.addEventListener("keydown", kd);
window.addEventListener("keyup", ku);

gameloop();
animate(0);



let canvas =document.getElementById("canvas");
let ctx=canvas.getContext("2d");
var keystate={};
let enemies=[];
const image=new Image();
const planeImage = new Image();
const enemyplane = new Image();
image.src='images/space.jpg';
planeImage.src='images/hero_sheet.png';
enemyplane.src='images/enemy_sheet.png';

const CANVAS_WIDTH=canvas.width=800;
const CANVAS_HEIGHT=canvas.height=window.innerHeight;
const spriteWidth=184;
const spriteHeight=184;

let y1=0,y2=-722,gamespeed=5;

const sprite={
     frameX:2,
     frameY:2,
     gameFrame:0,
     staggerFrame:10
}

const plane={
    x:CANVAS_WIDTH/2 - spriteWidth/2,
    y:CANVAS_HEIGHT - spriteHeight,
    dx:0,
    dy:0,                                                                                                               
    speed:0.5
}

class Enemy {
    constructor(gamewidth,gameheight){
        this.gamewidth=gamewidth;
        this.gameheight=gameheight;
        this.width=370.34;
        this.height=396;
        this.image=enemyplane;
        this.x=Math.floor(Math.random()*430);
        this.y=0-this.height/2;
        this.frameX=1;
        this.speed=10;
        this.markedForDeletion=false;
    }

    update(){
        this.y+=this.speed;
        if(this.y>CANVAS_HEIGHT) this.markedForDeletion=true;
    }
    draw(context){
        context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,120,120)
    }
}


function handleEnemies(deltaTime){
    
    if(enemyTimer>enemyInterval+randomInterval){
        enemies=enemies.filter(element => !element.markedForDeletion)
        enemies.push(new Enemy(CANVAS_WIDTH,CANVAS_HEIGHT));
        enemyTimer=0;
    }else{
        enemyTimer+=deltaTime;
    }
    enemies.forEach(enemy=>{
        enemy.draw(ctx);
        enemy.update();
    })
}

let lastTime=0;
let enemyInterval=2000;
let enemyTimer=0;
let randomInterval=Math.random()*1000+500;

function animate(timeStamp){
    let deltaTime=timeStamp-lastTime;
    lastTime=timeStamp;

    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.drawImage(image, 0,y1);
    ctx.drawImage(image, 0,y2);
    ctx.drawImage(planeImage,(sprite.frameX)*spriteWidth,(sprite.frameY)*spriteHeight,spriteWidth,spriteHeight,plane.x,plane.y,spriteWidth,spriteHeight);
    
    handleEnemies(deltaTime);

    newpos();
    y1+=gamespeed;
    y2+=gamespeed;
    if(y1>722) y1=-722+y2;
    if(y2>722) y2=-722+y1;
    requestAnimationFrame(animate);
}

function kd(e){
    keystate[e.keyCode]=true;
}
function ku(e){
        keystate[e.keyCode]=false;
}

function gameloop(){   

    if (keystate[37]){
        plane.dx-=plane.speed;
        sprite.frameX=1;
    }
    
    if (keystate[39]){
        plane.dx+=plane.speed;
        sprite.frameX=3;
    }
    
    if(!keystate[37] && !keystate[39]){
        plane.dx=0;
        sprite.frameX=2;
    }

    setTimeout(gameloop,10);
}

function detectwalls(){
    if(plane.x<0)
        plane.x=0;
    if(plane.x+spriteWidth>CANVAS_WIDTH)
        plane.x=CANVAS_WIDTH-spriteWidth;
}

function newpos(){
    plane.x+=plane.dx;
    plane.y+=plane.dy;

    detectwalls();
}

window.addEventListener("keydown" ,kd);
window.addEventListener("keyup", ku);

gameloop();
animate(0);

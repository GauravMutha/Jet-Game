let canvas =document.getElementById("canvas");
let ctx=canvas.getContext("2d");
var keystate={};
const image=new Image();
image.src='images/space5.jpg';
const planeImage = new Image();
planeImage.src='images/sheet4.png';

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

function animate(){

    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.drawImage(image, 0,y1);
    ctx.drawImage(image, 0,y2);
    ctx.drawImage(planeImage,(sprite.frameX)*spriteWidth,(sprite.frameY)*spriteHeight,spriteWidth,spriteHeight,plane.x,plane.y,spriteWidth,spriteHeight);
    newpos();
    y1+=gamespeed;
    y2+=gamespeed;
    if(y1>722) y1=-722+y2;
    if(y2>722) y2=-722+y1;
`   `
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
        console.log("pressed right");
    }
    
    if (keystate[39]){
        plane.dx+=plane.speed;
        sprite.frameX=3;
        console.log("pressed left");
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
animate();
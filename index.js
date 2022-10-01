let canvas =document.getElementById("canvas");
let ctx=canvas.getContext("2d");

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
    speed:5
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
    if(e.key=='ArrowRight'){
        plane.dx+=plane.speed;
        sprite.frameX=3;
    }
    if(e.key=='ArrowLeft'){
        plane.dx-=plane.speed
        sprite.frameX=1;
    }
}
function ku(e){
    if(e.key=='ArrowLeft' || e.key=='ArrowRight'){
        plane.dx=0;
        sprite.frameX=2;
    }
}

function detectwalls(){
    if(plane.x<-2)
        plane.x=-2;
    if(plane.x+spriteWidth>CANVAS_WIDTH)
        plane.x=CANVAS_WIDTH-spriteWidth
}

function newpos(){
    plane.x+=plane.dx;
    plane.y+=plane.dy;

    detectwalls();
}

document.addEventListener("keydown" ,kd);
document.addEventListener("keyup", ku);

animate();
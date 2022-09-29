let canvas =document.getElementById("canvas");
let ctx=canvas.getContext("2d");

let image=document.getElementById("source");

canvas.width=800;
canvas.height=window.innerHeight;

let y1=0,y2=-722,gamespeed=15;

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image, 0,y1);
    ctx.drawImage(image, 0,y2);
    
    y1+=gamespeed;
    y2+=gamespeed;
    if(y1>722) y1=-722+y2;
    if(y2>722) y2=-722+y1;

    requestAnimationFrame(animate);
}

animate();
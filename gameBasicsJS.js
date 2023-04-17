
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
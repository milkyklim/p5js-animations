// as it says
function referenceGrid(xStep, yStep){
    for (let x = xStep; x < width; x += xStep)
        line(x, 0, x, height);
    for (let y = yStep; y < height; y += yStep)
        line(0, y, width, y);
}

function referenceCenter(){
    line(0, height/2, width, height/2);
    line(width/2, 0, width/2, height);
}
export {Point};

class Point {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    drawingPoints(arrContext, color = 'black') {
        for(let i = 0; i < arrContext.length; ++i){
            arrContext[i].beginPath();
            arrContext[i].arc(this.x, this.y, this.radius, 0, 360);
            arrContext[i].closePath();
            arrContext[i].fillStyle = color;
            arrContext[i].fill();
        }
    }
}
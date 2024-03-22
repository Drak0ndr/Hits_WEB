import { ctx, ctx2, ctx3 } from "./clustering_main.js";
export {Point};

class Point {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    drawingPoints() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 360);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, 360);
        ctx2.closePath();
        ctx2.fillStyle = 'black';
        ctx2.fill();

        ctx3.beginPath();
        ctx3.arc(this.x, this.y, this.radius, 0, 360);
        ctx3.closePath();
        ctx3.fillStyle = 'black';
        ctx3.fill();
    }

    kMeansDrawing(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 360);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    dbscanDrawing(color) {
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0,360);
        ctx2.closePath();
        ctx2.fillStyle = color;
        ctx2.fill();
    }

    hierarchicalDriwing(color) {
        ctx3.beginPath();
        ctx3.arc(this.x, this.y, this.radius, 0, 360);
        ctx3.closePath();
        ctx3.fillStyle = color;
        ctx3.fill();
    }
}
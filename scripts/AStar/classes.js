import { fieldPixelsSize } from "./aStarBasic.js";

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Cell {
    constructor(x = null, y = null, cellSize = null, number = null) {
        this.vertex1 = new Point(x, y);
        this.vertex2 = new Point(x + cellSize, y);
        this.vertex3 = new Point(x, y + cellSize);
        this.vertex4 = new Point(x + cellSize, y + cellSize);
        this.cellNumber = number;
        this.posX = (number - 1) % fieldPixelsSize;
        this.posY = parseInt((number - 1) / fieldPixelsSize);
        this.parent = null;
        this.distanceToStart = 0;
        this.distanceToFinish = 0;
        this.sumDistances = 0;
    }
}
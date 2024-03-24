export class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export class Cell {
    constructor(x, y, cellSize) {
        this.vertex1 = new Point(Math.round(x), Math.round(y));
        this.vertex2 = new Point(Math.round(x) + Math.round(cellSize), Math.round(y));
        this.vertex3 = new Point(Math.round(x), Math.round(y) + Math.round(cellSize));
        this.vertex4 = new Point(Math.round(x) + Math.round(cellSize), Math.round(y) + Math.round(cellSize));
    }
}
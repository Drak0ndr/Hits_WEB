export class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export class Cell {
    constructor(x, y, cellSize) {
        this.vertex1 = new Point(x, y);
        this.vertex2 = new Point(x + cellSize, y);
        this.vertex3 = new Point(x, y + cellSize);
        this.vertex4 = new Point(x + cellSize, y + cellSize);
    }
}
export class Draw {
    constructor(ctx, canvas, pixel) {
        this.canvas = canvas
        this.ctx = ctx
        this.pixel = pixel
    }

    drawLine(x1, y1, x2, y2, color = 'gray') {
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = 1
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }

    drawCell(x, y, w, h) {
        this.ctx.fillStyle = 'blue'
        this.ctx.strokeStyle = 'blue'
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = 1
        this.ctx.rect(x, y, w, h)
        this.ctx.fill()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawGrid() {
        const w = this.canvas.width
        const h = this.canvas.height
        const p = w / this.pixel
    
        const xStep = w / p
        const yStep = h / p
    
        for (let x = 0; x < w; x += xStep) {
            this.drawLine(x, 0, x, h)
        }
    
        for (let y = 0; y < h; y += yStep) {
            this.drawLine(0, y, w, y)
        }
    }
}


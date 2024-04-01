export class Draw {
    constructor(canvas) {
        this.canvas = canvas
        this.canvas.width = canvas.offsetWidth
        this.canvas.height = canvas.offsetHeight
        this.ctx = canvas.getContext('2d')
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawNode(graph, ind, posX, posY, w, h, predictInd) {
        this.ctx.strokeStyle = 'black'
        if (ind == predictInd) {
            this.ctx.strokeStyle = 'blue'
        }
        console.log(graph, ind)
        this.ctx.beginPath()
        this.ctx.strokeRect(posX, posY, w, h);
        if (graph[ind].numArg > 0) {
            this.ctx.fillText("Arg " + graph[ind].numArg + "<=" + graph[ind].condition, posX + w / 4, posY + h / 2)
        } else {
            this.ctx.fillText(graph[ind].data[0][graph[ind].data[0].length - 1], posX + w * 0.4, posY + h / 2)
        }

        if (graph[ind].left > 0) {
            this.drawLine(posX, posY + h, posX - 150 + w, posY + 100, 'green', 1)
            this.drawNode(graph, graph[ind].left, posX - 150, posY + 100, w, h, predictInd)
        }
        if (graph[ind].right > 0) {
            this.drawLine(posX + w, posY + h, posX + 150, posY + 100, 'red', 1)
            this.drawNode(graph, graph[ind].right, posX + 150, posY + 100, w, h, predictInd)
        }
    }

    drawGraph(graph, predictInd) {
        this.drawNode(graph, 0, this.canvas.width / 2 - 50, 10, 100, 50, predictInd)
    }

    drawLine(x1, y1, x2, y2, color = 'gray', width = 0.4) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = width
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }
}
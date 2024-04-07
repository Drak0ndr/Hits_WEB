export class Draw {
    constructor(canvas) {
        this.canvas = canvas
        this.canvas.width = canvas.offsetWidth
        this.canvas.height = canvas.offsetHeight
        this.vertex = []
        this.ctx = canvas.getContext('2d')
        this.canvas.addEventListener('click', (e) => {
            this.addVertex(e.offsetX, e.offsetY)
        })
    }

    addVertex(x, y) {
        console.log(x, y, this.vertex)
        this.ctx.beginPath()
        this.ctx.arc(x, y, 5, 0, Math.PI * 2)
        this.ctx.fill()
        this.vertex.push([x, y])
    }

    drawLine(x1, y1, x2, y2, color = 'gray', width = 0.1) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = width
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }

    drawPaths() {
        for (let i = 0; i < this.vertex.length; i++) {
            for (let j = i; j < this.vertex.length; j++) {
                this.drawLine(this.vertex[i][0], this.vertex[i][1], this.vertex[j][0], this.vertex[j][1])
            }
        }
    }

    drawAns(path) {
        for (let i = 0; i < path.length - 1; i++) {
            this.drawLine(this.vertex[path[i]][0], this.vertex[path[i]][1], this.vertex[path[i + 1]][0], this.vertex[path[i + 1]][1], '#f9b234', 1)
        }
    }

    buildGraph() {
        let graph = {}
        for (let i = 0; i < this.vertex.length; i++) {
            graph[i] = []
            for (let j = 0; j < this.vertex.length; j++) {
                let dist = ((this.vertex[i][0] - this.vertex[j][0]) ** 2 + (this.vertex[i][1] - this.vertex[j][1]) ** 2) ** 0.5
                if (dist > 0) {
                    graph[i].push([j, dist, 0.1])
                }
            }
        }
        return graph
    }

    clear() {
        this.vertex = []
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
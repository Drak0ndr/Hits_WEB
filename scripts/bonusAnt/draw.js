export class Draw {
    constructor(canvas, pixel) {
        this.canvas = canvas
        this.pixel = pixel
        this.ctx = canvas.getContext('2d', { willReadFrequently: true })
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawLine(x1, y1, x2, y2, color = 'black', width = 0.3) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = width
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }

    drawGrid() {
        const w = this.canvas.width
        const h = this.canvas.height
        const p = w / this.pixel
    
        const xStep = this.pixel
        const yStep = this.pixel
    
        for (let x = 0; x < w; x += xStep) {
            this.drawLine(x, 0, x, h)
        }
    
        for (let y = 0; y < h; y += yStep) {
            this.drawLine(0, y, w, y)
        }
    }

    drawField(matrix) {
        this.ctx.beginPath()
        this.clear()
        this.ctx.lineJoin = 'miter'
        this.ctx.lineWidth = 1
        for (let y = 0; y < matrix.length; y++) {
            for(let x = 0; x < matrix[y].length; x++) {
                this.ctx.beginPath()
                if (matrix[y][x].build == 1) {
                    this.ctx.fillStyle = 'red'
                    this.ctx.strokeStyle = 'red'
                }
                else if (matrix[y][x].build == 2) {
                    this.ctx.fillStyle = 'green'
                    this.ctx.strokeStyle = 'green'
                }
                else if (matrix[y][x].build == 3) {
                    this.ctx.fillStyle = 'gray'
                    this.ctx.strokeStyle = 'gray'
                } else {
                    this.ctx.fillStyle = '#c79030'
                    this.ctx.strokeStyle = '#c79030'
                }

                this.ctx.rect(x * this.pixel, y * this.pixel, this.pixel, this.pixel)
                this.ctx.fill()
            }
        }

        this.drawGrid()
    }

    drawAnts(ants) {
        this.ctx.beginPath()
        ants.forEach(item => {
            this.ctx.beginPath()
            let y = item.posY
            let x = item.posX
            if (item.isEat == false) {
                this.ctx.fillStyle = 'Crimson'
                this.ctx.strokeStyle = 'Crimson'
            } else {
                this.ctx.fillStyle = 'mediumSeaGreen'
                this.ctx.strokeStyle = 'mediumSeaGreen'
            }

            this.ctx.rect(x * this.pixel, y * this.pixel, this.pixel, this.pixel)
            this.ctx.fill()
        })
    }

    drawFeromons(matrix) {
        this.ctx.beginPath()
        let color = 'rgba(255,0,0,0.1)'
        this.ctx.fillStyle = color
        this.ctx.strokeStyle = color
        for(let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                this.ctx.beginPath()
                let opacity = matrix[y][x].feromons[0]
                if (opacity > 0.6) {
                    opacity = 0.6
                }
                color = `rgba(255,0,0,${opacity})`
                this.ctx.fillStyle = color
                this.ctx.strokeStyle = color
                if (matrix[y][x].build != 3) {
                    this.ctx.rect(x * this.pixel, y * this.pixel, this.pixel, this.pixel)
                    this.ctx.fill()
                }
                
            }
        }

        this.ctx.beginPath()
        color = 'rgba(0,150,0,0.1)'
        this.ctx.fillStyle = color
        this.ctx.strokeStyle = color
        for(let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                this.ctx.beginPath()
                let opacity = matrix[y][x].feromons[1]
                if (opacity > 0.6) {
                    opacity = 0.6
                }
                color = `rgba(0,150,0,${opacity})`
                this.ctx.fillStyle = color
                this.ctx.strokeStyle = color
                if (matrix[y][x].build != 3) {
                    this.ctx.rect(x * this.pixel, y * this.pixel, this.pixel, this.pixel)
                    this.ctx.fill()
                }
                
            }
        }
    }
}
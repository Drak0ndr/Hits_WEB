import { Ant } from "./ant.js";

export class Colony {
    constructor(numAnts, posY, posX, matrix) {
        this.ants = []
        this.posY = posY
        this.posX = posX
        this.matrix = matrix
        this.bestPath = []
        this.isFindPath = false
        this.bestPrice = 0
        for(let i = 0; i < numAnts; i++) {
            let ant = new Ant(posY, posX, 0)
            this.ants.push(ant)
        }
        console.log(this.ants)
    }

    nextIteration() {
        let delts = []
        this.ants.forEach(item => {
            let temp = item.nextStep(this.matrix)
            if (temp[5].length > 0 && this.isFindPath == false) {
                this.bestPath = temp[5]
                this.isFindPath = true
                this.bestPrice = temp[6]
            }
            if (temp[5].length > 0 && temp[6] > this.bestPrice) {
                this.bestPath = temp[5]
                this.bestPrice = temp[6]
            }
            delts.push(temp)
        })
        let p = 0.01
        for(let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[0].length; x++) {
                if (this.matrix[y][x].feromons[0] > 10000) {
                    this.matrix[y][x].feromons[0] = 10000
                }
                if (this.matrix[y][x].feromons[0] < 0.000000001) {
                    this.matrix[y][x].feromons[0] = 0.000000001
                }
                if (this.matrix[y][x].feromons[1] > 10000) {
                    this.matrix[y][x].feromons[1] = 10000
                }
                if (this.matrix[y][x].feromons[1] < 0.000000001) {
                    this.matrix[y][x].feromons[1] = 0.000000001
                }

                this.matrix[y][x].feromons[0] *= (1-p)
                this.matrix[y][x].feromons[1] *= (1-p)
            }
        }
        let dy = [-1,-1,0,1,1,1,0,-1]
        let dx = [0,1,1,1,0,-1,-1,-1]
        for(let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[0].length; x++) {
                for (let j = 0; j < dy.length; j++) {
                    let newY = y + dy[j]
                    let newX = x + dx[j]
                    if (newY > 0 && newY < this.matrix.length && newX > 0 && newX < this.matrix[0].length) {
                        if (this.matrix[y][x].feromons[0] < 10) {
                            this.matrix[newY][newX].feromons[0] += this.matrix[y][x].feromons[0]/50000
                        }
                        if (this.matrix[y][x].feromons[1] < 10) {
                            this.matrix[newY][newX].feromons[1] += this.matrix[y][x].feromons[1]/50000
                        }
                        
                    }
                }
            }
        }
        delts.forEach(item => {
            if (item[3] === false) {
                this.matrix[item[0]][item[1]].feromons[0] += item[2]
            } else {
                this.matrix[item[0]][item[1]].feromons[1] += item[2] * item[4]
            }
            
        })
        // console.log(this.ants)
        if (this.isFindPath) {
            console.log(this.bestPath.length, this.bestPrice)
            let baseInd = 0
            let eatInd = this.bestPath.length - 1
            if (this.matrix[this.bestPath[0][0]][this.bestPath[0][1]].build === 2) {
                baseInd = this.bestPath.length-1
                eatInd = 0
            }
            this.bestPath.forEach((item, index) => {
                this.matrix[item[0]][item[1]].feromons[0]+=0.0001 * this.ants.length * 0.95 ** Math.abs(index - baseInd)
                this.matrix[item[0]][item[1]].feromons[1]+=0.0001 * this.ants.length * 0.95 ** Math.abs(index - eatInd)
            })
        }
    }
}
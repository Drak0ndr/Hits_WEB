import { Ant } from "./ant.js";

export class Colony {
    constructor(numAnts, posY, posX, matrix) {
        this.ants = []
        this.posY = posY
        this.posX = posX
        this.matrix = matrix
        this.bestPath = []
        this.isFindPath = false
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
            }
            if (temp[5].length > 0 && temp[5].length < this.bestPath.length) {
                this.bestPath = temp[5]
            }
            delts.push(temp)
        })
        let p = 0.008
        for(let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[0].length; x++) {
                if (this.matrix[y][x].feromons[0] > 10000) {
                    this.matrix[y][x].feromons[0] = 10000
                }
                if (this.matrix[y][x].feromons[0] < 0.00001) {
                    this.matrix[y][x].feromons[0] = 0.00001
                }
                if (this.matrix[y][x].feromons[1] > 10000) {
                    this.matrix[y][x].feromons[1] = 10000
                }
                if (this.matrix[y][x].feromons[1] < 0.00001) {
                    this.matrix[y][x].feromons[1] = 0.00001
                }
                this.matrix[y][x].feromons[0] *= (1-p)
                this.matrix[y][x].feromons[1] *= (1-p)
            }
        }
        delts.forEach(item => {
            if (item[3] == false) {
                this.matrix[item[0]][item[1]].feromons[0] += item[2]
            } else {
                this.matrix[item[0]][item[1]].feromons[1] += item[2] * item[4]
            }
            
        })
        // console.log(this.ants)
        if (this.isFindPath) {
            console.log(this.bestPath.length)
            this.bestPath.forEach(item => {
                this.matrix[item[0]][item[1]].feromons[0]+=0.00001 * this.ants.length
                this.matrix[item[0]][item[1]].feromons[1]+=0.00001 * this.ants.length
            })
        }
    }
}
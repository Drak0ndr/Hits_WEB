import { Ant } from "./ant.js";

export class Colony {
    constructor(numAnts, posY, posX, matrix) {
        this.ants = []
        this.posY = posY
        this.posX = posX
        this.matrix = matrix
        for(let i = 0; i < numAnts; i++) {
            let ant = new Ant(posY, posX, 0)
            this.ants.push(ant)
        }
        console.log(this.ants)
    }

    nextIteration() {
        let delts = []
        this.ants.forEach(item => {
            delts.push(item.nextStep(this.matrix))
        })
        let p = 0.01
        for(let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[0].length; x++) {
                if (this.matrix[y][x].feromons[0] > 10000) {
                    this.matrix[y][x].feromons[0] = 10000
                }
                if (this.matrix[y][x].feromons[1] > 10000) {
                    this.matrix[y][x].feromons[1] = 10000
                }
                this.matrix[y][x].feromons[0] *= (1-p)
                this.matrix[y][x].feromons[1] *= (1-p)
            }
        }
        delts.forEach(item => {
            if (item[3] == false) {
                this.matrix[item[0]][item[1]].feromons[0] += item[2]
            } else {
                this.matrix[item[0]][item[1]].feromons[1] += item[2]
            }
            
        })
        console.log(this.ants, this.matrix)
    }
}
export class Ant{
    constructor(posY, posX, dir) {
        this.posY = posY
        this.posX = posX
        this.isEat = false
        this.eatValue = 1
        this.coef = 1
        this.dir = dir
        this.path = [[posY,posX]]
    }
    genPaths(matrix, dirs) {
        let path = []
        let sm = 0
        let alfa = 1.3
        let beta = 0
        dirs.forEach(item => {
            let y = item[0]
            let x = item[1]
            let tempY = this.posY + y
            let tempX = this.posX + x
            let len = ((tempX - this.posX)**2 + (tempY - this.posY)**2)**0.5
            if (tempY >= 0 && tempY < matrix.length && tempX >= 0 && tempX < matrix[0].length) {
                if (matrix[tempY][tempX].build != 3) {
                    if (this.isEat == true) {
                        path.push([tempY, tempX, matrix[tempY][tempX].feromons[0]**alfa * (1/len)**beta])
                        sm+=matrix[tempY][tempX].feromons[0]**alfa * (1/len)**beta
                    } else {
                        path.push([tempY, tempX, matrix[tempY][tempX].feromons[1]**alfa * (1/len)**beta])
                        sm+=matrix[tempY][tempX].feromons[1]**alfa * (1/len)**beta
                    }
                }


            }
        })

        return [path, sm]
    }
    getP(matrix) {
        let path = []
        let sm = 0
        // for(let y = -1; y <=1; y++) {
        //     for (let x = -1; x <=1; x++) {
        //         let tempY = this.posY + y
        //         let tempX = this.posX + x
        //         let len = ((tempX - this.posX)**2 + (tempY - this.posY)**2)**0.5
        //         if (tempY >= 0 && tempY < matrix.length && tempX >= 0 && tempX < matrix[0].length) {
        //             if (matrix[tempY][tempX].build != 3) {
        //                 if (this.isEat == true) {
        //                     path.push([tempY, tempX, matrix[tempY][tempX].feromons[0] * len])
        //                     sm+=matrix[tempY][tempX].feromons[0] * len
        //                 } else {
        //                     path.push([tempY, tempX, matrix[tempY][tempX].feromons[1] * len])
        //                     sm+=matrix[tempY][tempX].feromons[1] * len
        //                 }
        //             }


        //         }
        //     }
        // }
        let vectorUp = [[-1,-1],[-1,0],[-1,1]]
        let vectorUpRight = [[-1,0], [-1,1], [0,1]]
        let vectorRight = [[-1,1], [0,1], [1,1]]
        let vectorDownRight = [[0,1], [1,1], [1,0]]
        let vectorDown = [[1,-1], [1,0], [1,1]]
        let vectorDownLeft = [[1,-1],[1,0],[0,-1]]
        let vectorLeft = [[1,-1], [0,-1], [-1, -1]]
        let vectorUpLeft = [[0,-1], [-1,-1], [-1,0]]
        if (this.dir === 0) {
            let temp = this.genPaths(matrix, vectorUp)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 45) {
            let temp = this.genPaths(matrix, vectorUpRight)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 90) {
            let temp = this.genPaths(matrix, vectorRight)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 135) {
            let temp = this.genPaths(matrix, vectorDownRight)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 180) {
            let temp = this.genPaths(matrix, vectorDown)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 225) {
            let temp = this.genPaths(matrix, vectorDownLeft)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 270) {
            let temp = this.genPaths(matrix, vectorLeft)
            path = temp[0]
            sm = temp[1]
        }
        if (this.dir === 315) {
            let temp = this.genPaths(matrix, vectorUpLeft)
            path = temp[0]
            sm = temp[1]
        }
        if (path.length === 0) {
            this.dir+=180
            if (this.dir >= 360) {
                this.dir-=360
            }
        }
        let probabilitys = []
        path.forEach(item => {
            probabilitys.push([item[0],item[1], item[2]/sm])
        })
        let arr = []
        let oldProb = 0
        probabilitys.forEach(item => {
            arr.push([item[0], item[1], oldProb, oldProb + item[2]])
            oldProb = oldProb + item[2]
        })

        return arr
    }
    nextStep(matrix) {
        let vers = this.getP(matrix)
        let random = Math.random()
        let dist = 0
        vers.forEach(item => {
            if (random >= item[2] && random <= item[3]) {
                dist = ((this.posY - item[0])**2 + (this.posX - item[1])**2)**0.5
                if ((item[0] - this.posY) === -1 && (item[1] - this.posX === 0)) {
                    this.dir = 0
                }
                if ((item[0] - this.posY) === -1 && (item[1] - this.posX === 1)) {
                    this.dir = 45
                }
                if ((item[0] - this.posY) === 0 && (item[1] - this.posX === 1)) {
                    this.dir = 90
                }
                if ((item[0] - this.posY) === 1 && (item[1] - this.posX === 1)) {
                    this.dir = 135
                }
                if ((item[0] - this.posY) === 1 && (item[1] - this.posX === 0)) {
                    this.dir = 180
                }
                if ((item[0] - this.posY) === 1 && (item[1] - this.posX === -1)) {
                    this.dir = 225
                }
                if ((item[0] - this.posY) === 0 && (item[1] - this.posX === -1)) {
                    this.dir = 270
                }
                if ((item[0] - this.posY) === -1 && (item[1] - this.posX === -1)) {
                    this.dir = 315
                }
                
                this.posY = item[0]
                this.posX = item[1]
                this.path.push([this.posY, this.posX])
                return
            }
        })
        let bestPath = []
        if (matrix[this.posY][this.posX].build === 2 && this.isEat === false) {
            this.isEat = true
            bestPath =  [...this.path]
            this.path = [[this.posY, this.posX]]
            this.eatValue = matrix[this.posY][this.posX].eatValue
            this.coef = 1
            this.dir += 180
            if (this.dir >= 360) {
                this.dir-=360
            }
        } else if (matrix[this.posY][this.posX].build === 1 && this.isEat === true) {
            this.isEat = false
            // console.log(this.path.length)
            bestPath =  [...this.path]
            this.path = [[this.posY, this.posX]]
            this.coef = 1
            this.dir += 180
            if (this.dir >= 360) {
                this.dir-=360
            }
        } else if (matrix[this.posY][this.posX].build === 1 || matrix[this.posY][this.posX].build === 2) {
            this.dir += 180
            if (this.dir >= 360) {
                this.dir-=360
            }
        }

        let price = 0
        for(let i = 0; i < bestPath.length-1; i++) {
            price+= ((bestPath[i][0] - bestPath[i+1][0])**2 + (bestPath[i][1] - bestPath[i+1][1])**2)**0.5
        }
        this.coef*=0.95
        if (dist == 0) {
            dist = 99
        }
        // console.log(vers, random)
        // if (bestPath.length > 0) {
        //     console.log(bestPath)
        // }
        
        return [this.posY, this.posX, 0.2 * this.coef, this.isEat, this.eatValue, bestPath, 1/price * this.eatValue]
    }
}


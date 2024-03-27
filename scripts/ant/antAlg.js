export class AntAlg {
    constructor(graph) {
        this.graph = graph
    }
    getP(start, blackList = []) {
        let sm = 0
        let arr = []
        for (let i = 0; i < this.graph[start].length; i++) {
            if (blackList.indexOf(this.graph[start][i][0]) < 0) {
                sm += this.graph[start][i][2] * 1 / this.graph[start][i][1]
            }
        }
        // console.log(sm)
        for (let i = 0; i < this.graph[start].length; i++) {
            if (blackList.indexOf(this.graph[start][i][0]) < 0) {
                arr.push([this.graph[start][i][0], this.graph[start][i][2] * 1 / this.graph[start][i][1] / sm])
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) {
                arr[i] = [arr[i][0], 0, arr[i][1]]
            } else {
                arr[i] = [arr[i][0], arr[i - 1][2], arr[i][1] + arr[i - 1][2]]
            }

        }
        return arr
    }
    iteration(start) {
        let path = []
        let pos = start
        let c = 0
        let blackList = []
        while (blackList.length < Object.keys(this.graph).length - 1) {
            let line = this.getP(pos, blackList)
            let random = Math.random()
            for (let i = 0; i < line.length; i++) {
                if (random >= line[i][1] && random <= line[i][2]) {
                    path.push(pos)
                    blackList.push(pos)
                    pos = line[i][0]
                    break
                }
            }

            c++
            if (c > 1000) {
                break
            }
            // console.log(blackList.length, Object.keys(this.graph).length, line, random, blackList, pos)
        }
        path.push(pos)
        path.push(path[0])
        // console.log(path, pos)
        return path
    }

    start(n) {
        let bestPath = []
        let bestCost = 10 ** 10
        for(let iterCount = 0; iterCount < n; iterCount++) {
            let data = []
            let keys = Object.keys(this.graph)
            for (let i = 0; i < keys.length; i++) {
                data.push(this.iteration(+keys[i]))
            }
            for (let item in this.graph) {
                for (let i = 0; i < this.graph[item].length; i++) {
                    this.graph[item][i][2] *= 0.6
                }
            }
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                let cost = 0
                for (let j = 0; j < data[i].length - 1; j++) {
                    for (let k = 0; k < this.graph[data[i][j]].length; k++) {
                        if (this.graph[data[i][j]][k][0] == data[i][j + 1]) {
                            cost += this.graph[data[i][j]][k][1]
                        }
                    }
                }
                let delta = 100 / cost
                console.log(cost, data[i], delta)
    
                for (let j = 0; j < data[i].length - 1; j++) {
                    for (let k = 0; k < this.graph[data[i][j]].length; k++) {
                        if (this.graph[data[i][j]][k][0] == data[i][j + 1]) {
                            this.graph[data[i][j]][k][2] += delta
                        }
                    }
                }
                if (cost < bestCost) {
                    bestCost = cost
                    bestPath = data[i]
                }
            }
        }

        console.log(bestCost, bestPath)
        console.log(this.graph)
        return [bestCost, bestPath]
    }
}
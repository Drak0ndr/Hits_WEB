export class DecisionTree {
    constructor() {
        this.tree = {
            0: {
                numArg: 0,
                condition: 0,
                data: [],
                left: -1,
                right: -1,
                entropy: 0
            }
        }
        this.nodeCount = 1
    }
    calculateEntropy(p1, p2) {
        if (p1 == 0 || p2 == 0) {
            return 0
        } else {
            return -(p1 * Math.log2(p1) + p2 * Math.log2(p2))
        }
    }
    calculateNodeEntropy(node) {
        let onep = []
        let twop = []
        onep.push(node.data[0])
        for (let i = 1; i < node.data.length; i++) {
            if (node.data[i][node.data[i].length - 1] == onep[onep.length - 1][onep[onep.length - 1].length - 1]) {
                onep.push(node.data[i])
            } else {
                twop.push(node.data[i])
            }
        }
        // console.log(onep, twop)
        let p1 = onep.length / (onep.length + twop.length)
        let p2 = twop.length / (onep.length + twop.length)
        node.entropy = this.calculateEntropy(p1, p2)
    }
    sortData(numArg, value, data) {
        let left = []
        let right = []
        for (let item of data) {
            if (+item[numArg] <= +value) {
                left.push(item)
            } else {
                right.push(item)
            }
        }
        return [left, right]
    }
    train(data, k) {
        this.tree[0].data = data
        this.calculateNodeEntropy(this.tree[0])
        let queue = [0]
        while (queue.length > 0) {
            let ind = queue.shift()
            let temp_left_node = {
                numArg: 0,
                condition: 0,
                data: [],
                left: -1,
                right: -1,
                entropy: 0
            }
            let temp_right_node = {
                numArg: 0,
                condition: 0,
                data: [],
                left: -1,
                right: -1,
                entropy: 0
            }
            let bestNumArg = -1
            let bestValue = -1
            let bt = 0
            for (let item of this.tree[ind].data) {
                for (let j = 1; j < item.length - 1; j++) {
                    let temp = this.sortData(j, item[j], this.tree[ind].data)

                    temp_left_node.data = temp[0]
                    temp_right_node.data = temp[1]
                    this.calculateNodeEntropy(temp_left_node)
                    this.calculateNodeEntropy(temp_right_node)
                    let gain = this.tree[ind].entropy - temp[0].length / (temp[0].length + temp[1].length) * temp_left_node.entropy - temp[1].length / (temp[0].length + temp[1].length) * temp_right_node.entropy
                    let balance = (1 - Math.abs(temp[0].length / (temp[0].length + temp[1].length) * temp_left_node.entropy- temp[1].length / (temp[0].length + temp[1].length) * temp_right_node.entropy))*k
                    // console.log(gain, balance)
                    if (gain + balance > bt) {
                        bt = gain + balance
                        bestNumArg = j
                        bestValue = item[j]
                        console.log(j, item, temp, temp_left_node.entropy, temp_right_node.entropy, gain, balance)
                    }


                }
            }
            let temp = this.sortData(bestNumArg, bestValue, this.tree[ind].data)
            temp_left_node.data = temp[0]
            temp_right_node.data = temp[1]
            this.calculateNodeEntropy(temp_left_node)
            this.calculateNodeEntropy(temp_right_node)
            this.tree[ind].numArg = bestNumArg
            this.tree[ind].condition = bestValue
            this.tree[this.nodeCount] = temp_left_node
            this.tree[ind].left = this.nodeCount
            if (temp_left_node.entropy > 0) {
                queue.push(this.nodeCount)
            }
            this.nodeCount++
            this.tree[this.nodeCount] = temp_right_node
            this.tree[ind].right = this.nodeCount
            if (temp_right_node.entropy > 0) {
                queue.push(this.nodeCount)
            }
            this.nodeCount++
        }

        console.log(this.tree)
    }
    predict(item) {
        let isEnd = false
        let posId = 0
        let path = [0]
        while (!isEnd) {
            if (+this.tree[posId].numArg == 0) {
                isEnd = true
                break
            }
            if (+item[+this.tree[posId].numArg] <= +this.tree[posId].condition) {
                posId = this.tree[posId].left
                path.push(posId)
            } else {
                posId = this.tree[posId].right
                path.push(posId)
            }

        }
        this.tree[posId].data.push(item)
        console.log(this.tree)
        return [this.tree[posId].data[0][this.tree[posId].data[0].length-1], posId, path]
    }
}
const clearBtn = document.querySelector('.clear')
const pixelBtn = document.querySelector('.pixelation')
const recognizeBtn = document.querySelector('.recognize')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const ansSpan = document.querySelector('.ans span')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const pixel = canvas.width / 28
let isMouseDown = false

function drawLine(x1, y1, x2, y2, color = 'gray') {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineJoin = 'miter'
    ctx.lineWidth = 1
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function drawCell(x, y, w, h) {
    ctx.fillStyle = 'blue'
    ctx.strokeStyle = 'blue'
    ctx.lineJoin = 'miter'
    ctx.lineWidth = 1
    ctx.rect(x, y, w, h)
    ctx.fill()
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawGrid() {
    const w = canvas.width
    const h = canvas.height
    const p = w / pixel

    const xStep = w / p
    const yStep = h / p

    for (let x = 0; x < w; x += xStep) {
        drawLine(x, 0, x, h)
    }

    for (let y = 0; y < h; y += yStep) {
        drawLine(0, y, w, y)
    }
}

function pixelization(draw = false) {
    const w = canvas.width
    const h = canvas.height
    const p = w / pixel

    const xStep = w / p
    const yStep = h / p

    let arr = []
    let drawMatrix = []

    for (let y = 0; y < h; y += yStep) {
        for (let x = 0; x < w; x += xStep) {
            const data = ctx.getImageData(x, y, xStep, yStep)
            let emptyPixelsCount = 0
            for (let i = 0; i < data.data.length; i += 10) {
                const isEmpy = data.data[i] == 0

                if (!isEmpy) {
                    emptyPixelsCount += 1
                }
            }
            // console.log(data.data)
            // console.log(x, y, emptyPixelsCount)
            if (emptyPixelsCount > 1 && draw) {
                drawMatrix.push([x, y, xStep, yStep])
            }

            arr.push(emptyPixelsCount > 1 ? 1 : 0)
        }
    }
    // console.log(drawMatrix)
    if (draw) {
        clear()
        drawGrid()

        for (i in drawMatrix) {
            drawCell(drawMatrix[i][0], drawMatrix[i][1], drawMatrix[i][2], drawMatrix[i][3])
        }
    }
    return arr
}

// drawGrid()

clearBtn.addEventListener('click', e => {
    clear()
    // drawGrid()
})

pixelBtn.addEventListener('click', e => {
    let temp = pixelization(true)
    let ans = prompt('какая это цифра?')
    let outData = []
    for (let i = 0; i < 10; i++) {
        if (i == ans) {
            outData.push(1)
        }
        else {
            outData.push(0)
        }
    }
    train_data.push({ input: temp, output: outData })
    console.log(temp, outData)
})

recognizeBtn.addEventListener('click', e => {
    let data = pixelization(true)
    console.log(data)
    let ans = neuralNetwork(data)
    let bt = 0
    let btInd = 0
    ans.forEach((item, ind) => {
        if (item > bt) {
            bt = item
            btInd = ind
        }
    })
    ansSpan.innerHTML = btInd
    console.log(ans)
})

canvas.addEventListener('mousedown', e => {
    isMouseDown = true
    ctx.beginPath()
})

canvas.addEventListener('mouseup', e => {
    isMouseDown = false

})

canvas.addEventListener('mousemove', e => {
    if (isMouseDown) {
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'red'
        ctx.lineWidth = pixel
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.offsetX, e.offsetY, pixel / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.offsetX, e.offsetY)
    }
})
console.log(canvas.offsetWidth, canvas.offsetHeight)
console.log(canvas, pixel)

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}

function derSigmoid(x) {
    return sigmoid(x) * (1 - sigmoid(x))
}

let train_data = []
let check_data = []
fetch('../scripts/mnistdb.json')
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        train_data = data
    })
// fetch('../scripts/traindb.json')
//     .then(response => {
//         return response.json()
//     })
//     .then(data => {
//         console.log(data)
//         data.forEach(item => {
//             train_data.push(item)
//         })
//         console.log(train_data.length)
//     })
fetch('../scripts/checkdb.json')
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        check_data = data
    })
let neuralData = {
    inputSlise: [],
    inputSliseWeights: [],
    firstHideSlise: [],
    firstHideSliseSm: [],
    firstHideSliseBias: [],
    firstHideSliseWeights: [],
    secondHideSlise: [],
    secondHideSliseSm: [],
    secondHideSliseBias: [],
    secondHideSliseWeights: [],
    outputSlise: [],
    outputSliseSm: [],
    outputSliseBias: []
}
for (let i = 0; i < 28 * 28; i++) {
    let temp = []
    for (let j = 0; j < 100; j++) {
        temp.push(getRandom(-1, 1))
    }
    neuralData.inputSliseWeights.push(temp)
}
for (let i = 0; i < 100; i++) {
    neuralData.firstHideSliseBias.push(0)
    neuralData.secondHideSliseBias.push(0)
    neuralData.firstHideSlise.push(0)
    neuralData.secondHideSlise.push(0)
}
for (let i = 0; i < 100; i++) {
    let temp = []
    for (let j = 0; j < 100; j++) {
        temp.push(getRandom(-1, 1))
    }
    neuralData.firstHideSliseWeights.push(temp)
}
for (let i = 0; i < 100; i++) {
    let temp = []
    for (let j = 0; j < 10; j++) {
        temp.push(getRandom(-1, 1))
    }
    neuralData.secondHideSliseWeights.push(temp)
}
for (let i = 0; i < 10; i++) {
    neuralData.outputSliseBias.push(0)
    neuralData.outputSlise.push(0)
    neuralData.outputSliseSm.push(0)
}
function neuralNetwork(data) {
    for (let i = 0; i < neuralData.firstHideSlise.length; i++) {
        neuralData.firstHideSlise[i] = 0
        neuralData.firstHideSliseSm[i] = 0
        neuralData.secondHideSliseSm[i] = 0
        neuralData.secondHideSlise[i] = 0
    }
    for (let i = 0; i < neuralData.outputSlise.length; i++) {
        neuralData.outputSlise[i] = 0
        neuralData.outputSliseSm[i] = 0
    }
    // console.log(data)
    neuralData.inputSlise = data
    for (let i = 0; i < neuralData.inputSliseWeights.length; i++) {
        for (let j = 0; j < neuralData.inputSliseWeights[i].length; j++) {
            neuralData.firstHideSliseSm[j] += neuralData.inputSlise[i] * neuralData.inputSliseWeights[i][j]
        }
        // console.log(i, neuralData.inputSlise[i], neuralData.inputSliseWeights[i])
    }
    for (let j = 0; j < neuralData.firstHideSlise.length; j++) {
        neuralData.firstHideSliseSm[j] += neuralData.firstHideSliseBias[j]
        neuralData.firstHideSlise[j] = sigmoid(neuralData.firstHideSliseSm[j])
    }
    for (let i = 0; i < neuralData.firstHideSliseWeights.length; i++) {
        for (let j = 0; j < neuralData.firstHideSliseWeights[i].length; j++) {
            neuralData.secondHideSliseSm[j] += neuralData.firstHideSlise[i] * neuralData.firstHideSliseWeights[i][j]
        }
    }
    for (let j = 0; j < neuralData.secondHideSlise.length; j++) {
        neuralData.secondHideSliseSm[j] += neuralData.secondHideSliseBias[j]
        neuralData.secondHideSlise[j] = sigmoid(neuralData.secondHideSliseSm[j])
    }
    for (let i = 0; i < neuralData.secondHideSliseWeights.length; i++) {
        for (let j = 0; j < neuralData.secondHideSliseWeights[i].length; j++) {
            neuralData.outputSliseSm[j] += neuralData.secondHideSlise[i] * neuralData.secondHideSliseWeights[i][j]
        }
    }
    for (let j = 0; j < neuralData.outputSlise.length; j++) {
        neuralData.outputSliseSm[j] += neuralData.outputSliseBias[j]
        neuralData.outputSlise[j] = sigmoid(neuralData.outputSliseSm[j])
    }
    // console.log(neuralData)
    return neuralData.outputSlise
}

function train(count) {
    let trainSpeed = 0.3
    for (let i = 0; i < count; i++) {
        let TA = 0
        train_data.forEach((item, ind) => {
            let ans = neuralNetwork(item.input)
            let bestNum = 0
            let bestInd = 0
            ans.forEach((item, ind) => {
                if (item > bestNum) {
                    bestNum = item
                    bestInd = ind
                }
            })
            bestNum = 0
            let bestIndAns = 0
            item.output.forEach((item, ind) => {
                if (item > bestNum) {
                    bestNum = item
                    bestIndAns = ind
                }
            })
            if (bestInd == bestIndAns) {
                TA++
            }
            let errors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let j = 0; j < ans.length; j++) {
                errors[j] += (item.output[j] - ans[j]) * derSigmoid(neuralData.outputSliseSm[j])
            }
            // console.log(item.output, ans)
            for (let j = 0; j < neuralData.secondHideSliseWeights.length; j++) {
                for (let p = 0; p < neuralData.secondHideSliseWeights[j].length; p++) {
                    neuralData.secondHideSliseWeights[j][p] += errors[p] * neuralData.secondHideSlise[j] * trainSpeed
                }
            }
            for (let j = 0; j < neuralData.outputSliseBias.length; j++) {
                neuralData.outputSliseBias[j] += trainSpeed * errors[j]
            }
            let errors2_in = []
            for (let j = 0; j < neuralData.secondHideSlise.length; j++) {
                errors2_in.push(0)
            }
            for (let j = 0; j < neuralData.secondHideSliseWeights.length; j++) {
                for (let p = 0; p < neuralData.secondHideSliseWeights[j].length; p++) {
                    errors2_in[j] += errors[p] * neuralData.secondHideSliseWeights[j][p]
                }
            }
            let errors2 = Array(errors2_in.length)
            for (let j = 0; j < errors2_in.length; j++) {
                errors2[j] = errors2_in[j] * derSigmoid(neuralData.secondHideSliseSm[j])
            }
            // console.log(errors2, errors2_in, errors)
            for (let j = 0; j < neuralData.firstHideSliseWeights.length; j++) {
                for (let p = 0; p < neuralData.firstHideSliseWeights[j].length; p++) {
                    neuralData.firstHideSliseWeights[j][p] += errors2[p] * neuralData.firstHideSlise[j] * trainSpeed
                }
            }
            for (let j = 0; j < neuralData.secondHideSliseBias.length; j++) {
                neuralData.secondHideSliseBias[j] += trainSpeed * errors2[j]
            }
            let errors3_in = []
            for (let j = 0; j < neuralData.firstHideSlise.length; j++) {
                errors3_in.push(0)
            }
            for (let j = 0; j < neuralData.firstHideSliseWeights.length; j++) {
                for (let p = 0; p < neuralData.firstHideSliseWeights[j].length; p++) {
                    errors3_in[j] += errors2[p] * neuralData.firstHideSliseWeights[j][p]
                }
            }
            let errors3 = Array(errors3_in.length)
            for (let j = 0; j < errors3_in.length; j++) {
                errors3[j] = errors3_in[j] * derSigmoid(neuralData.firstHideSliseSm[j])
            }
            // console.log(errors3_in, errors3)
            for (let j = 0; j < neuralData.inputSliseWeights.length; j++) {
                for (let p = 0; p < neuralData.inputSliseWeights[j].length; p++) {
                    neuralData.inputSliseWeights[j][p] += errors3[p] * neuralData.inputSlise[j] * trainSpeed
                }
            }
            for (let j = 0; j < neuralData.firstHideSliseBias.length; j++) {
                neuralData.firstHideSliseBias[j] += trainSpeed * errors3[j]
            }
        })
        console.log(i, TA / train_data.length)
        // n = 31
        // console.log(train_data[n].output, neuralNetwork(train_data[n]))
    }
    console.log(neuralData)
    // train_data.forEach(item => {
    //     console.log(item.output, neuralNetwork(item.input))
    // })
    let TA = 0
    check_data.forEach((item, ind) => {
        let ans = neuralNetwork(item.input)
        let bestNum = 0
        let bestInd = 0
        console.log(item.output, ans)
        ans.forEach((item, ind) => {
            if (item > bestNum) {
                bestNum = item
                bestInd = ind
            }
        })
        bestNum = 0
        let bestIndAns = 0
        item.output.forEach((item, ind) => {
            if (item > bestNum) {
                bestNum = item
                bestIndAns = ind
            }
        })
        if (bestInd == bestIndAns) {
            TA++
        }
    })

    console.log(TA / check_data.length)
}
setTimeout(() => {
    train(5)

}, 1000)
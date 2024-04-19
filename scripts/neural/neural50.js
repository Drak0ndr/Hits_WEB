const clearBtn = document.querySelector('.clear')
const pixelBtn = document.querySelector('.pixelation')
const recognizeBtn = document.querySelector('.recognize')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const ansSpan = document.querySelector('.ans span')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const pixel = canvas.width / 50
let isMouseDown = false
let isDraw = false
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
    isDraw = false
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
    if (isDraw) {
        let data = pixelization(true)
        
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
        // console.log(ans)
    } else {
        ansSpan.innerHTML = 'Пустота'
    }

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
        isDraw = true
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


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}

function derSigmoid(x) {
    return sigmoid(x) * (1 - sigmoid(x))
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
let train_data = []
let check_data = []
// fetch('../scripts/neural/fixmnist.json')
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
// fetch('../scripts/neural/mnist0.json')
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
// fetch('../scripts/neural/mnist1.json')
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
// fetch('../scripts/neural/mnist2.json')
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
// fetch('../scripts/neural/mnist3.json')
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
// fetch('../scripts/neural/mnist4.json')
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
// fetch('../scripts/neural/mnist5.json')
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
// fetch('../scripts/neural/mnist6.json')
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
// fetch('../scripts/neural/mnist7.json')
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
// fetch('../scripts/neural/mnist8.json')
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
// fetch('../scripts/neural/mnist9.json')
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
for (let i = 0; i < 50*50; i++) {
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
fetch('../scripts/neural/neuralData50.json')
    .then(response => {
        return response.json()
    })
    .then(data => {
        // console.log(data)
        neuralData = data
    })
function centralize(data) {
    let left = 0
    let right = 0
    let flagLeft = false
    let flagRight = false
    let size = data.length ** 0.5
    let ans = Array(data.length).fill(0)
    while (flagLeft == false) {
        for (let i = 0; i < size; i++) {
            if (data[i * size + left] > 0) {
                flagLeft = true
                break
            }
        }
        if (flagLeft == false) {
            left++
        }
    }
    while (flagRight == false) {
        for (let i = 0; i < size; i++) {
            if (data[i * size + size - 1 - right] > 0) {
                flagRight = true
                break
            }
        }
        if (flagRight == false) {
            right++
        }
    }
    let delta = Math.floor(Math.abs(right - left) / 2)
    if (right > left) {
        for (let y = 0; y < size; y++) {
            for (let x = delta; x < size; x++) {
                ans[y * size + x] = data[y * size + x - delta]
            }
        }
    }
    if (left > right) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size - delta; x++) {
                ans[y * size + x] = data[y * size + x + delta]
            }
        }
    }
    if (left === right) {
        ans = data
    }
    let top = 0
    let bottom = 0
    let flagTop = false
    let flagBottom = false
    while (flagTop === false) {
        for (let i = 0; i < size; i++) {
            if (data[top * size + i] > 0) {
                flagTop = true
                break
            }
        }
        if (flagTop === false) {
            top++
        }
    }
    while (flagBottom == false) {
        for (let i = 0; i < size; i++) {
            if (data[(size - 1 - bottom) * size + i] > 0) {
                flagBottom = true
                break
            }
        }
        if (flagBottom === false) {
            bottom++
        }
    }

    delta = Math.floor(Math.abs(top - bottom) / 2)
    if (top < bottom) {
        let temp = Array(delta * size).fill(0)
        ans = temp.concat(ans)
        while (ans.length > size * size) {
            ans.pop()
        }
    }
    if (bottom < top) {
        let temp = Array(delta * size).fill(0)
        ans = ans.concat(temp)
        while (ans.length > size * size) {
            ans.shift()
        }
    }
    // console.log(data)
    // console.log(left, right, top, bottom)
    // console.log(ans)
    return ans
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
    neuralData.inputSlise = centralize(data)
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
    console.log(centralize([0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
    let trainSpeed = 0.03
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
            if (bestInd === bestIndAns) {
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
    // let TA = 0
    // check_data.forEach((item, ind) => {
    //     let ans = neuralNetwork(item.input)
    //     let bestNum = 0
    //     let bestInd = 0
    //     console.log(item.output, ans)
    //     ans.forEach((item, ind) => {
    //         if (item > bestNum) {
    //             bestNum = item
    //             bestInd = ind
    //         }
    //     })
    //     bestNum = 0
    //     let bestIndAns = 0
    //     item.output.forEach((item, ind) => {
    //         if (item > bestNum) {
    //             bestNum = item
    //             bestIndAns = ind
    //         }
    //     })
    //     if (bestInd == bestIndAns) {
    //         TA++
    //     }
    // })

    // console.log(TA / check_data.length)
}
// setTimeout(() => {
//     train_data = shuffle(train_data)
//     console.log(train_data.length)
//     train(20)

// }, 15000)

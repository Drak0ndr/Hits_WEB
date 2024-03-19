const clearBtn = document.querySelector('.clear')
const pixelBtn = document.querySelector('.pixelation')
const recognizeBtn = document.querySelector('.recognize')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const pixel = canvas.width / 50
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

function calculate(draw = false) {
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
    console.log(arr)
    return arr
}

// drawGrid()

clearBtn.addEventListener('click', e => {
    clear()
    // drawGrid()
})

pixelBtn.addEventListener('click', e => {
    calculate(true)
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
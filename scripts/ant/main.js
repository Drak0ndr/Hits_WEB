import { Draw } from "./draw.js";
import { AntAlg } from "./antAlg.js";
const canvas = document.querySelector('canvas')
const clearBtn = document.querySelector('.clear')
const startBtn = document.querySelector('.start')
const ansSpan = document.querySelector('.ans')
let drawCanvas = new Draw(canvas)

startBtn.addEventListener('click', (e) => {
    drawCanvas.clearPaths()
    drawCanvas.drawPaths()
    ansSpan.style.color = 'whitesmoke'
    let graph = drawCanvas.buildGraph()
    let ant = new AntAlg(graph)
    let count = 0

    for (let item in graph){
        count+=1
    }
    
    let bestCost = Infinity
    let bestPath = []
    animate(ant, bestPath, bestCost, drawCanvas, ansSpan, count, 2)
})

clearBtn.addEventListener('click', (e) => {
    drawCanvas.clear()
})

function animate(ant,bestPath, bestCost, drawCanvas, ansSpan, count, numIterations) {
    if (count < 0) {
        drawCanvas.clearPaths()
        drawCanvas.drawPaths()
        drawCanvas.drawAns(bestPath)
        ansSpan.innerHTML = bestCost.toFixed(2)
        ansSpan.style.color = 'green'
        return
    }
    
    let data = ant.start(numIterations)
    if (data[0] < bestCost) {
        bestPath = data[1]
        bestCost = data[0]
    }
    drawCanvas.clearPaths()
    drawCanvas.drawPaths()
    drawCanvas.drawAns(data[1])
    ansSpan.innerHTML = data[0].toFixed(2)
    setTimeout(() => {
        animate(ant,bestPath, bestCost, drawCanvas, ansSpan, count-1, numIterations)
    },10)
    
}
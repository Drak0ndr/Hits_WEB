import { Draw } from "./draw.js";
import { AntAlg } from "./antAlg.js";
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const startBtn = document.querySelector('.start')
const ansSpan = document.querySelector('.ans')
let drawCanvas = new Draw(canvas)

startBtn.addEventListener('click', (e) => {
    console.log(drawCanvas)
    drawCanvas.drawPaths()
    let graph = drawCanvas.buildGraph()
    let ant = new AntAlg(graph)
    console.log(ant.getP(0, []))
    console.log(graph)
    let data = ant.start(20)
    drawCanvas.drawAns(data[1])
    ansSpan.innerHTML = data[0].toFixed(2)
})
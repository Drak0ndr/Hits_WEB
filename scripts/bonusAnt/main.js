import { Draw } from "./draw.js";
import { Colony } from "./colony.js";
const canvas = document.querySelector('canvas')
const pixel = 15
const inputColony = document.querySelector('#colony')
const inputEat = document.querySelector('#eat')
const inputWall = document.querySelector('#wall')
const inputRemWall = document.querySelector('#remwall')
const btnArrow = document.querySelector('.arrow')
const setting = document.querySelector('nav')
let matrix = []
canvas.width = Math.floor(canvas.offsetWidth / pixel) * pixel
canvas.height = Math.floor(canvas.offsetHeight / pixel) * pixel

let matrixWidth = canvas.width / pixel
let matrixHeight = canvas.height / pixel
for (let y =0; y < matrixHeight; y++) {
    let temp = []
    for (let x = 0; x < matrixWidth; x++) {
        temp.push({build:0, isColony:0, isEat:0, feromons: [0.01,0.01], ants:[]})
    }
    matrix.push(temp)
}
// console.log(matrix)
let draw = new Draw(canvas, pixel)
draw.drawGrid()
let isColony = false
let colony
canvas.addEventListener('click', e => {
    let x = e.offsetX
    let y = e.offsetY
    let matrixX = Math.floor(x / pixel)
    let matrixY = Math.floor(y / pixel)
    if (inputColony.checked && isColony == false) {
        matrix[matrixY][matrixX].build = 1
        matrix[matrixY][matrixX].feromons[0] = 10**10
        colony = new Colony(500, matrixY, matrixX, matrix)
        isColony = true
    } else if (inputColony.checked) {
        alert("Можно поставить только 1 колонию")
    }
    if (inputEat.checked) {
        matrix[matrixY][matrixX].build = 2
        matrix[matrixY][matrixX].feromons[1] = 10**10
    }
    if (inputWall.checked) {
        matrix[matrixY][matrixX].build = 3
    }
    if (inputRemWall.checked) {
        matrix[matrixY][matrixX].build = 0
    }
    // colony.matrix = matrix
    // colony.nextIteration()
    draw.drawField(matrix)
    draw.drawAnts(colony.ants)
    // console.log(matrixY,matrixX)
})
function animate() {
    if (isColony) {
        colony.nextIteration()
        draw.drawField(colony.matrix)
        draw.drawFeromons(colony.matrix)
        draw.drawAnts(colony.ants)

    }
    // console.log(isColony)
    requestAnimationFrame(animate)
    
    
}
requestAnimationFrame(animate)

btnArrow.addEventListener('click', e => {
    setting.classList.toggle('hide')
})
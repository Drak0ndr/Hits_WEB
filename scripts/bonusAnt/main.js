import { Draw } from "./draw.js";
import { Colony } from "./colony.js";
const canvas = document.querySelector('canvas')
const pixel = 15
const inputColony = document.querySelector('#colony')
const inputEat = document.querySelector('#eat')
const inputEatValue = document.querySelector('#eatValue')
const inputWall = document.querySelector('#wall')
const inputRemWall = document.querySelector('#remwall')
const btnArrow = document.querySelector('.arrow')
const setting = document.querySelector('nav')
const inputRange = document.querySelector('#rangeAnts')
const spanRange = document.querySelector('#rangeValue')
const inputSpeed = document.querySelector('#speed')
let numAnts = inputRange.value
let matrix = []
canvas.width = Math.floor(canvas.offsetWidth / pixel) * pixel
canvas.height = Math.floor(canvas.offsetHeight / pixel) * pixel

let matrixWidth = canvas.width / pixel
let matrixHeight = canvas.height / pixel
for (let y =0; y < matrixHeight; y++) {
    let temp = []
    for (let x = 0; x < matrixWidth; x++) {
        temp.push({build:0,eatValue:0, isColony:0, isEat:0, feromons: [0.01,0.01], ants:[]})
    }
    matrix.push(temp)
}
inputRange.addEventListener('mousemove', e => {
    spanRange.innerHTML = inputRange.value
    numAnts = inputRange.value
})
// console.log(matrix)
let draw = new Draw(canvas, pixel)
draw.drawGrid()
let isColony = false
let colony
canvas.addEventListener('click', e => {
    let x = e.offsetX
    let y = e.offsetY
    console.log(numAnts)
    let matrixX = Math.floor(x / pixel)
    let matrixY = Math.floor(y / pixel)
    if (inputColony.checked && isColony == false) {
        matrix[matrixY][matrixX].build = 1
        matrix[matrixY][matrixX].feromons[0] = 10**10
        colony = new Colony(numAnts, matrixY, matrixX, matrix)
        isColony = true
    } else if (inputColony.checked) {
        alert("Можно поставить только 1 колонию")
    }
    if (inputEat.checked) {
        matrix[matrixY][matrixX].build = 2
        matrix[matrixY][matrixX].feromons[1] = 10**10
        matrix[matrixY][matrixX].eatValue = inputEatValue.value
        colony.isFindPath = false
    }
    if (inputWall.checked) {
        matrix[matrixY][matrixX].build = 3
        colony.isFindPath = false
    }
    if (inputRemWall.checked) {
        matrix[matrixY][matrixX].build = 0
        colony.isFindPath = false
    }
    // colony.matrix = matrix
    // colony.nextIteration()
    draw.drawField(matrix)
    draw.drawAnts(colony.ants)
    // console.log(matrixY,matrixX)
})
function animate() {
    if (isColony) {
        for (let i = 0; i < inputSpeed.value; i++) {
            colony.nextIteration()

        }

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
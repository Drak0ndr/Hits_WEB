import { Draw } from "./draw.js"
import { Colony } from "./colony.js"
import {generateMaze} from "./maze.js"
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
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
const buttonMaze = document.querySelector('.genMaze')
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
let draw = new Draw(canvas, pixel)
draw.drawGrid()
let isColony = false
let isMouseDown = false
let isBuilding = false
let colony 
inputRange.addEventListener('mousemove', e => {
    spanRange.innerHTML = inputRange.value
    numAnts = inputRange.value
})

buttonMaze.addEventListener('click', e => {
    let width = matrixWidth
    let height = matrixHeight
    if (width % 2 === 0) {
        width+=1
    }
    if (height % 2 === 0) {
        height+=1
    }
    let maze = generateMaze(width, height)
    if (isColony) {
        colony.isFindPath = false
    }
    for(let y =0; y < matrixHeight; y++) {
        for(let x = 0; x < matrixWidth; x++) {
            if (matrix[y][x].build === 0 && maze[y][x] === 'wall') {
                matrix[y][x].build = 3
            }
            if (matrix[y][x].build === 3 && maze[y][x] === 'space') {
                matrix[y][x].build = 0
            }
        }
    }

    draw.drawField(matrix)
    
})
// console.log(matrix)

canvas.addEventListener('mousedown', e => {
    isMouseDown = true
    isBuilding = true
})
canvas.addEventListener('mouseup', e => {
    isMouseDown = false
    isBuilding = false
})

canvas.addEventListener('mousemove', e => {
    let x = e.offsetX
    let y = e.offsetY
    let matrixX = Math.floor(x / pixel)
    let matrixY = Math.floor(y / pixel)
    
    if (isMouseDown) {
        if (inputWall.checked && matrix[matrixY][matrixX].build === 0) {
            isBuilding = true
            ctx.beginPath()
            ctx.fillStyle = 'gray'
            ctx.strokeStyle = 'gray'
            matrix[matrixY][matrixX].build = 3
            if (isColony) {
                colony.isFindPath = false
            }
            ctx.rect(matrixX * pixel, matrixY * pixel, pixel, pixel)
            ctx.fill()
            // draw.drawField(matrix)
            
        }
        if (inputRemWall.checked && matrix[matrixY][matrixX].build !== 1) {
            isBuilding = true
            ctx.beginPath()
            ctx.fillStyle = '#c79030'
            ctx.strokeStyle = '#c79030'
            matrix[matrixY][matrixX].build = 0
            if (isColony) {
                colony.isFindPath = false
            }
            ctx.rect(matrixX * pixel, matrixY * pixel, pixel, pixel)
            ctx.fill()
            // draw.drawField(matrix)
        }
    }
})
canvas.addEventListener('click', e => {
    let x = e.offsetX
    let y = e.offsetY
    // console.log(numAnts)
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
        if (isColony) {
            colony.isFindPath = false
        }
    }
    if (inputWall.checked) {
        matrix[matrixY][matrixX].build = 3
        if (isColony) {
            colony.isFindPath = false
        }
    }
    if (inputRemWall.checked && matrix[matrixY][matrixX].build !== 1) {
        matrix[matrixY][matrixX].build = 0
        if (isColony) {
            colony.isFindPath = false
        }
    }
    // colony.matrix = matrix
    // colony.nextIteration()
    draw.drawField(matrix)
    if (isColony) {
        draw.drawAnts(colony.ants)
    }

    // console.log(matrixY,matrixX)
})
function animate() {
    if (isColony && isBuilding === false) {
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
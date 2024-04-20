import { Cell } from "./classes.js";
import {generateMaze, drawMaze} from './maze.js';
import { aStar } from "./aStarAlgorithm.js";

const canvas = document.getElementById('astar_canvas');
canvas.height = document.querySelector('#astar_canvas').clientHeight;
canvas.width = document.querySelector('#astar_canvas').clientWidth;
export const ctx = canvas.getContext('2d');

export let fieldPixelsSize = 50;
export let cellSize = canvas.width / fieldPixelsSize;
export let markedCells = []; // закрашенные ячейки
export let startСoordinates = [];
export let finishCoordinates = [];
export let arrCoordinates = fillCoordinates(); //координаты всех ячеек (левый верхний угол)
export let currButton = 1;

let mapMaze = []; // карта лабиринта

drawGrid();

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.lineJoin = 'miter';

    (fieldPixelsSize < 30) ? ctx.lineWidth = 1 : (fieldPixelsSize < 70) ? ctx.lineWidth = 0.8 : (fieldPixelsSize < 100) ?
    ctx.lineWidth = 0.7 : (fieldPixelsSize < 170) ? ctx.lineWidth = 0.4 : (fieldPixelsSize < 200) ? ctx.lineWidth = 0.3 :
    ctx.lineWidth = 0.2;  
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGrid() {
    ctx.reset();
    let pixel = canvas.width / fieldPixelsSize;
    const w = canvas.width;
    const h = canvas.height;
    const p = w / pixel;

    const xStep = w / p;
    const yStep = h / p;

    for (let x = 0; x < w; x += xStep) {
        drawLine(x, 0, x, h);
    }

    for (let y = 0; y < h; y += yStep) {
        drawLine(0, y, w, y);
    }
}

function fillCoordinates(){
    let arr = [];
    let size = canvas.width / fieldPixelsSize;
    let x = 0;
    let y = 0;

    for(let i = 0; i < fieldPixelsSize; ++i){
        let col = [];

        for(let j = 0; j < fieldPixelsSize; ++j){
            col.push(new Cell(x, y, size, i * fieldPixelsSize + j + 1));
            x += size;
        }

        arr.push(col);
        y += size;
        x = 0;
    }

    return arr;
}

function containsObject(obj, list) {
    for (let i = 0; i < list.length; ++i) {
        if(Math.round(list[i].vertex1.x) === Math.round(obj.vertex1.x) && Math.round(list[i].vertex1.y) === Math.round(obj.vertex1.y) &&
        Math.round(list[i].vertex2.x) === Math.round(obj.vertex2.x) && Math.round(list[i].vertex2.y) === Math.round(obj.vertex2.y) &&
        Math.round(list[i].vertex3.x) === Math.round(obj.vertex3.x) && Math.round(list[i].vertex3.y) === Math.round(obj.vertex3.y) &&
        Math.round(list[i].vertex4.x) === Math.round(obj.vertex4.x) && Math.round(list[i].vertex4.y) === Math.round(obj.vertex4.y))

            return i;
    }

    return Infinity;
}

function arrValidation(arr){
    let newArr = [];
    
    for(let i = 0; i < arr.length - 1; ++i){
        let col = [];

        for(let j = 0; j < arr.length - 1; ++j){
            col.push(arr[i][j]);
        }  

        newArr.push(col);
    }

    return newArr;
}

function resettingVariables(){
    startСoordinates = [];
    finishCoordinates = [];
    markedCells = [];
    mapMaze = [];
    currButton = 1;
    document.getElementById("add_start").disabled = false;
    document.getElementById("add_finish").disabled = false;
}

canvas.addEventListener('click', function(e){
    let x = Math.floor(e.offsetX / cellSize) * cellSize;
    let y = Math.floor(e.offsetY / cellSize) * cellSize;
    let posX = Math.floor(e.offsetY / cellSize);
	let posY = Math.floor(e.offsetX / cellSize);
    let cell = new Cell(x, y, cellSize, (fieldPixelsSize * posX) + posY + 1);
 
    if (currButton === 1){
        if(containsObject(cell, markedCells) === Infinity){
            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, cellSize, cellSize);
            markedCells.push(cell);

        }else{
            ctx.fillStyle = '#AC92EC';
            (fieldPixelsSize < 30) ? ctx.lineWidth = 1 : (fieldPixelsSize < 70) ? ctx.lineWidth = 0.8 : (fieldPixelsSize < 100) ?
            ctx.lineWidth = 0.7 : (fieldPixelsSize < 170) ? ctx.lineWidth = 0.4 : (fieldPixelsSize < 200) ? ctx.lineWidth = 0.3 :
            ctx.lineWidth = 0.2; 

            ctx.fillRect(x - ctx.lineWidth, y - ctx.lineWidth, cellSize + ctx.lineWidth * 2, cellSize + ctx.lineWidth * 2);

            ctx.beginPath();

            (fieldPixelsSize < 30) ? ctx.lineWidth = 0.8 : (fieldPixelsSize < 70) ? ctx.lineWidth = 0.6 : (fieldPixelsSize < 100) ?
            ctx.lineWidth = 0.5 : (fieldPixelsSize < 170) ? ctx.lineWidth = 0.2 : (fieldPixelsSize < 200) ? ctx.lineWidth = 0.1 :
            ctx.lineWidth = 0.05; 

            ctx.strokeStyle = 'black'; 

            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y); 
            ctx.lineTo(x + cellSize, y + cellSize); 
            ctx.lineTo(x, y + cellSize);

            ctx.closePath(); 
            ctx.stroke();
       
            markedCells.splice(containsObject(cell, markedCells), 1);
            
            if(containsObject(cell, startСoordinates) !== Infinity){
                startСoordinates = [];
                document.getElementById("add_start").disabled = false;
            }

            if(containsObject(cell, finishCoordinates) !== Infinity){
                finishCoordinates = [];
                document.getElementById("add_finish").disabled = false;
            }
        }
    }

    if (currButton === 2){
        if(containsObject(cell, markedCells) === Infinity){
            ctx.fillStyle = '#ff0d00';
            ctx.fillRect(x, y, cellSize, cellSize);
            markedCells.push(cell);
            startСoordinates.push(cell);
            currButton = 1;
        }
    }

    if (currButton === 3){
        if(containsObject(cell, markedCells) === Infinity){
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(x, y, cellSize, cellSize);
            markedCells.push(cell);
            finishCoordinates.push(cell);
            currButton = 1;
        }
    }
});

document.getElementById('field_range').addEventListener('change', () => {
    isRightField(document.getElementById('field_range'));
    fieldPixelsSize = parseInt(document.getElementById('field_range').value);
    cellSize = canvas.width / fieldPixelsSize;
    drawGrid();
    arrCoordinates = fillCoordinates();  
    resettingVariables();
    document.getElementById('field_range_descr').textContent = "Размер поля: " + fieldPixelsSize + "x" + fieldPixelsSize;
});

document.getElementById('animation_range').addEventListener('change', () => {
    isRightAnimation(document.getElementById('animation_range'));
    document.getElementById('animation_range_descr').textContent = "Cкорость анимации: " + 
    document.getElementById('animation_range').value + "%";
});

document.getElementById('remove_field').addEventListener('click', () => {
    document.getElementById("ansver").textContent = "Минимальная длина пути: ";
    ctx.reset();
    drawGrid();
    resettingVariables();
});

document.getElementById('generate_maze').addEventListener('click',  () => {
    document.getElementById("ansver").textContent = "Минимальная длина пути: ";
    ctx.reset();
    drawGrid();  
    resettingVariables();

    if(fieldPixelsSize % 2 === 0){
        mapMaze = generateMaze(fieldPixelsSize + 1, fieldPixelsSize + 1);
        mapMaze = arrValidation(mapMaze);
     
    }else{
        mapMaze = generateMaze(fieldPixelsSize, fieldPixelsSize);
    }
   
    drawMaze(mapMaze, arrCoordinates, cellSize);  
});

document.getElementById('start').addEventListener('click',  () => {
    document.getElementById("ansver").textContent = "Минимальная длина пути: ";

    if(startСoordinates.length === 0 && finishCoordinates.length === 0){
		alert("Установите старт и финиш и попробуйте заново");
        return 0;
        
	}else if(finishCoordinates.length === 0){
		alert("Установите финиш и попробуйте заново");
        return 0;

	}else if(startСoordinates.length === 0){
		alert("Установите старт и попробуйте заново");
        return 0;

    }else{
        if(currButton === 1){
            for(let i = 0; i < markedCells.length; ++i){
                if(finishCoordinates[0].cellNumber === markedCells[i].cellNumber ){
                    markedCells.splice(i, 1);
                 }
            }
        
            for(let i = 0; i < markedCells.length; ++i){
                if(startСoordinates[0].cellNumber === markedCells[i].cellNumber){
                    markedCells.splice(i, 1);
                 }
            }
    
            currButton = 4;
    
            aStar();
        } 
    }       
});

document.getElementById('add_start').addEventListener('click', () =>{
    if(currButton === 3){
        document.getElementById("add_finish").disabled = false;
    }

    currButton = 2;
    document.getElementById("add_start").disabled = true;
});

document.getElementById('add_finish').addEventListener('click', () =>{
    if(currButton === 2){
        document.getElementById("add_start").disabled = false;
    }

    currButton = 3;
    document.getElementById("add_finish").disabled = true;
});

function isRightField(obj){
    if (obj.value > 250){
        obj.value = 250;
    }   
    if (obj.value < 3){
        obj.value = 3;
    } 
}

function isRightAnimation(obj){
    if (obj.value > 100){
        obj.value = 100;
    }  

    if (obj.value < 1){
        obj.value = 1;
    }  

    document.getElementById('animation_range_descr').textContent = "Cкорость анимации: " + 
    document.getElementById('animation_range').value + "%";
}











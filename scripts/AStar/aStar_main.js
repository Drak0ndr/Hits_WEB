import { Cell } from "./classes.js";
import {generateMaze, drawMaze} from './maze.js';

import { aStar } from "./astar_algorithm.js";
export let fieldPixelsSize = 50;
let currButton = 0;
const canvas = document.getElementById('astar_canvas');
export const ctx = canvas.getContext('2d');
canvas.height = document.querySelector('#astar_canvas').clientHeight;
canvas.width = document.querySelector('#astar_canvas').clientHeight;
export let cellSize = canvas.width / fieldPixelsSize;
export let markedCells = [];
export let startСoordinates = [];
export let finishCoordinates = [];
export let arrCoordinates;
arrCoordinates = fillCoordinates();
let mapMaze = [];

drawGrid();
/* console.log(arrCoordinates); */
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
/* console.log(arrCoordinates); */
function containsObject(obj, list) {
    for (let i = 0; i < list.length; ++i) {
        if(Math.round(list[i].vertex1.x) == Math.round(obj.vertex1.x) && Math.round(list[i].vertex1.y) == Math.round(obj.vertex1.y) &&
        Math.round(list[i].vertex2.x) == Math.round(obj.vertex2.x) && Math.round(list[i].vertex2.y) == Math.round(obj.vertex2.y) &&
        Math.round(list[i].vertex3.x) == Math.round(obj.vertex3.x) && Math.round(list[i].vertex3.y) == Math.round(obj.vertex3.y) &&
        Math.round(list[i].vertex4.x) == Math.round(obj.vertex4.x) && Math.round(list[i].vertex4.y) == Math.round(obj.vertex4.y))

            return i;
    }

    return Infinity;
}

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

document.getElementById('field_range').addEventListener('change', () => {
    fieldPixelsSize = parseInt(document.getElementById('field_range').value);
    cellSize = canvas.width / fieldPixelsSize;
    markedCells = [];
    drawGrid();
    document.getElementById("add_start").disabled = false;
    document.getElementById("add_finish").disabled = false;
    arrCoordinates = fillCoordinates();  
    mapMaze = [];
    startСoordinates = [];
    finishCoordinates = [];
    /* console.log(arrCoordinates); */
});


canvas.addEventListener('click', function(e){
    let x = Math.floor(e.offsetX / cellSize) * cellSize;
    let y = Math.floor(e.offsetY / cellSize) * cellSize;
    let posX = Math.floor(e.offsetY / cellSize);
	let posY = Math.floor(e.offsetX / cellSize);
    let cell = new Cell(x, y, cellSize, (fieldPixelsSize * posX) + posY + 1);
    /* console.log(cell) */
    /* console.log(markedCells) */

    if(currButton === 1){
        if(containsObject(cell, finishCoordinates) == Infinity && containsObject(cell, markedCells) == Infinity){
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, cellSize, cellSize); 
            markedCells.push(cell);
            startСoordinates.push(cell);
            /* console.log(markedCells); 
            console.log(startСoordinates);  */
            currButton = 0;
        }
    
    }else if(currButton === 2){
        if(containsObject(cell, startСoordinates) == Infinity && containsObject(cell, markedCells) == Infinity){
            ctx.fillStyle = 'blue';
            ctx.fillRect(x, y, cellSize, cellSize); 
            markedCells.push(cell);
            finishCoordinates.push(cell);
            currButton = 0;
        }

    }else if(currButton === 3){
        if(containsObject(cell, startСoordinates) == Infinity && containsObject(cell, finishCoordinates) == Infinity){
            if(containsObject(cell, markedCells) == Infinity){
                ctx.fillStyle = 'black';
                ctx.fillRect(x, y, cellSize, cellSize);
                markedCells.push(cell);
                /* console.log(arrCoordinates)
                console.log(markedCells)
                console.log('black') */
    
            }else{
                ctx.fillStyle = '#00FF7F';
                ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
                markedCells.splice(containsObject(cell, markedCells), 1);
                /* console.log('green') */
            } 

        }else if(containsObject(cell, startСoordinates) != Infinity){
            ctx.fillStyle = '#00FF7F';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.splice(containsObject(cell, markedCells), 1);
            startСoordinates = [];
            document.getElementById("add_start").disabled = false;

        }else if(containsObject(cell, finishCoordinates) != Infinity){
            ctx.fillStyle = 'black';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            ctx.fillStyle = '#00FF7F';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.splice(containsObject(cell, markedCells), 1);
            finishCoordinates = [];
            document.getElementById("add_finish").disabled = false;
        }

    }else if(currButton === 0 && (startСoordinates.length > 0 || finishCoordinates.length > 0)){
        if(containsObject(cell, startСoordinates) != Infinity){
            ctx.fillStyle = '#00FF7F';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.splice(containsObject(cell, markedCells), 1);
            startСoordinates = [];
            document.getElementById("add_start").disabled = false;

        }else if(containsObject(cell, finishCoordinates) != Infinity){
            ctx.fillStyle = 'black';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            ctx.fillStyle = '#00FF7F';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.splice(containsObject(cell, markedCells), 1);
            finishCoordinates = [];
            document.getElementById("add_finish").disabled = false; 

        }else if(containsObject(cell, markedCells) != Infinity){
            ctx.fillStyle = '#00FF7F';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.splice(containsObject(cell, markedCells), 1);
        }

    }else if(currButton === 0 && startСoordinates.length == 0 && finishCoordinates.length == 0 && markedCells.length > 0){
        ctx.fillStyle = '#00FF7F';
        ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
        markedCells.splice(containsObject(cell, markedCells), 1);
    }
});

document.getElementById('add_start').addEventListener('click', function(e){
    if(currButton === 3){
        document.getElementById("add_wall").disabled = false;
    }

    currButton = 1;
    document.getElementById("add_start").disabled = true;
});

document.getElementById('add_finish').addEventListener('click', function(e){
    if(currButton === 3){
        document.getElementById("add_wall").disabled = false;
    }

    currButton = 2;
    document.getElementById("add_finish").disabled = true;
});

document.getElementById('add_wall').addEventListener('click', function(e){
    currButton = 3;
    document.getElementById("add_wall").disabled = true;
});

document.getElementById('remove_field').addEventListener('click', function(e){
    ctx.reset();
    drawGrid();
    document.getElementById("add_start").disabled = false;
    document.getElementById("add_finish").disabled = false;
    document.getElementById("add_wall").disabled = false;
    currButton = 0;
    startСoordinates = [];
    finishCoordinates = [];
    markedCells = [];
    mapMaze = [];
});

/* document.getElementById('start').addEventListener('click', function(e){
    console.log(mapMaze)
    console.log(arrCoordinates); 
    console.log(markedCells);
    console.log(startСoordinates);
    console.log(finishCoordinates);
    console.log(currButton); 
});  
  */
function arrValidation(arr){
    let newArr = [];
    for(let i = 0; i < arr.length - 1; ++i){
        let col = []
        for(let j = 0; j < arr.length - 1; ++j){
            col.push(arr[i][j]);
        }  
        newArr.push(col) 
    }
    return newArr;
}

document.getElementById('generate_maze').addEventListener('click', function(e){
    ctx.reset();
    drawGrid();
    document.getElementById("add_start").disabled = false;
    document.getElementById("add_finish").disabled = false;
    document.getElementById("add_wall").disabled = false;
    currButton = 0;
    startСoordinates = [];
    finishCoordinates = [];
    markedCells = [];
    mapMaze = [];

    if(fieldPixelsSize % 2 == 0){
        mapMaze = generateMaze(fieldPixelsSize + 1, fieldPixelsSize + 1);
        mapMaze = arrValidation(mapMaze);
        /* console.log(mapMaze) */
 
    }else{
        mapMaze = generateMaze(fieldPixelsSize, fieldPixelsSize);
        /* console.log(mapMaze) */
    }
    /* console.log(arrCoordinates)
    console.log(mapMaze) */
    drawMaze(mapMaze, arrCoordinates, cellSize);
    /* console.log(markedCells)
    console.log(arrCoordinates) */
    currButton = 3;
    document.getElementById("add_wall").disabled = true;
});

document.getElementById('start').addEventListener('click', function(e){
    for(let i = 0; i < markedCells.length; ++i){
        if(finishCoordinates[0].cellNumber == markedCells[i].cellNumber ){
            markedCells.splice(i, 1);
         }
    }

    for(let i = 0; i < markedCells.length; ++i){
        if(startСoordinates[0].cellNumber == markedCells[i].cellNumber){
            markedCells.splice(i, 1);
         }
    }
    

    let cellCoordinates = [];
    
    for(let i = 0; i < arrCoordinates.length; ++i){
        for(let j = 0; j < arrCoordinates.length; ++j){
            cellCoordinates.push(arrCoordinates[i][j]);
        }
    }
    aStar();
});
 




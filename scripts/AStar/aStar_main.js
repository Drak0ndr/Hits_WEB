import { Cell } from "./classes.js";
import {generateMaze, drawMaze} from './maze.js';
let fieldPixelsSize = 50;
let currButton = 0;
const canvas = document.getElementById('astar_canvas');
export const ctx = canvas.getContext('2d');
canvas.height = document.querySelector('#astar_canvas').clientHeight;
canvas.width = document.querySelector('#astar_canvas').clientHeight;
export let cellSize = canvas.width / fieldPixelsSize;
export let markedCells = [];
let startСoordinates = [];
let finishCoordinates = [];
let arrCoordinates = [];
let mapMaze = [];

drawGrid();
fillCoordinates(arrCoordinates);

function fillCoordinates(arr){
    let size = canvas.width / fieldPixelsSize;
    let x = 0;
    let y = 0;

    for(let i = 0; i < fieldPixelsSize; ++i){
        let col = [];

        for(let j = 0; j < fieldPixelsSize; ++j){
            col.push(new Cell(x, y, size));
            y += size;
        }

        arr.push(col);
        x += size;
        y = 0;
    }
}
/* console.log(arrCoordinates); */
function containsObject(obj, list) {
    for (let i = 0; i < list.length; ++i) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return i;
        }
    }

    return Infinity;
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.lineJoin = 'miter';
    ctx.lineWidth = 1;
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
    arrCoordinates = [];
    fillCoordinates(arrCoordinates);
    mapMaze = [];
    startСoordinates = [];
    finishCoordinates = [];
});


canvas.addEventListener('click', function(e){
    let x = Math.floor(e.offsetX / cellSize) * cellSize;
    let y = Math.floor(e.offsetY / cellSize) * cellSize;
    let cell = new Cell(x, y, cellSize);

    if(currButton === 1){
        if(containsObject(cell, finishCoordinates) == Infinity && containsObject(cell, markedCells) == Infinity){
            ctx.fillStyle = 'red';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
            markedCells.push(cell);
            startСoordinates.push(cell);
            currButton = 0;
        }
    
    }else if(currButton === 2){
        if(containsObject(cell, startСoordinates) == Infinity && containsObject(cell, markedCells) == Infinity){
            ctx.fillStyle = 'blue';
            ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
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
    
            }else{
                ctx.fillStyle = '#00FF7F';
                ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1); 
                markedCells.splice(containsObject(cell, markedCells), 1);
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
    console.log(arrCoordinates)
    console.log(markedCells)
});  */ 

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

    }else{
        mapMaze = generateMaze(fieldPixelsSize, fieldPixelsSize);
    }
    /* console.log(arrCoordinates)
    console.log(mapMaze) */
    drawMaze(mapMaze, arrCoordinates);
    currButton = 0;
});
 




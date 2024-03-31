import {findMinPath} from './geneticAlgorithm.js';
import {edgeMapping, drawEdges, drawVertexes, radius} from './driwing_genetic.js'

class Vertex {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export let canvas = document.getElementById("genetic_canvas");
canvas.height = document.querySelector('#genetic_canvas').clientHeight;
canvas.width = document.querySelector('#genetic_canvas').clientWidth;
export let ctx = canvas.getContext('2d');

export let arrVertexes = [];     
export let arrPaths = [];  

let deleteVertexCheck = false;
let deleteVertexes = false;

let intervalId;
let counter = 0; 
let animation = 10;
     
function findDistance(firstVertex, secondVertex) {
    return Math.sqrt((secondVertex.x - firstVertex.x)**2 + (secondVertex.y - firstVertex.y)**2);
}

export function deletePath() {
    counter = 0;
    arrPaths = [];
    ctx.reset(); 
    drawVertexes();
}

function findNeighbor(vertex) {
    let minDistance = Infinity;
    let numberVertex = Infinity;

    for (let i = 0; i < arrVertexes.length; ++i) {
        let distance = findDistance(arrVertexes[i], vertex);

        if (distance < minDistance) {
            minDistance = distance;
            numberVertex = i;   
        }
    }

    return numberVertex;
}

function drawAbility(vertex) {
    let numberVertex = findNeighbor(vertex);

    if(numberVertex === Infinity || (vertex.x > radius + 2 && vertex.x < canvas.clientWidth - radius - 4) &&
        (vertex.y > radius + 2 && vertex.y < canvas.clientHeight - radius - 4) &&
        findDistance(arrVertexes[numberVertex], vertex) > 2 * radius + 2){
        return 1;

    }else{
        return 0;
    }
}

canvas.addEventListener('click', (e) => {
    if (deleteVertexCheck) {
        return;
    }

    counter = 0;
    clearInterval(intervalId);
    
    let posX =  e.offsetX;
    let posY =  e.offsetY;

    let vertex = new Vertex(posX, posY)

    if (drawAbility(vertex)) {
        deletePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(posX, posY, radius, 0, 360);
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle='#fe019a';
        ctx.stroke();
      
        arrVertexes.push(vertex);

        if (edgeMapping) {
            drawEdges();
        }
    
        drawVertexes();
    }
});

function deleteVertex(e) {
    let posX = e.offsetX;
    let posY = e.offsetY;

    let vertex = new Vertex(posX, posY);

    let neighbor = findNeighbor(vertex);

    if (Math.abs(arrVertexes[neighbor].x - posX) <= radius &&
        Math.abs(arrVertexes[neighbor].y - posY) <= radius) {
        arrVertexes.splice(neighbor, 1);

        counter = 0;
        clearInterval(intervalId);
        
        deletePath();

        if (edgeMapping) {
            drawEdges();
        }
    }
}

export function showPath(path) {
    for (let i = 0; i < path.length - 1; ++i) {
        ctx.moveTo(arrVertexes[path[i]].x, arrVertexes[path[i]].y);
        ctx.lineTo(arrVertexes[path[i + 1]].x, arrVertexes[path[i + 1]].y);
        
        if (counter < document.getElementById("speed_range").value) {
            ctx.strokeStyle = "white";

        }else {
            ctx.strokeStyle = "#fe019a";
        }

        ctx.lineWidth = "5";
        ctx.stroke();
    }

    ctx.moveTo(arrVertexes[path[path.length - 1]].x, arrVertexes[path[path.length - 1]].y);
    ctx.lineTo(arrVertexes[path[0]].x, arrVertexes[path[0]].y);

    if (counter < document.getElementById("speed_range").value) {
        ctx.strokeStyle = "white";

    }else {
        ctx.strokeStyle = "#fe019a";
        clearInterval(intervalId);
        
    }

    ctx.lineWidth = "5";
    ctx.stroke();
    
    drawVertexes();
}

function geneticAlgorithm() {
    clearInterval(intervalId);

    function geneticAlgorithmAnimation(){
        ctx.reset();
        /* console.log(arrPaths) */
        drawVertexes();

        if (edgeMapping) {
            drawEdges();
        }
       
        let previousPath = arrPaths[0];
        /* console.log(previousPath) */
        /* console.log(arrPaths[0]); */
        arrPaths = findMinPath(arrVertexes, arrPaths);

        showPath(arrPaths[0]);

        if (previousPath !== arrPaths[0]){
            counter = 0;
        }

        ++counter;
    }
    
    intervalId = setInterval(geneticAlgorithmAnimation, animation);

    geneticAlgorithmAnimation();
}

canvas.addEventListener('mousedown', (e) => {
    clearInterval(intervalId);
    
    if (deleteVertexCheck) {
        deleteVertex(e);
        deleteVertexes = true;
    }
});

canvas.addEventListener('mouseup', () => {
    deleteVertexes = false;
});

document.getElementById("speed_range").addEventListener('input', () => {
    animation = 101 - document.getElementById("speed_range").value;

    if (intervalId) {
        clearInterval(intervalId);
        geneticAlgorithm();
    }
});

document.getElementById("сhange_graph").addEventListener('click', () => {
    if (!deleteVertexCheck) {
        deleteVertexCheck = true;

    }else {
        deleteVertexCheck = false;
    }
});

document.getElementById("remove_field").addEventListener('click', () => {
    ctx.reset();
    arrVertexes = [];
    arrPaths = [];
    counter = 0;
    clearInterval(intervalId);   
});

document.getElementById("start").addEventListener('click', () => {
    arrPaths = [];
    counter = 0;
    geneticAlgorithm();
}); 




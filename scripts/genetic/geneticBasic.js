import {findMinPath} from './geneticAlgorithm.js';
import {edgeMapping, drawEdges, drawVertexes, radius} from './driwingGenetic.js'

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
let animation = 1;

function deleteInterval(){
    counter = 0;
    clearInterval(intervalId);
}
     
function findDistance(firstVertex, secondVertex) {
    return Math.sqrt((secondVertex.x - firstVertex.x)**2 + (secondVertex.y - firstVertex.y)**2);
}

export function deletePath() {
    deleteInterval();
    arrPaths = [];
    ctx.reset(); 

    if (edgeMapping) {
        drawEdges();
    }
    
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

    if((numberVertex === Infinity && (vertex.x > radius + 2 && vertex.x < canvas.clientWidth - radius - 2) &&
        (vertex.y > radius + 2 && vertex.y < canvas.clientHeight - radius - 2)) || 
        ((vertex.x > radius + 2 && vertex.x < canvas.clientWidth - radius - 2) &&
        (vertex.y > radius + 2 && vertex.y < canvas.clientHeight - radius - 2) &&
        findDistance(arrVertexes[numberVertex], vertex) >  radius * 2 + 2)){
        return 1;

    }else{
        return 0;
    }
}

canvas.addEventListener('click', (e) => {
    if (deleteVertexCheck) {
        return;
    }

    deleteInterval();
    
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

        deleteInterval();
        
        deletePath();
    }
}

export function showPath(path) {
    let numberIterations;
    let sumDist = 0;
    
    document.getElementById("speed_range").value <= 20 ? numberIterations = 80 :  
    document.getElementById("speed_range").value <= 40 ? numberIterations = 180 :
    document.getElementById("speed_range").value <= 60 ? numberIterations = 280 :
    document.getElementById("speed_range").value <= 80 ? numberIterations = 380 :
    numberIterations = 480;
    
    for (let i = 0; i < path.length - 1; ++i) {
        ctx.moveTo(arrVertexes[path[i]].x, arrVertexes[path[i]].y);
        ctx.lineTo(arrVertexes[path[i + 1]].x, arrVertexes[path[i + 1]].y);

        sumDist += findDistance(arrVertexes[path[i]], arrVertexes[path[i+1]]);

        if (counter < numberIterations) {
            ctx.strokeStyle = "white";

        }else {
            ctx.strokeStyle = "#fe019a";
        }

        ctx.lineWidth = "5";
        ctx.stroke(); 
    }

    ctx.moveTo(arrVertexes[path[path.length - 1]].x, arrVertexes[path[path.length - 1]].y);
    ctx.lineTo(arrVertexes[path[0]].x, arrVertexes[path[0]].y);

    sumDist += findDistance(arrVertexes[path[path.length - 1]], arrVertexes[path[0]]);

    if (counter < numberIterations) {
        ctx.strokeStyle = "white";

    }else {
        ctx.strokeStyle = "#fe019a";
        clearInterval(intervalId);
    }

    ctx.lineWidth = "5";
    ctx.stroke();  
    
    drawVertexes();

    document.getElementById("ansver").textContent = "Минимальная длина пути: " + Math.round(sumDist * 100) / 100;
}

function geneticAlgorithm() {
    clearInterval(intervalId);
    
    function geneticAlgorithmAnimation(){
        ctx.reset();

        drawVertexes();

        if (edgeMapping) {
            drawEdges();
        }
       
        let previousPath = arrPaths[0];

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
    isRightSpeed(document.getElementById('speed_range'));
    animation = 101 - document.getElementById("speed_range").value;
    document.getElementById('speed_range_descr').textContent = "Скорость анимации: " + 
    document.getElementById("speed_range").value + "%"; 
});

document.getElementById("сhange_graph").addEventListener('change', () => {
    if (!deleteVertexCheck) {
        deleteVertexCheck = true;

    }else {
        deleteVertexCheck = false;
    }
});

document.getElementById("remove_field").addEventListener('click', () => {
    document.getElementById("ansver").textContent = "Минимальная длина пути: ";

    ctx.reset();
    arrVertexes = [];
    arrPaths = [];
    deleteInterval();   
});

document.getElementById("start").addEventListener('click', () => {
    document.getElementById("ansver").textContent = "Минимальная длина пути: ";

    arrPaths = [];
    deleteInterval(); 
    geneticAlgorithm();
}); 

function isRightSpeed(obj){
    if (obj.value > 100){
        obj.value = 100;
    }   
    if (obj.value < 1){
        obj.value = 1;
    } 
}

document.getElementById("my_block").addEventListener('mouseover', () => {
    setTimeout(() => document.getElementById("exit_descr").style.display = "flex", 200);
});

document.getElementById("my_block").addEventListener('mouseout', () => {
    setTimeout(() => document.getElementById("exit_descr").style.display = "none", 200);
});



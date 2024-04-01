import {arrPaths, showPath, arrVertexes, deletePath, ctx} from './geneticBasic.js'

export let numberGenerations = 500;       
export let populationSize = 500;           
export let probabilityMutation = 50;

export let edgeMapping = false;  

export let radius = 7;   

export function drawVertexes() {
    for(let i = 0; i < arrVertexes.length; ++i){
        ctx.fillStyle = "white";

        if(i == arrVertexes.length - 1){
            ctx.fillStyle = "#fe019a"; 
        }

        ctx.beginPath();
        ctx.arc(arrVertexes[i].x, arrVertexes[i].y, radius, 0, 360);
        ctx.fill();  
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fe019a';
        ctx.stroke();  
    }
}
         
export function drawEdges() {
    for (let i = 0; i < arrVertexes.length; ++i) {
        for (let j = 0; j < arrVertexes.length; ++j) {
            ctx.moveTo(arrVertexes[i].x, arrVertexes[i].y);
            ctx.lineTo(arrVertexes[j].x, arrVertexes[j].y);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "rgb(0, 0, 0, 0.2)";
            ctx.stroke();
            ctx.beginPath();
        }
    }
}

document.getElementById("ribs_check").addEventListener('click', () => {
    edgeMapping = document.getElementById("ribs_check").checked;
    ctx.reset();

    if (edgeMapping){
        drawEdges();
    }

    drawVertexes();
    showPath(arrPaths[0]);
});

document.getElementById("count_generations").addEventListener('input', () => {
    numberGenerations = Number(document.getElementById("count_generations").value);
    deletePath();
});

document.getElementById("count_children").addEventListener('input', () => { 
    populationSize = Number(document.getElementById("count_children").value);
    deletePath();  
});

document.getElementById("probability").addEventListener('input', () => {
    probabilityMutation = Number(document.getElementById("probability").value);
    deletePath();
});
import {arrPaths, showPath, arrVertexes, deletePath, ctx} from './geneticBasic.js'

export let numberGenerations = 500;       
export let populationSize = 500;           
export let probabilityMutation = 50;

export let edgeMapping = false;  

export let radius = 7;   

export function drawVertexes() {
    for(let i = 0; i < arrVertexes.length; ++i){
        ctx.fillStyle = "white";

        if(i === arrVertexes.length - 1){
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

document.getElementById("count_generations").addEventListener('input', (e) => {
    numberGenerations = Number(document.getElementById("count_generations").value);
    document.getElementById('count_generations_descr').textContent = "Количество поколений: " + numberGenerations; 
    count_generations.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
    deletePath();
});

document.getElementById("count_children").addEventListener('input', (e) => { 
    populationSize = Number(document.getElementById("count_children").value);
    document.getElementById('count_children_descr').textContent = "Размер популяции: " + populationSize;
    count_children.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
    deletePath();  
});

document.getElementById("probability").addEventListener('input', (e) => {
    probabilityMutation = Number(document.getElementById("probability").value);
    document.getElementById('probability_descr').textContent = "Вероятность мутации: " + probabilityMutation + "%";
    probability.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
    deletePath();
});
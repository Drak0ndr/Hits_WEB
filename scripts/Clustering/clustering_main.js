import { drawer, startDrawing, stopDrawing, clearClusters, unlockingButton, buttonLock, startAlgorithms} from "./drawing_functions.js";
export { pointCoordinates, ctx, ctx2, ctx3, canvas1, canvas2, canvas3, currButton, currCountClusters, currRadius, currCountNeighbors, currCountClustersHierarchical };

let currButton = 1;
let currCountClusters = 3;
let currRadius = 50;
let currCountNeighbors = 5;
let currCountClustersHierarchical = 3;
let pointCoordinates = [];

buttonLock();

const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.width = document.querySelector('#canvas1').clientWidth;
canvas1.height = document.querySelector('#canvas1').clientHeight;

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width = document.querySelector('#canvas2').clientWidth;
canvas2.height = document.querySelector('#canvas2').clientHeight;

const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');
canvas3.width = document.querySelector('#canvas3').clientWidth;
canvas3.height = document.querySelector('#canvas3').clientHeight;

document.getElementById('canvas1').addEventListener('click', (event) => { drawer(event) });
document.getElementById('canvas3').addEventListener('click', (event) => { drawer(event) });
document.getElementById('canvas2').addEventListener('click', (event) => { drawer(event) });

document.getElementById('canvas1').addEventListener('mousedown', startDrawing);
document.getElementById('canvas1').addEventListener('mouseup', stopDrawing);

document.getElementById('canvas2').addEventListener('mousedown', startDrawing);
document.getElementById('canvas2').addEventListener('mouseup', stopDrawing);

document.getElementById('canvas3').addEventListener('mousedown', startDrawing);
document.getElementById('canvas3').addEventListener('mouseup', stopDrawing);

function changeSettings(setting) {
    const input = document.getElementById(setting);
    
    if (setting === 'k_means_range') { 
        currCountClusters = parseInt(input.value);
    }
    else if (setting === 'radius_range'){
        currRadius = parseInt(input.value);
    }
    else if (setting === 'neighbors_range') { 
        currCountNeighbors = parseInt(input.value);
    }
    else if (setting === 'hierarchical_range') {
        currCountClustersHierarchical = parseInt(input.value);
    }
}

document.getElementById('k_means_range').addEventListener('input', () => {
    changeSettings('k_means_range');  
});

document.getElementById('radius_range').addEventListener('input', () => {
    changeSettings('radius_range');  
});

document.getElementById('neighbors_range').addEventListener('input', () => {
    changeSettings('neighbors_range'); 
});

document.getElementById('hierarchical_range').addEventListener('input', () => {
    changeSettings('hierarchical_range');
});

document.getElementById('add_points').addEventListener('click', () => {
    currButton = 1;
    buttonLock(); 
});

document.getElementById('clear_clusters').addEventListener('click', () => {
    currButton = 1;
    buttonLock(); 
    clearClusters();
});

document.getElementById('remove_points').addEventListener('click', () => {
    currButton = 1;
    buttonLock(); 
    ctx.reset();
    ctx2.reset();
    ctx3.reset();
    pointCoordinates = [];
});

document.getElementById('start').addEventListener('click', () => {
    currButton = 0;
    unlockingButton();
    startAlgorithms();
});



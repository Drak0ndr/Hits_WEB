import { kmeans, startDrawing, startAlgorithms, drawingCentroids, drawingKMeansClusters, removeKMeans} from "./drawingFunctions.js";

export let currButton = 1;
export let currCountClusters = 3;
export let currRadius = 80;
export let currCountNeighbors = 9;
export let currCountClustersHierarchical = 3;
export let pointCoordinates = [];
export let mouseButton = 1;
export let kmeansColors = [];

let checkCentroids = false;

export const canvas1 = document.getElementById('canvas1');
canvas1.width = document.querySelector('#canvas1').clientWidth;
canvas1.height = document.querySelector('#canvas1').clientHeight;
export const ctx = canvas1.getContext('2d');

export const canvas2 = document.getElementById('canvas2');
canvas2.width = document.querySelector('#canvas2').clientWidth;
canvas2.height = document.querySelector('#canvas2').clientHeight;
export const ctx2 = canvas2.getContext('2d');

export const canvas3 = document.getElementById('canvas3');
canvas3.width = document.querySelector('#canvas3').clientWidth;
canvas3.height = document.querySelector('#canvas3').clientHeight;
export const ctx3 = canvas3.getContext('2d');

document.getElementById('remove_points').addEventListener('click', () => {
    currButton = 1;
    ctx.reset();
    ctx2.reset();
    ctx3.reset();
    pointCoordinates = [];
    removeKMeans();
    kmeansColors = [];
});

document.getElementById('start').addEventListener('click', () => {
    kmeansColors = [];
    removeKMeans()
    currButton = 0;
    startAlgorithms();
});

document.getElementById('centroids_check').addEventListener('change', () => {
    if(checkCentroids === false){
        drawingCentroids(kmeans.centroids);
        checkCentroids = true;

    }else{
        if(pointCoordinates.length > 0 && kmeansColors.length > 0){
            ctx.reset();
            drawingKMeansClusters(kmeans.clusters)
            checkCentroids = false;

        }else if(kmeansColors.length === 0){
            checkCentroids = false;
        } 
    }
});

document.getElementById('k_means_range').addEventListener('input', (e) => {
    currCountClusters = parseInt(document.getElementById('k_means_range').value);
    document.getElementById('k_means_range_descr').textContent = "Количество кластеров: " + currCountClusters;
    k_means_range.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
});

document.getElementById('radius_range').addEventListener('input', (e) => {
    currRadius = parseInt(document.getElementById('radius_range').value); 
    document.getElementById('radius_range_descr').textContent = "Pадиус поиска точек: " + currRadius; 
    radius_range.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
});

document.getElementById('neighbors_range').addEventListener('input', (e) => {
    currCountNeighbors = parseInt(document.getElementById('neighbors_range').value); 
    document.getElementById('neighbors_range_descr').textContent = "Количество соседей: " + currCountNeighbors;
    neighbors_range.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
});

document.getElementById('hierarchical_range').addEventListener('input', (e) => {
    currCountClustersHierarchical = parseInt(document.getElementById('hierarchical_range').value);
    document.getElementById('hierarchical_range_descr').textContent = "Количество кластеров: " + currCountClustersHierarchical;
    hierarchical_range.style.backgroundSize = 100 * (e.target.value - e.target.min) / (e.target.max - e.target.min) + '% 100%';
});

document.getElementById('canvas1').addEventListener('mousedown', () => {
    mouseButton = 1;
    startDrawing();
});

document.getElementById('canvas1').addEventListener('mouseup', () => {
    mouseButton = 0;
});

document.getElementById('canvas2').addEventListener('mousedown', () => {
    mouseButton = 1;
    startDrawing();
});

document.getElementById('canvas2').addEventListener('mouseup', () => {
    mouseButton = 0;
});

document.getElementById('canvas3').addEventListener('mousedown', () => {
    mouseButton = 1;
    startDrawing();
});

document.getElementById('canvas3').addEventListener('mouseup', () => {
    mouseButton = 0;
});








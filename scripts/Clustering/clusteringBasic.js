import { kmeans, dbscanClusters, drawingDBSCANMargin, heuristicsClusters, drawingDBSCANCentre, startDrawing, startAlgorithms, drawingCentroids, drawingAllClusters, removeAllClusters} from "./drawingFunctions.js";

export let currButton = 1;
export let currCountClusters = 3;
export let currRadius = 100;
export let currCountNeighbors = 5;
export let currCountClustersHierarchical = 3;
export let pointCoordinates = [];
export let mouseButton = 1;
export let kmeansColors = [];
export let dbscanColors = [];
export let hierarchicalColors = [];

let checkCentroids = false;

export const canvas = document.getElementById('canvas');
canvas.width = document.querySelector('#canvas').clientWidth;
canvas.height = document.querySelector('#canvas').clientHeight;
export const ctx = canvas.getContext('2d');

export function resetButton(){
    currButton = 1;
}

document.getElementById('remove_points').addEventListener('click', () => {
    currButton = 1;
    ctx.reset();
    pointCoordinates = [];
    removeAllClusters();
    kmeansColors = [];
    dbscanColors = [];
    hierarchicalColors = [];
});

document.getElementById('start').addEventListener('click', () => {
    kmeansColors = [];
    dbscanColors = [];
    hierarchicalColors = [];
    removeAllClusters();
    currButton = 0;
    startAlgorithms();
});

document.getElementById('centroids_check').addEventListener('change', () => {
    if(checkCentroids === false){
        drawingCentroids(kmeans.centroids);
        checkCentroids = true;

    }else{
        if(pointCoordinates.length > 0 && kmeansColors.length > 0 && pointCoordinates.length == kmeansColors.length){
            ctx.reset();
            drawingAllClusters(kmeans.clusters, kmeansColors, 0, Math.PI * 2 / 3, "K", 4, 10);
            drawingDBSCANMargin();
            drawingDBSCANCentre(dbscanClusters);
            drawingAllClusters(dbscanClusters, dbscanColors, Math.PI * 2 / 3, Math.PI * 4 / 3, "D", -8, 2);
            drawingAllClusters(heuristicsClusters, hierarchicalColors, Math.PI * 4 / 3, Math.PI * 2, "И", 4, -4);
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

document.getElementById('canvas').addEventListener('mousedown', () => {
    mouseButton = 1;
    startDrawing();
});

document.getElementById('canvas').addEventListener('mouseup', () => {
    mouseButton = 0;
});










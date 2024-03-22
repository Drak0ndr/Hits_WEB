import { Point } from "./class_point.js";
import { currButton, pointCoordinates, currCountClusters, currCountClustersHierarchical, currRadius, currCountNeighbors, canvas1, ctx, ctx2, ctx3} from "./clustering_main.js";
import { kMeans } from "./k_means.js";
import { dbscan } from "./DBSCAN.js";
import { hierarchicalClustering } from "./hierarchical.js";
import {colors} from "./colors.js"
export { drawer, startDrawing, stopDrawing, startDBSCAN, startKMeans, findNearbyPointIndex, clearClusters, startHierarchical, startAlgorithms};

const RADIUS = 7;
let algorithm = 1;

function addPoint(x, y) {
    let point = new Point(x, y, RADIUS);
    pointCoordinates.push(point);
    pointCoordinates[pointCoordinates.length - 1].drawingPoints();
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

function findNearbyPointIndex(x, y) {
    let minDistance = Infinity;
    let index = null;

    for (let i = 0; i < pointCoordinates.length; ++i) {
        let distance = findDistance(pointCoordinates[i].x, pointCoordinates[i].y, x, y);

        if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

function checkingDistance(x, y) {
    let index = findNearbyPointIndex(x, y);

    if (index === null || findDistance(pointCoordinates[index].x, pointCoordinates[index].y, x, y) > 16 && x > RADIUS + 5 
    && x < canvas1.clientWidth - RADIUS - 5 && y > RADIUS + 5 && y < canvas1.clientHeight - RADIUS - 5) {
        return true;
    }

    return false;
}

function drawer(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if (currButton === 1 && checkingDistance(x, y)) {
        addPoint(x, y);
    } 
}

function drawingClusters(clusters){
    for (let i = 0; i < clusters.length; ++i) {
        let colorIndex = Math.floor((Math.random() * colors.length / clusters.length) + (colors.length / clusters.length * i));

        for (let j = 0; j < clusters[i].length; ++j) { 
            let index = pointCoordinates.indexOf(clusters[i][j]);

            if (algorithm === 1) {
                pointCoordinates[index].kMeansDrawing(colors[colorIndex]);

            }else if (algorithm === 2) {
                pointCoordinates[index].dbscanDrawing(colors[colorIndex]);

            }else if (algorithm === 3){
                pointCoordinates[index].hierarchicalDriwing(colors[colorIndex]);
            }
        }
    }
}

function drawingCentroids(centroids) { 
    for (let i = 0; i < centroids.length; ++i) {
        ctx.beginPath();
        ctx.moveTo(centroids[i].x, centroids[i].y - Math.sqrt(16) / 3);
        ctx.lineTo(centroids[i].x - 8, centroids[i].y - Math.sqrt(16) / 3 + Math.sqrt(192));
        ctx.lineTo(centroids[i].x + 8, centroids[i].y - Math.sqrt(16) / 3 + Math.sqrt(192));
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

function drawingDBSCANMargin() {
    for (let i = 0; i < pointCoordinates.length; ++i) {
        pointCoordinates[i].dbscanDrawing('black');
    }
}

function drawingDBSCANCentre(){
    for (let i = 0; i < pointCoordinates.length; ++i) {
        ctx2.beginPath();
        ctx2.arc(pointCoordinates[i].x, pointCoordinates[i].y, 3, 0, 360);
        ctx2.closePath();
        ctx2.fillStyle = 'white';
        ctx2.fill();
    }
}

function startKMeans () {
    resetClusters();
    algorithm = 1;
    let kmeans = kMeans(currCountClusters);
    drawingClusters(kmeans.clusters);
    drawingCentroids(kmeans.centroids);
}

function startDBSCAN (){
    algorithm = 2;
    drawingDBSCANMargin();
    drawingDBSCANCentre();
    let clusters = dbscan(pointCoordinates, currRadius, currCountNeighbors);
    drawingClusters(clusters);
}

function startHierarchical() { 
    algorithm = 3;
    let clusters = hierarchicalClustering(pointCoordinates, currCountClustersHierarchical);
    drawingClusters(clusters);
}

function startAlgorithms() {
    if (currCountClusters > pointCoordinates.length){
        alert("Недостаточно точек для такого количества кластеров. Уменьшите количество кластеров в настройках K-Means или поставьте больше точек.");
        return;

    }else if (currCountClustersHierarchical > pointCoordinates.length){
        alert("Недостаточно точек для такого количества кластеров. Уменьшите количество кластеров в настройках Иерархического алгоритма или поставьте больше точек.");
        return;
    }
    
    startKMeans();
    startDBSCAN();
    startHierarchical();
}

export function resetClusters() {
    ctx.reset();
    ctx2.reset();
    ctx3.reset();
    
}

function clearClusters(){
    resetClusters();
    for (let i = 0; i < pointCoordinates.length; i++) {
        pointCoordinates[i].drawingPoints();
    }
}

function startDrawing() {
    document.getElementById('canvas1').addEventListener('mousemove', drawer);
    document.getElementById('canvas3').addEventListener('mousemove', drawer);
    document.getElementById('canvas2').addEventListener('mousemove', drawer);
}

function stopDrawing() {
    document.getElementById('canvas1').removeEventListener('mousemove', drawer);
    document.getElementById('canvas3').removeEventListener('mousemove', drawer);
    document.getElementById('canvas2').removeEventListener('mousemove', drawer);
}

export function unlockingButton(){
    document.getElementById("add_points").disabled = false;   
}

export function buttonLock(){
    document.getElementById("add_points").disabled = true;
}




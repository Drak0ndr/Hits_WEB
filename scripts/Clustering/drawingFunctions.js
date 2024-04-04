import { currButton, kmeansColors, pointCoordinates, currCountClusters, currCountClustersHierarchical, currRadius, currCountNeighbors, canvas1, ctx, ctx2, ctx3, mouseButton} from "./clusteringBasic.js";
import { kMeans } from "./kMeans.js";
import { dbscan } from "./DBSCAN.js";
import { hierarchicalClustering } from "./hierarchical.js";

export class Point {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    drawingPoints(arrContext, color = 'black') {
        for(let i = 0; i < arrContext.length; ++i){
            arrContext[i].beginPath();
            arrContext[i].arc(this.x, this.y, this.radius, 0, 360);
            arrContext[i].closePath();
            arrContext[i].fillStyle = color;
            arrContext[i].fill();
        }
    }
}

export let kmeans = { clusters: null, centroids: null};

const colors = ["#4169E1",'#7851A9',"#CA0147",'#9B2D30','#E6E6FA','#E6D690','#3EB489','#50C878','#6495ED','#480607','#A5260A','#900020',
                '#D5713F','#641349','#7B001C','#FFD700','#4B0082','#1CD3A2','#7B3F00','#21421E','#4C5866','#808000','#C7FCEC','#2A6478',
                '#00A693','#32127A','#660066','#116062','#036C56', '#ED760E', '#CC5500', '#FF4F00', '#F8D568', '#FFFF00', '#EDFF21', '#39ff14',
                '#04d9ff', '#5555ff', '#7df9ff', '#003153', '#1560BD', '#1164B4', '#00BFFF', '#252850', '#1D334A', '#102C54', '#002137', '#543964']

let radius = 7;
let spikes = 5;
let innerRadius = 4;
let outerRadius = 2;
let algorithm = 1;
let currDistance = 1;

function addPoint(x, y) {
    let point = new Point(x, y, radius);
    pointCoordinates.push(point);
    pointCoordinates[pointCoordinates.length - 1].drawingPoints([ctx, ctx2, ctx3]);
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

export function removeKMeans(){
    kmeans = { clusters: null, centroids: null};
}

export function heuristics(firstPoint, secondPoint) {
    let distance = 0;
    let x = firstPoint.x - secondPoint.x;
    let y = firstPoint.y - secondPoint.y;

    if (currDistance === 1){  
        distance = Math.sqrt(x**2 + y**2)
    
    }else if(currDistance === 2){
        distance = Math.abs(x) + Math.abs(y);

    }else{
        distance = Math.max(Math.abs(x), Math.abs(y));
    }
    
    return distance;
}

export function findNeighborIndex(x, y) {
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
    let index = findNeighborIndex(x, y);

    if (index === null || findDistance(pointCoordinates[index].x, pointCoordinates[index].y, x, y) > radius * 2 + 2
     && x > radius + 2 && x < canvas1.clientWidth - radius - 2 && y > radius + 2 && y < canvas1.clientHeight - radius - 2) {
        return true;
    }

    return false;
}

function drawingPoints(e) {
    if(mouseButton === 1){
        let x = e.offsetX;
        let y = e.offsetY;
    
        if (currButton === 1 && checkingDistance(x, y)) {
            addPoint(x, y);
        } 
        if (currButton === 0 && checkingDistance(x, y)) {
            clearClusters();
            addPoint(x, y);
            currButton = 1;
        } 
    }
}

export function drawingClusters(clusters){
    for (let i = 0; i < clusters.length; ++i) {
        let colorIndex = Math.floor((Math.random() * colors.length / clusters.length) + (colors.length / clusters.length * i));

        for (let j = 0; j < clusters[i].length; ++j) { 
            let index = pointCoordinates.indexOf(clusters[i][j]);

            if (algorithm === 1) {
                pointCoordinates[index].drawingPoints([ctx], colors[colorIndex]);
                kmeansColors.push(colors[colorIndex]);

            }else if (algorithm === 2) {
                pointCoordinates[index].drawingPoints([ctx2], colors[colorIndex]);

            }else if (algorithm === 3){
                pointCoordinates[index].drawingPoints([ctx3], colors[colorIndex]);
            }
        }
    }
}

export function drawingKMeansClusters(clusters){
    let index = 0;

    for (let i = 0; i < clusters.length; ++i) {

        index += clusters[i].length;

        for (let j = 0; j < clusters[i].length; ++j) { 
            ctx.beginPath();
            ctx.arc(clusters[i][j].x, clusters[i][j].y, clusters[i][j].radius, 0, 360);
            ctx.closePath();
            ctx.fillStyle = kmeansColors[index - 1];
            ctx.fill();
        }
    }
}

export function drawingCentroids(centroids) { 
    if (centroids != null){
        for (let i = 0; i < centroids.length; ++i) {
            let cx = centroids[i].x;
            let cy = centroids[i].y;
            let rot = Math.PI / 2 * 3;
            let step = Math.PI / spikes;
    
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius)
    
            for(let j = 0; j < spikes; ++j){
                let x = cx + Math.cos(rot) * outerRadius;
                let y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y)
                rot += step
    
                x = cx + Math.cos(rot) * innerRadius;
                y = cy+Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y)
                rot += step
            }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = 'black';
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.fill();
        }
    }  
}

function drawingDBSCANMargin() {
    for (let i = 0; i < pointCoordinates.length; ++i) {
        pointCoordinates[i].drawingPoints([ctx2]);
    }
}

function drawingDBSCANCentre(){
    for (let i = 0; i < pointCoordinates.length; ++i) {
        ctx2.beginPath();
        ctx2.moveTo(pointCoordinates[i].x - 2.5, pointCoordinates[i].y - 2.5);
        ctx2.lineTo(pointCoordinates[i].x + 2.5, pointCoordinates[i].y + 2.5);
        ctx2.moveTo(pointCoordinates[i].x + 2.5, pointCoordinates[i].y - 2.5);
        ctx2.lineTo(pointCoordinates[i].x - 2.5, pointCoordinates[i].y + 2.5);
        ctx2.lineWidth = 2;
        ctx2.strokeStyle = "white";
        ctx2.stroke();
    }
}

export function resetClusters() {
    ctx.reset();
    ctx2.reset();
    ctx3.reset();   
}

export function clearClusters(){
    resetClusters();
    for (let i = 0; i < pointCoordinates.length; ++i) {
        pointCoordinates[i].drawingPoints([ctx, ctx2, ctx3]);
    }

    kmeans.centroids = null;
}

export function startKMeans () {
    resetClusters();
    algorithm = 1;
    kmeans = kMeans(currCountClusters);
    drawingClusters(kmeans.clusters);

    if(document.getElementById('centroids_check').checked){
        drawingCentroids(kmeans.centroids);
    }
}

export function startDBSCAN (){
    algorithm = 2;
    drawingDBSCANMargin();
    drawingDBSCANCentre();
    let clusters = dbscan(pointCoordinates, currRadius, currCountNeighbors);
    drawingClusters(clusters);
}

export function startHierarchical() { 
    algorithm = 3;
    let clusters = hierarchicalClustering(pointCoordinates, currCountClustersHierarchical);
    drawingClusters(clusters);
}

export function startAlgorithms() {
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

export function startDrawing() {
    document.getElementById('canvas1').addEventListener('mousemove',drawingPoints);
    document.getElementById('canvas1').addEventListener('mousedown',drawingPoints);   
    document.getElementById('canvas2').addEventListener('mousemove', drawingPoints);
    document.getElementById('canvas2').addEventListener('mousedown', drawingPoints);
    document.getElementById('canvas3').addEventListener('mousemove', drawingPoints);
    document.getElementById('canvas3').addEventListener('mousedown', drawingPoints);
}

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});
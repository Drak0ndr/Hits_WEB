import { currButton, resetButton, dbscanColors, hierarchicalColors, kmeansColors, pointCoordinates, currCountClusters, currCountClustersHierarchical, currRadius, currCountNeighbors, canvas, ctx, mouseButton} from "./clusteringBasic.js";
import { kMeans } from "./kMeans.js";
import { dbscan } from "./DBSCAN.js";
import { hierarchicalClustering } from "./hierarchical.js";

export class Point {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    drawingPoints(start, end, color = 'black', text = ' ', dx = 0, dy = 0) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, start, end);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = 'bold 8px Poppins';
        ctx.textAlign = "center";
        ctx.fillText(text, this.x + dx, this.y + dy);
    } 
}

export let kmeans = { clusters: null, centroids: null};
export let dbscanClusters = [];
export let heuristicsClusters = [];

const colors1 = ['#FBCEB1', '#7FFFD4', '#E32636', '#9966CC', '#A8E4A0', '#C1876B', '#BDECB6', '#77DDE7', '#ABCDEF', '#AFEEEE', '#ECEBBD',
                '#CED23A', '#009B76', '#B00000', '#D5D5D5', '#6495ED', '#34C924', '#911E42', '#256D7B', '#5D8AA8', '#FFCF48', '#F64A46',
                '#EF3038', '#80DAEB', '#87CEEB', '#FFDB58', '#D1E231', '#EDFF21', '#3BB08F', '#5D76CB', '#FFFF99', '#FF4D00', '#CD9A7B',
                '#76FF7A', '#007BA7', '#00FF00', '#0BDA51', '#7FC7FF', '#FF9966', '#00A693', '#FFCFAB', '#9D81BA', '#F3DA0B', '#FF6E4A']

const colors2 = ['#AB274F', '#CD9575', '#6A5ACD', '#FAE7B5', '#EEE8AA', '#FFDF84', '#47A76A', '#FAF0BE', '#9F8170', '#FFB02E', '#A2ADD0',
                '#85BB65', '#F9F8BB', '#C5E384', '#CDA434', '#1E90FF', '#00BFFF', '#00A86B', '#77DD77', '#A18594', '#FCDD76', '#FCDD76']

const colors3 = ['#FDD9B5', '#78DBE2', '#9F2B68', '#44944A', '#F5F5DC', '#30D5C8', '#FFDB8B', '#DABDAB', '#98FB98', '#8CCB5E', '#FFCF40',
                '#FFDC33', '#2A8D9C', '#FFB841', '#62639B', '#9B2D30', '#3E5F8A', '#D5713F', '#9ACEEB', '#DAD871', '#00FF7F', '#A7FC00',
                '#0095B6', '#D76E00', '#42AAFF', '#30BA8F', '#B2EC5D', '#9ACD32', '#2E8B57', '#ADDFAD', '#FFD700', '#BDDA57', '#1CD3A2', 
                '#7851A9', '#FFF44F', '#FF8243', '#3EB489', '#A3C6C0', '#BAACC7', '#C7FCEC', '#8673A1', '#7442C8', '#B0E0E6', '#99FF99']

let radius = 14;
let spikes = 5;
let innerRadius = 6;
let outerRadius = 3;
let algorithm = 1;
let currDistance = 1;

function addPoint(x, y) {
    let point = new Point(x, y, radius);
    pointCoordinates.push(point);
    pointCoordinates[pointCoordinates.length - 1].drawingPoints(0, Math.PI * 2);
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

export function removeAllClusters(){
    kmeans = { clusters: null, centroids: null};
    dbscanClusters = [];
    heuristicsClusters = [];
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
     && x > radius + 2 && x < canvas.clientWidth - radius - 2 && y > radius + 2 && y < canvas.clientHeight - radius - 2) {
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
            resetButton();
        } 
    }
}

export function drawingClusters(clusters, colors){
    for (let i = 0; i < clusters.length; ++i) {
        let colorIndex = Math.floor((Math.random() * colors.length / clusters.length) + (colors.length / clusters.length * i));

        for (let j = 0; j < clusters[i].length; ++j) { 
            let index = pointCoordinates.indexOf(clusters[i][j]);

            if (algorithm === 1) {
                pointCoordinates[index].drawingPoints(0, Math.PI * 2 / 3, colors[colorIndex], "K", 4, 10);
                kmeansColors.push(colors[colorIndex]);

            }else if (algorithm === 2) {
                pointCoordinates[index].drawingPoints(Math.PI * 2 / 3, Math.PI * 4 / 3, colors[colorIndex], "D", -8, 2);
                dbscanColors.push(colors[colorIndex]);

            }else if (algorithm === 3){
                pointCoordinates[index].drawingPoints(Math.PI * 4 / 3,  Math.PI * 2, colors[colorIndex], "И", 4, -4);
                hierarchicalColors.push(colors[colorIndex]);
            }
        }
    }
}

export function drawingAllClusters(clusters, colors, start, end, text = ' ', dx = 0, dy = 0){
    let index = 0;

    for (let i = 0; i < clusters.length; ++i) {

        index += clusters[i].length;

        for (let j = 0; j < clusters[i].length; ++j) { 
            ctx.beginPath();
            ctx.moveTo(clusters[i][j].x, clusters[i][j].y);
            ctx.arc(clusters[i][j].x, clusters[i][j].y, clusters[i][j].radius, start, end);
            ctx.closePath();
            ctx.fillStyle = colors[index - 1];
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.font = 'bold 8px Poppins';
            ctx.textAlign = "center";
            ctx.fillText(text, clusters[i][j].x + dx, clusters[i][j].y + dy);
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
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y)
                rot += step
            }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'black';
                ctx.stroke();
                ctx.fillStyle = 'white';
                ctx.fill();
        }
    }  
}

export function drawingDBSCANMargin() {
    for (let i = 0; i < pointCoordinates.length; ++i) {
        pointCoordinates[i].drawingPoints(Math.PI * 2 / 3, Math.PI * 4 / 3,"white", ' ');
    }
}

export function drawingDBSCANCentre(clusters){
    let arrPoints = [];
    for(let i = 0; i < clusters.length; ++i){
        arrPoints.push(...clusters[i])
    }

    for (let i = 0; i < pointCoordinates.length; ++i) {
        if(!arrPoints.includes(pointCoordinates[i])){
            ctx.beginPath();
            ctx.moveTo(pointCoordinates[i].x - 10.5, pointCoordinates[i].y - 2.5);
            ctx.lineTo(pointCoordinates[i].x - 6.5, pointCoordinates[i].y + 2.5);
            ctx.moveTo(pointCoordinates[i].x - 6.5, pointCoordinates[i].y - 2.5);
            ctx.lineTo(pointCoordinates[i].x - 10.5, pointCoordinates[i].y + 2.5);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#FF0000";
            ctx.stroke();
        }
    }
}

export function resetClusters() {
    ctx.reset();
}

export function clearClusters(){
    resetClusters();
    for (let i = 0; i < pointCoordinates.length; ++i) {
        pointCoordinates[i].drawingPoints(0, Math.PI * 2);
    }

    kmeans.centroids = null;
}

export function startKMeans () {
    resetClusters();
    algorithm = 1;
    kmeans = kMeans(currCountClusters);
    drawingClusters(kmeans.clusters, colors1);

    if(document.getElementById('centroids_check').checked){
        drawingCentroids(kmeans.centroids);
    }
}

export function startDBSCAN (){
    algorithm = 2;
    drawingDBSCANMargin();
    dbscanClusters = dbscan(pointCoordinates, currRadius, currCountNeighbors);
    drawingClusters(dbscanClusters, colors2);
    drawingDBSCANCentre(dbscanClusters);
}

export function startHierarchical() { 
    algorithm = 3;
    heuristicsClusters = hierarchicalClustering(pointCoordinates, currCountClustersHierarchical);
    drawingClusters(heuristicsClusters, colors3);
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

    if(document.getElementById('centroids_check').checked){
        drawingCentroids(kmeans.centroids);
    }
}

export function startDrawing() {
    document.getElementById('canvas').addEventListener('mousemove',drawingPoints);
    document.getElementById('canvas').addEventListener('mousedown',drawingPoints);   
}

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});
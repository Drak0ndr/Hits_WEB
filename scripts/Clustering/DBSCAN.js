import {heuristics} from "./drawingFunctions.js"

function findNeighbors(point, points, radius) {
    return points.filter(newPoint => newPoint !== point && heuristics(point, newPoint) <= radius);
}

export function dbscan(pointCoordinates, radius, minCountNeighbors) {
    let visitedMap = new Map();
    let allClusters = [];
    let wastes = new Set();

    function expandCluster(cluster, point) {
        cluster.push(point);
        let neighbors = findNeighbors(point, pointCoordinates, radius);
        
        neighbors.forEach(neighbor => {
            if (!visitedMap.has(neighbor)) {
                visitedMap.set(neighbor, true);
                cluster.push(neighbor);
                expandCluster(cluster, neighbor);
            }
        });
    }

    pointCoordinates.forEach(point => {
        if (!visitedMap.has(point)) {
            visitedMap.set(point, true);

            let neighbors = findNeighbors(point, pointCoordinates, radius);

            if (neighbors.length < minCountNeighbors) {
                wastes.add(point);

            } else {
                let newCluster = [];
                allClusters.push(newCluster);
                expandCluster(newCluster, point);
            }
        }
    });

    return allClusters.filter(cluster => cluster.length >= minCountNeighbors);
} 


import {heuristics} from "./drawingFunctions.js"

function findNeighbors(point, points, radius) {
    return points.filter(newPoint => newPoint !== point && heuristics(point, newPoint) <= radius);
}

export function dbscan(pointCoordinates, radius, minCountNeighbors) {
    let visitedSet = new Set();
    let wastes = new Set();
    let allClusters = [];

    function expandCluster(cluster, point, neighbors) {
        cluster.push(point);
     
        neighbors.forEach(neighbor => {
            if (!visitedSet.has(neighbor)) {
                visitedSet.add(neighbor);

                let newNeighbors = findNeighbors(neighbor, pointCoordinates, radius);

                if (newNeighbors.length >= minCountNeighbors) {
                    neighbors = neighbors.concat(newNeighbors);
                }

                expandCluster(cluster, neighbor, neighbors);
            }
        });
    }

    pointCoordinates.forEach(point => {
        if (!visitedSet.has(point)) {
            visitedSet.add(point);

            let neighbors = findNeighbors(point, pointCoordinates, radius);

            if (neighbors.length < minCountNeighbors) {
                wastes.add(point);

            } else {
                let newCluster = [];
                allClusters.push(newCluster);
                expandCluster(newCluster, point, neighbors);
            }
        }
    });

    return allClusters.filter(cluster => cluster.length >= minCountNeighbors);
} 


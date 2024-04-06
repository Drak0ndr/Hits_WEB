import {heuristics} from "./drawingFunctions.js"

function addNeighbors(point, pointCoordinates, radius) { 
    let neighbors = [];

    for (let i = 0; i < pointCoordinates.length; i++) { 
        if (point === pointCoordinates[i]) {
            continue;
        }
        
        if (heuristics(point, pointCoordinates[i]) <= radius) {
            neighbors.push(pointCoordinates[i]);
        }
    }
    return neighbors;
}

export function dbscan(pointCoordinates, radius, minCountNeighbors) {
    let visited = new Set();
    let wastes = new Set();
    let clusters = [];
    
    for (let i = 0; i < pointCoordinates.length; ++i) { 
        let currPoint = pointCoordinates[i];

        if (visited.has(currPoint)){
            continue;
        }

        visited.add(currPoint);

        let neighbors = addNeighbors(currPoint, pointCoordinates, radius);

        if (neighbors.length < minCountNeighbors) { 
            wastes.add(currPoint);

            continue;
        }

        let cluster = [currPoint];
        clusters.push(cluster);

        let possiblePoints = new Set(neighbors);

        while (possiblePoints.size > 0) { 
            let possiblePoint = possiblePoints.values().next().value;
            visited.add(possiblePoint);

            let checkingNeighbors = addNeighbors(possiblePoint, pointCoordinates, radius);

            if (checkingNeighbors.length >= minCountNeighbors) {
                for (let j = 0; j < checkingNeighbors.length; ++j) {
                    let neighbor = checkingNeighbors[j];

                    if (!visited.has(neighbor)) {
                        possiblePoints.add(neighbor);
                        visited.add(neighbor);
                    }
                }
            }
            

            if (!wastes.has(possiblePoint)) {
                cluster.push(possiblePoint);
            }
            
            possiblePoints.delete(possiblePoint);
        }
    }
    
    return clusters;
}
import {heuristics} from "./drawingFunctions.js"

function calculateDistance(firstCluster, secondCluster) {
    let totalDistance = 0;

    for (let firstPoint of firstCluster) {
        for (let secondPoint of secondCluster) {
            totalDistance += heuristics(firstPoint, secondPoint);
        }
    }

    return totalDistance / (firstCluster.length * secondCluster.length);
}

export function hierarchicalClustering(pointCoordinates, countClusters) {
    let clusters = pointCoordinates.map(coord => [coord]);

    while (clusters.length > countClusters) {
        let minDistance = Infinity;
        let minDistanceIndex;

        for (let i = 0; i < clusters.length - 1; ++i) {
            for (let j = i + 1; j < clusters.length; ++j) {
                let distance = calculateDistance(clusters[i], clusters[j]);

                if (distance < minDistance) {
                    minDistance = distance;
                    minDistanceIndex = [i, j];
                }
            }
        }

        let newCluster = clusters[minDistanceIndex[0]].concat(clusters[minDistanceIndex[1]]);
        clusters.push(newCluster);

        clusters.splice(Math.max(minDistanceIndex[0], minDistanceIndex[1]), 1);
        clusters.splice(Math.min(minDistanceIndex[0], minDistanceIndex[1]), 1);
    }

    return clusters;
}
export { hierarchicalClustering };
import {findDistance} from "./distance.js"

function  getDistanceBetweenClusters (clusters) {
    let distances = [];
    for (let i = 0; i < clusters.length - 1; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
            let distance = 0;

            for (let x of clusters[i]) {
                for (let y of clusters[j]) {
                    distance += findDistance(x, y);
                }           
            }
            
            distance /= (clusters[i].length * clusters[j].length);
            distances.push({distance, i, j});
        }
    }

    return distances;
}

function hierarchicalClustering(pointCoordinates, countClusters) {
    let clusters = pointCoordinates.map(coord => [coord]);

    while (clusters.length >  countClusters) {
        let distances =  getDistanceBetweenClusters(clusters);
  
        let minDistance = Infinity;
        let index;

        for (let i = 0; i < distances.length; ++i) {
            if (distances[i].distance < minDistance) {
                minDistance = distances[i].distance;
                index = i;
            }
        }
  
        let merged = clusters[distances[index].i].concat(clusters[distances[index].j]);
        clusters.push(merged);

        clusters.splice(distances[index].j, 1);
        clusters.splice(distances[index].i, 1);
    }

    return clusters;
}
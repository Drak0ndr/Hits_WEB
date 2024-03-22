export { kMeans };
import { Point } from "./class_point.js";
import { pointCoordinates} from "./clustering_main.js";
import {findDistance} from "./distance.js"

function generateInitialCentroids(countClusters) {
    let centroids = [pointCoordinates[Math.floor(Math.random() * pointCoordinates.length)]];

    for (let i = 0; i < countClusters - 1; i++) {
        let arrDistances = new Array(pointCoordinates.length);
        let sumDistances = 0;

        for (let j = 0; j < pointCoordinates.length; ++j) {
            let point = pointCoordinates[j];
            let minDistance = Infinity;

            for (let k = 0; k < centroids.length; ++k) {
                let distance = findDistance(point, centroids[k]);
                minDistance = Math.min(minDistance, distance);
            }

            arrDistances[j] = minDistance;
            sumDistances += minDistance;
        }

        let rand = Math.random() * sumDistances;
        sumDistances = 0;
        let nextCentroid;

        for (let n = 0; n < pointCoordinates.length; ++n) {
            sumDistances += arrDistances[n];

            if (sumDistances >= rand) {
                nextCentroid = pointCoordinates[n];
                break;
            }
        }

        centroids.push(nextCentroid);
    }

    return centroids;
}

function kMeans(countClusters) {
    let arrClusters = new Array(countClusters).fill().map(() => []);
    let centroids = generateInitialCentroids(countClusters);
    let converge = false;

    while (!converge) {
        for (let i = 0; i < arrClusters.length; i++) {
            arrClusters[i] = [];
        }

        for (let i = 0; i < pointCoordinates.length; i++) {

            let point = pointCoordinates[i];
            let minDistance = Infinity;
            let nearbyCentroid;
    
            for (let j = 0; j < centroids.length; j++) {
                let distance = findDistance(point, centroids[j]);
    
                if (distance < minDistance) {
                    minDistance = distance;
                    nearbyCentroid = centroids[j];
                }
            }
    
            arrClusters[centroids.indexOf(nearbyCentroid)].push(point);
        }
 
        let newCentroids = [];

        for (let i = 0; i < arrClusters.length; i++) {
            let cluster = arrClusters[i];

            if (cluster.length === 0) {
                newCentroids.push(centroids[i]);

            } else {
                let sumX = 0;
                let sumY = 0;

                for (let j = 0; j < cluster.length; j++) {
                    sumX += cluster[j].x;
                    sumY += cluster[j].y;
                }

                let newX = sumX / cluster.length;
                let newY = sumY / cluster.length;

                newCentroids.push(new Point(newX, newY));
            }
        }

        converge = true;
        
        for (let i = 0; i < centroids.length; i++) {
            if (findDistance(centroids[i], newCentroids[i]) > 0.01) {
                converge = false;
                break;
            }
        }
  
        centroids = newCentroids;
    }

    return { clusters: arrClusters, centroids: centroids};
}

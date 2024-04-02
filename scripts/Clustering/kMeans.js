import { pointCoordinates} from "./clusteringBasic.js";
import { Point, heuristics} from "./drawingFunctions.js";

function chooseCentroids(countClusters) {
    let centroids = [pointCoordinates[Math.floor(Math.random() * pointCoordinates.length)]]; // Выбираем случайный центоид из набора данных

    for (let i = 0; i < countClusters - 1; ++i) { // Выбираем оставшиеся центроиды
        let arrDistances = new Array(pointCoordinates.length);
        let sumDistances = 0;

        for (let j = 0; j < pointCoordinates.length; ++j) {
            let point = pointCoordinates[j];
            let minDistance = Infinity;

            for (let k = 0; k < centroids.length; ++k) {
                let distance = heuristics(point, centroids[k]);
                minDistance = Math.min(minDistance, distance);
            }

            arrDistances[j] = minDistance;
            sumDistances += minDistance;
        }

        let randomNumber = Math.random() * sumDistances;
        sumDistances = 0;
        let nextCentroid;

        for (let n = 0; n < pointCoordinates.length; ++n) {
            sumDistances += arrDistances[n];

            if (sumDistances >= randomNumber) {
                nextCentroid = pointCoordinates[n];
                break;
            }
        }

        centroids.push(nextCentroid);
    }

    return centroids;
}

export function kMeans(countClusters) {
    let arrClusters = new Array(countClusters).fill().map(() => []);
    let centroids = chooseCentroids(countClusters);
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
                let distance = heuristics(point, centroids[j]);
    
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
            if (heuristics(centroids[i], newCentroids[i]) > 0.01) {
                converge = false;
                break;
            }
        }
  
        centroids = newCentroids;
    }

    return { clusters: arrClusters, centroids: centroids};
}

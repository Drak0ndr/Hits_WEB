import { pointCoordinates} from "./clusteringBasic.js";
import { Point, heuristics} from "./drawingFunctions.js";

function chooseCentroids(countClusters) {
    let centroids = [pointCoordinates[Math.floor(Math.random() * pointCoordinates.length)]]; // Выбираем случайный центоид из набора данных

    for (let i = 1; i < countClusters; ++i) { // Выбираем оставшиеся центроиды
        let arrDistances = [];
        let sumDistances = 0;

        pointCoordinates.forEach(point => {
            let minDistance = Infinity;

            centroids.forEach(centroid => {
                let dist = heuristics(point, centroid);

                if (dist < minDistance) {
                    minDistance = dist;
                }

            });

            arrDistances.push(minDistance);
            sumDistances += minDistance;
        });


        let pick = Math.random() * sumDistances;
        let total = 0;

        for (let j = 0; j <  arrDistances.length; j++) {
            total +=  arrDistances[j];

            if (total >= pick) {
                centroids.push(pointCoordinates[j]);
                break;
            }

        }  
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
            let neighbor;
    
            for (let j = 0; j < centroids.length; j++) {
                let distance = heuristics(point, centroids[j]);
    
                if (distance < minDistance) {
                    minDistance = distance;
                    neighbor = centroids[j];
                }
            }
    
            arrClusters[centroids.indexOf(neighbor)].push(point);
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

                newCentroids.push(new Point(sumX / cluster.length, sumY / cluster.length));
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

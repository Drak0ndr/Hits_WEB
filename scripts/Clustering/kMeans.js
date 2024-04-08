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

        for (let j = 0; j <  arrDistances.length; ++j) {
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
    let converged = false;

    while (!converged) {
        arrClusters.forEach(cluster => cluster.length = 0);

        for (let point of pointCoordinates) {
            let minDistance = Infinity;
            let closestCentroid;
    
            for (let centroid of centroids) {
                let distance = heuristics(point, centroid);
    
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroid = centroid;
                }
            }
    
            arrClusters[centroids.indexOf(closestCentroid)].push(point);
        }

        let newCentroids = arrClusters.map(cluster => {
            if (cluster.length === 0) {
                return centroids[arrClusters.indexOf(cluster)];
            }
            
            let sum = cluster.reduce((sumPoints, point) => {
                sumPoints.x += point.x;
                sumPoints.y += point.y;
                return sumPoints;
            }, { x: 0, y: 0 });

            let newCoordX = sum.x / cluster.length;
            let newCoordY = sum.y / cluster.length;

            return new Point(newCoordX, newCoordY);
        });

        converged = true;
        
        for (let i = 0; i < centroids.length; i++) {
            if (heuristics(centroids[i], newCentroids[i]) > 0.001) {
                converged = false;
                break;
            }
        }
  
        centroids = newCentroids;
    }

    return { clusters: arrClusters, centroids };
}
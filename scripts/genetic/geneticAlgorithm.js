import { numberGenerations, populationSize, probabilityMutation } from "./driwingGenetic.js";

let arrVertexes = [];       
let arrPaths = []; 

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}  

function pathGeneration() {
    let path = Array.from({ length: arrVertexes.length }, (element, index) => index);

    for (let j = 0; j < arrVertexes.length; ++j) {
        let pos = getRandomNumber(j, arrVertexes.length); 
        [path[j], path[pos]] = [path[pos], path[j]];  
    }
   
    return path;
}

function findDistance(firstVertex, secondVertex) {
    return Math.sqrt((secondVertex.x - firstVertex.x)**2 + (secondVertex.y - firstVertex.y)**2);
}

function findPathDistance(path) {
    let distance = findDistance(arrVertexes[path[0]], arrVertexes[path[path.length - 1]]);

    for (let i = 0; i < path.length - 1; ++i) {
        distance += findDistance(arrVertexes[path[i]], arrVertexes[path[i + 1]]);
    }

    return distance;
}

function crossing(firstParent, secondParent) {
    let breakIndex = getRandomNumber(1, firstParent.length - 1);
    let child = [...firstParent.slice(0, breakIndex)];
    
    secondParent.forEach(gen => {
        if (!child.includes(gen)) {
            child.push(gen);
        }
    });

    if (getRandomNumber(1, 100) < probabilityMutation) {
        child = mutation(child);
    }
    
    return child;
}

function mutation(child) {
    let firstGen = getRandomNumber(0, child.length); 
    let secondGen = getRandomNumber(0, child.length);

    while (firstGen === secondGen) {
        secondGen = getRandomNumber(0, child.length);
    }

    [child[firstGen], child[secondGen]] = [child[secondGen], child[firstGen]]

    return child;
}

function sortPaths(arrDistances) {
    for (let i = 0; i < arrDistances.length - 1; ++i) {
        for (let j = i + 1; j < arrDistances.length; ++j) {

            if (arrDistances[i] > arrDistances[j]) {
                [arrPaths[i], arrPaths[j]] = [arrPaths[j], arrPaths[i]] ;
                [arrDistances[i], arrDistances[j]] = [arrDistances[j], arrDistances[i]];
            }

        }
    }
}

export function findMinPath(vertexes, paths) {
    let arrDistances = [];
    arrVertexes = vertexes;
    arrPaths = paths;

    if (vertexes.length < 2) {
        return;
    }

    if (arrPaths.length === 0) {
        arrPaths = Array.from({ length: numberGenerations }, () => pathGeneration());
    }   

    for (let i = 0; i < populationSize; ++i) {
        let firstParent = getRandomNumber(0, numberGenerations);
        let secondParent = getRandomNumber(0, numberGenerations);

        while (firstParent === secondParent){
            secondParent = getRandomNumber(0, numberGenerations);
        }

        arrPaths.push(crossing(arrPaths[firstParent], arrPaths[secondParent]));
    }

    arrDistances = arrPaths.map(path => findPathDistance(path));
    sortPaths(arrDistances);

    for (let i = 0; i < populationSize; ++i) {
        arrPaths.pop();
    }

    return arrPaths;
};

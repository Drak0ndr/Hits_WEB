import { fieldPixelsSize, startСoordinates, finishCoordinates, ctx, cellSize, markedCells } from "./aStarBasic.js";
import { Cell } from "./classes.js";

let currDistance = 1;

function findDistance(firstPoint, secondPoint) {
    let distance = 0;
    let x = firstPoint.posX - secondPoint.posX;
    let y = firstPoint.posY - secondPoint.posY;

    if (currDistance === 1){
        distance = Math.sqrt(x**2 + y**2);

    }else if(currDistance === 2){
        distance = Math.abs(x) + Math.abs(y);

    }else{
        distance = Math.max(Math.abs(x), Math.abs(y));
    }
    
    return distance;
}

function comparisonDistances(firstCell, secondCell) {
    if (firstCell.sumDistances > secondCell.sumDistances){
        return 1;

    }else if (firstCell.sumDistances < secondCell.sumDistances){
        return -1;
    }

    return 0;
}

export async function aStar() {
    let count = 0;
    // 1 - empty, 2 - wall
    let map = [];

    for(let i = 0; i < fieldPixelsSize * fieldPixelsSize; ++i){
        map[i] = 1;
    }

    for(let i = 0; i < markedCells.length; ++i){
        let j = markedCells[i].cellNumber;
        map[j - 1] = 2; 
    }

    if(count >= Math.floor(fieldPixelsSize / 8)){
        await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
        count = 0;
    }

    ++count; 
    
    let openList = [startСoordinates[0]]; // Клетки, которые предстоит проверить.
    let closedList = []; // Клетки, которые больше не нужно проверять.

    let current = new Cell();
    
    while (openList.length > 0) {
        openList.sort(comparisonDistances);

        current = openList[0];
    
        openList.splice(openList.indexOf(current), 1);

        closedList.push(current);

        if (!(current.posX === startСoordinates[0].posX && current.posY === startСoordinates[0].posY) && 
            !(current.posX === finishCoordinates[0].posX  && current.posY === finishCoordinates[0].posY)) {

            ctx.fillStyle = '#FCBB42';
            ctx.fillRect(current.vertex1.x, current.vertex1.y, cellSize, cellSize); 

            if(count >= Math.floor(fieldPixelsSize / 8)){
                await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
                count = 0;
            }

            ++count; 
        }

        if (current.posX === finishCoordinates[0].posX  && current.posY === finishCoordinates[0].posY) {
            break;
        }

        let directions = [];

        if (current.posX > 0) {
            directions.push([-1, 0]);
        }

        if (current.posX < fieldPixelsSize - 1) {
            directions.push([1, 0]);
        }

        if (current.posY > 0) {
            directions.push([0, -1]);
        }

        if (current.posY < fieldPixelsSize - 1) {
            directions.push([0, 1]);
        }

        for (let direction = 0; direction < directions.length; ++direction) {

            let newNeighbour = new Cell(current.vertex1.x + directions[direction][0] * cellSize, 
                current.vertex1.y + directions[direction][1] * cellSize, cellSize,
                (current.posY + directions[direction][1]) * fieldPixelsSize +  (current.posX + directions[direction][0]) + 1);

            let neighbour = openList.find(cell => {
                return cell.posX === newNeighbour.posX && cell.posY === newNeighbour.posY;
            });
            
            let usedCell = closedList.find(cell => {
                return cell.posX === newNeighbour.posX && cell.posY === newNeighbour.posY;
            });

            if (usedCell === undefined && map[newNeighbour.posY * fieldPixelsSize + newNeighbour.posX] === 1) {

                if (neighbour === undefined) {

                    if(!(newNeighbour.posX === finishCoordinates[0].posX && newNeighbour.posY === finishCoordinates[0].posY))
                        ctx.fillStyle = '#FFCE54';
                        ctx.fillRect(newNeighbour.vertex1.x, newNeighbour.vertex1.y, cellSize, cellSize);

                        if(count >= Math.floor(fieldPixelsSize / 8)){
                            await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
                            count = 0;
                        }
        
                        ++count; 

                    newNeighbour.distanceToStart = current.distanceToStart + 10;
                    newNeighbour.distanceToFinish = findDistance(newNeighbour, finishCoordinates[0]) * 10;
                    newNeighbour.sumDistances = newNeighbour.distanceToStart + newNeighbour.distanceToFinish;

                    newNeighbour.parent = current;
                    openList.push(newNeighbour);
                    
                } else {
                    if (neighbour.distanceToStart >= current.distanceToStart + 10) {
                        openList[openList.indexOf(neighbour)].distanceToStart = current.distanceToStart + 10;
                        openList[openList.indexOf(neighbour)].parent = current;
                    }
                }
            }
        }
    }

    
    if (!(current.posX === finishCoordinates[0].posX && current.posY === finishCoordinates[0].posY)) {
        alert(`Очень жаль, но пути нет 🤷`);
    
    } else {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(finishCoordinates[0].vertex1.x, finishCoordinates[0].vertex1.y, cellSize, cellSize);
    
        let k = 0;
        for(;current.parent != null; current = current.parent) {
            
            if (!(current.posX === finishCoordinates[0].posX && current.posY === finishCoordinates[0].posY)){
                ctx.fillStyle = 'white';
                ctx.fillRect(current.vertex1.x, current.vertex1.y, cellSize, cellSize);

                ++k;

                if(count >= Math.floor(fieldPixelsSize / 8)){
                    await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
                    count = 0;
                }

                count++;
            }
        }

        document.getElementById("ansver").textContent = "Минимальная длина пути: " + k; 
    }   
}

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});
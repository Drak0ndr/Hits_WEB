import { fieldPixelsSize, startСoordinates, finishCoordinates, ctx, cellSize, markedCells } from "./aStarBasic.js";
import { Cell } from "./classes.js";

let currDistance = 1;

function findDistance(firstPoint, secondPoint) {
    let x = firstPoint.posX - secondPoint.posX;
    let y = firstPoint.posY - secondPoint.posY;

    return currDistance === 1 ? Math.abs(x) + Math.abs(y) : currDistance === 2 ? 
    Math.sqrt(x**2 + y**2) : Math.max(Math.abs(x), Math.abs(y));
}

export async function aStar() {
    let count = 0;
    let map = []; // 1 - empty, 2 - wall

    for(let i = 0; i < fieldPixelsSize * fieldPixelsSize; ++i){
        map[i] = 1;
    }

    for(let i = 0; i < markedCells.length; ++i){
        map[markedCells[i].cellNumber - 1] = 2; 
    }

    let openList = [startСoordinates[0]]; // Клетки, которые предстоит проверить.
    let closedList = []; // Клетки, которые больше не нужно проверять.

    let current = new Cell();
    
    while (openList.length > 0) {

        openList.sort(function(firstCell, secondCell){
            return (firstCell.sumDistances > secondCell.sumDistances) ? 1 : 
            (firstCell.sumDistances < secondCell.sumDistances) ? -1 : 0;
        });

        current = openList[0];

        openList.splice(openList.indexOf(current), 1);

        closedList.push(current);

        if (current.posX === finishCoordinates[0].posX  && current.posY === finishCoordinates[0].posY) {
            break;
        }

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

            if (usedCell === undefined && neighbour === undefined 
                && map[newNeighbour.posY * fieldPixelsSize + newNeighbour.posX] === 1) {

                if(!(newNeighbour.posX === finishCoordinates[0].posX && newNeighbour.posY === finishCoordinates[0].posY)){
                    ctx.fillStyle = '#FFCE54';
                    ctx.fillRect(newNeighbour.vertex1.x, newNeighbour.vertex1.y, cellSize, cellSize);

                    if(count >= Math.floor(fieldPixelsSize / 8)){
                        await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
                        count = 0;
                    }
    
                    ++count; 
                }

                newNeighbour.distanceToStart = current.distanceToStart + 1;
                newNeighbour.distanceToFinish = findDistance(newNeighbour, finishCoordinates[0]);
                newNeighbour.sumDistances = newNeighbour.distanceToStart + newNeighbour.distanceToFinish;

                newNeighbour.parent = current;
                openList.push(newNeighbour);
            }
        }
    }

    if (!(current.posX === finishCoordinates[0].posX && current.posY === finishCoordinates[0].posY)) {
        alert(`Очень жаль, но пути нет 🤷`);
    
    } else {
        let foundPath = [];

        for(;current.parent != null; current = current.parent) {
            
            if (!(current.posX === finishCoordinates[0].posX && current.posY === finishCoordinates[0].posY)){
                foundPath.push(current);
            }
        }

        let distancePath = 0;

        for(let i = foundPath.length - 1; i >= 0; --i){
            ctx.fillStyle = 'white';
            ctx.fillRect(foundPath[i].vertex1.x, foundPath[i].vertex1.y, cellSize, cellSize);

            ++distancePath;

            if(count >= Math.floor(fieldPixelsSize / 8)){
                await new Promise((resolve, reject) => setTimeout(resolve, 101 - document.getElementById('animation_range').value));
                count = 0;
            }

            count++;
        }

        document.getElementById("ansver").textContent = "Минимальная длина пути: " + distancePath; 
    }   
}

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});
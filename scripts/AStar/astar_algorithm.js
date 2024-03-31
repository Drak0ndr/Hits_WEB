import { fieldPixelsSize, startСoordinates, finishCoordinates, arrCoordinates, ctx, cellSize, markedCells } from "./aStar_main.js";
import { Cell } from "./classes.js";

let currDistance = 1;

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});




function isInside(x, y){
    return (x >= 0 && x <= fieldPixelsSize && y >= 0 && y <= fieldPixelsSize) ? true : false;
}



function sleep(milliseconds) {
    return new Promise((resolve) => {setTimeout(() => resolve(), milliseconds);});
}

export async function aStar() {
    if(startСoordinates.length == 0 && finishCoordinates.length == 0){
		alert("Установите старт и финиш и попробуйте заново");
        return 0;
	}
	else if(finishCoordinates.length == 0){
		alert("Установите финиш и попробуйте заново");
        return 0;

	}else if(startСoordinates.length == 0){
		alert("Установите старт и попробуйте заново");
        return 0;

    }else{
        /* 1 - empty
	    2 - wall*/

        let map = [];
        for(let i = 0; i < fieldPixelsSize * fieldPixelsSize; ++i){
            map[i] = 1;

        }

        for(let i = 0; i < markedCells.length; ++i){
            let j = markedCells[i].cellNumber;
            map[j - 1] = 2; 
        }
        

        console.log(map)

       

        function heuristic(firstPoint, secondPoint) {
            let distance = 0;
        
            if (currDistance == 1){
                let x = firstPoint.posX - secondPoint.posX;
                let y = firstPoint.posY - secondPoint.posY;
                distance = Math.sqrt(x**2 + y**2)
        
            }else if(currDistance === 2){
                distance = Math.abs(firstPoint.posX - secondPoint.posX) + Math.abs(firstPoint.posY - secondPoint.posY);
        
            }else{
                distance = Math.max(Math.abs(firstPoint.posX - secondPoint.posX), Math.abs(firstPoint.posY - secondPoint.posY));
            }
            
            return distance;
        }


        function compare(a, b) {
            if (a.sumDistances < b.sumDistances)
                return -1;
            if (a.sumDistances > b.sumDistances)
                return 1;
            else
                return 0;
        }


     
        let count = 0;
        /* console.log(startСoordinates) */

        let stNode = new Cell(startСoordinates[0].vertex1.x, startСoordinates[0].vertex1.y, cellSize, startСoordinates[0].cellNumber);
        /* console.log(stNode) */
    

        let openList = [];
        openList.push(stNode)

    /*  console.log(openList[0]) */

   
        let usedList = [];

        let current = new Cell();
        

    
        while (openList.length > 0) {
            openList.sort(compare);
            

       
            current = openList[0];
            /* console.log(current) */
            openList.splice(openList.indexOf(current), 1);
            /* console.log(openList) */
            usedList.push(current);
            /* console.log(usedList[0]) */

            if(count >= Math.floor(fieldPixelsSize / 10)){
                await sleep(101 - Number(70));
                count = 0;
            }
            count++;

            /* console.log(finishCoordinates[0]) */

            /* console.log(current) */

            if (!(current.posX == startСoordinates[0].posX && current.posY == startСoordinates[0].posY) && 
            !(current.posX == finishCoordinates[0].posX  && current.posY == finishCoordinates[0].posY)) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(current.vertex1.x, current.vertex1.y, cellSize, cellSize); 
                /* console.log(current) */
            }


       
            if (current.posX == finishCoordinates[0].posX  && current.posY == finishCoordinates[0].posY) {
                break;
            }
        /*  console.log(current) */
        

         
            let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            for (let dir = 0; dir < directions.length; ++dir) {
                /* console.log(current) */
                var newNeighbour = new Cell(current.vertex1.x + directions[dir][0] * cellSize, current.vertex1.y + directions[dir][1] * cellSize, cellSize,
                    (current.posY + directions[dir][1]) * fieldPixelsSize +  (current.posX + directions[dir][0]) + 1);

                /* console.log(newNeighbour) */
                
                if((Math.round(current.vertex1.x) + Math.round(directions[dir][0] * cellSize)) >= 0 && (Math.round(current.vertex1.y) + Math.round(directions[dir][1] * cellSize)) >= 0 &&
                (Math.round(current.vertex1.x) + Math.round(directions[dir][0] * cellSize)) <= Math.round(fieldPixelsSize * cellSize) && 
                (Math.round(current.vertex1.y) + Math.round(directions[dir][1] * cellSize)) <= Math.round(fieldPixelsSize * cellSize)){
                    
                    let isUsed = usedList.find(node => (node.posX == newNeighbour.posX && node.posY == newNeighbour.posY));
                    let neighbour = openList.find(node => (node.posX == newNeighbour.posX && node.posY == newNeighbour.posY));

                /*  console.log(map) */

                    
                    if (isInside(newNeighbour.posX, newNeighbour.posY) && map[newNeighbour.posY * fieldPixelsSize + newNeighbour.posX] == 1 && 
                    isUsed == null) {
                        if (neighbour == null) {

                            if(!(newNeighbour.posX == finishCoordinates[0].posX && newNeighbour.posY == finishCoordinates[0].posY))
                                ctx.fillStyle = 'white';
                                ctx.fillRect(newNeighbour.vertex1.x, newNeighbour.vertex1.y, cellSize, cellSize);

                            newNeighbour.distanceToStart = current.distanceToStart + 1;
                            newNeighbour.distanceToFinish = heuristic(newNeighbour, finishCoordinates[0]);
                            newNeighbour.sumDistances = newNeighbour.distanceToStart + newNeighbour.distanceToFinish;

                            newNeighbour.parent = current;
                            openList.push(newNeighbour);
                           
                        } else {
                            if (neighbour.distanceToStart >= current.distanceToStart + 1) {
                                openList[openList.indexOf(neighbour)].distanceToStart = current.distanceToStart + 1;
                                openList[openList.indexOf(neighbour)].parent = current;
                            }
                        }
                        /* console.log(newNeighbour) */
                    }
                }

                
                
            }
        }

        // Отрисовка пути
        if (!(current.posX == finishCoordinates[0].posX && current.posY == finishCoordinates[0].posY)) {
            alert(`Пути нет`);
        
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(finishCoordinates[0].vertex1.x, finishCoordinates[0].vertex1.y, cellSize, cellSize);
            /* console.log(finishCoordinates[0]) */
            for(;current.parent != null; current = current.parent) {
                /* console.log(current.parent) */

                if(count >= Math.floor(fieldPixelsSize / 10)){
                    await sleep(101 - Number(70));
                    count = 0;
                }
                count++;

                if (!(current.posX == finishCoordinates[0].posX && current.posY == finishCoordinates[0].posY))
                ctx.fillStyle = 'pink';
                ctx.fillRect(current.vertex1.x, current.vertex1.y, cellSize, cellSize);
            }
            
        }
    }
}
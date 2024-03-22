let currDistance = 1;

document.getElementById('distance_select').addEventListener('change', (event) => {
    currDistance = parseInt(event.target.value);
});

export function findDistance(firstPoint, secondPoint) {
    let distance = 0;

    if (currDistance == 1){
        let x = firstPoint.x - secondPoint.x;
        let y = firstPoint.y - secondPoint.y;
        distance = Math.sqrt(x**2 + y**2)

    }else if(currDistance === 2){
        distance = Math.abs(firstPoint.x - secondPoint.x) + Math.abs(firstPoint.y - secondPoint.y);

    }else{
        distance = Math.max(Math.abs(firstPoint.x - secondPoint.x), Math.abs(firstPoint.y - secondPoint.y));
    }
    
    return distance;
}






   
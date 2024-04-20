export function generateMaze (numberColumns, numberRows) {
    function isEven(n) {
        return n % 2 === 0;
    }
    function getRandomElement(arr) {
        let index = Math.floor(Math.random() * arr.length);
        return arr[index]; 
    }
	function addPath(x, y, value) {
		if (x < 0 || x >= numberColumns || y < 0 || y >= numberRows) {
			return null;
		}
	
		map[y][x] = value;
	}

	function getValue (x, y) {
		if (x < 0 || x >= numberColumns || y < 0 || y >= numberRows) {
			return null;
		}

		return map[y][x];
	}

	function isMaze () {
		for (let x = 0; x < numberColumns; x++) {
			for (let y = 0; y < numberRows; y++) {

				if (isEven(x) && isEven(y) && getValue(x, y) === 'wall') {
					return false;
				}

			}
		}
	
		return true;
	}

	// Функция очищает путь. Мы должны двигаться на 2 клетки, если вторая клетка со стеной, то нужно очистить первую и вторую.
	function moveCleaner () { 
		let directions = [];

		if (cleaner.x > 0) {
			directions.push('left');
		}

		if (cleaner.x < numberColumns - 2) {
			directions.push('right');
		}

		if (cleaner.y > 0) {
			directions.push('up');
		}

		if (cleaner.y < numberRows - 2) {
			directions.push('down');
		}

		let direct = getRandomElement(directions); // Cлучайным образом выбираем направление, в котором можно пойти.

		switch (direct) {
			case 'left':
				if (getValue(cleaner.x - 2, cleaner.y) === 'wall') {
					addPath(cleaner.x - 1, cleaner.y, 'space');
					addPath(cleaner.x - 2, cleaner.y, 'space');
				}

				cleaner.x -= 2;
				break;

			case 'right':
				if (getValue(cleaner.x + 2, cleaner.y) === 'wall') {
					addPath(cleaner.x + 1, cleaner.y, 'space');
					addPath(cleaner.x + 2, cleaner.y, 'space');
				}

				cleaner.x += 2;
				break;
				
			case 'up':
				if (getValue(cleaner.x, cleaner.y - 2) === 'wall') {
					addPath(cleaner.x, cleaner.y - 1, 'space');
					addPath(cleaner.x, cleaner.y - 2, 'space');
				}

				cleaner.y -= 2
				break

			case 'down':
				if (getValue(cleaner.x, cleaner.y + 2) === 'wall') {
					addPath(cleaner.x, cleaner.y + 1, 'space');
					addPath(cleaner.x, cleaner.y + 2, 'space');
				}

				cleaner.y += 2;
				break;
		}
	}


	let map = [];
	
	for (let y = 0; y < numberRows; ++y) {
		let row = [];

		for (let x = 0; x < numberColumns; ++x) {
			row.push('wall');
		}

		map.push(row);
	}

	let columnArray = Array(numberColumns).fill(0);
	let filteredColumnArray = columnArray.map((item, index) => index).filter(x => isEven(x));
	let startX = getRandomElement(filteredColumnArray);

	let rowArray = Array(numberRows).fill(0);
	let filteredRowArray = rowArray.map((item, index) => index).filter(x => isEven(x));
	let startY = getRandomElement(filteredRowArray);

	let cleaner = { x: startX, y: startY };

	addPath(startX, startY, 'space'); // Добавляем начальную пустую клетку.

	while (!isMaze()) { // Если лабиринт ещё не готов, продолжаем двигаться.
		moveCleaner();
	}

	return map;
}
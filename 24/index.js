const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const tiles = input.trim().split('\n');
const DIRECTIONS = {
    'e': [1, 1, 0],
    'se': [1, 0, -1],
    'sw': [0, -1, -1],
    'w': [-1, -1, 0],
    'nw': [-1, 0, 1],
    'ne': [0, 1, 1],
};

function expandTileDirections(str) {
    let neighbours = [];

    while (str.length) {
        if (str.startsWith('e') || str.startsWith('w')) {
            neighbours.push(str.substring(0, 1));
            str = str.substring(1);
        } else if (str.startsWith('n') || str.startsWith('s')) {
            neighbours.push(str.substring(0, 2));
            str = str.substring(2);
        }
    }

    return neighbours;
}

function flipColor(color) {
    return color === 'white' ? 'black' : 'white';
}

function answerPartOne() {
    const tileColors = {};

    for (const tile of tiles) {
        const tileCoordinate = expandTileDirections(tile).reduce((acc, cur) => {
            return [acc[0] + DIRECTIONS[cur][0], acc[1] + DIRECTIONS[cur][1], acc[2] + DIRECTIONS[cur][2]];
        }, [0, 0, 0]).toString();
        let flippedColor = 'black';

        if (tileColors[tileCoordinate]) {
            flippedColor = flipColor(tileColors[tileCoordinate]);
        }

        tileColors[tileCoordinate] = flippedColor;
    }

    const blackTiles = Object.keys(tileColors).reduce((acc, cur) => acc += tileColors[cur] === 'black' ? 1 : 0, 0);

    return blackTiles;
}

function getTileNeighbours(tileCoordinate) {
    return Object.keys(DIRECTIONS).map(x => [tileCoordinate[0] + DIRECTIONS[x][0], tileCoordinate[1] + DIRECTIONS[x][1], tileCoordinate[2] + DIRECTIONS[x][2]]);
}

function answerPartTwo() {
    let blackTiles = new Set();

    for (const tile of tiles) {
        const tileCoordinate = expandTileDirections(tile).reduce((acc, cur) => {
            return [acc[0] + DIRECTIONS[cur][0], acc[1] + DIRECTIONS[cur][1], acc[2] + DIRECTIONS[cur][2]];
        }, [0, 0, 0]).toString();

        if (blackTiles.has(tileCoordinate)) {
            blackTiles.delete(tileCoordinate);
        } else {
            blackTiles.add(tileCoordinate);
        }
    }

    const TOTAL_DAYS = 100;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
        newBlackTiles = new Set();

        const keys = blackTiles.keys();

        for (const tile of keys) {
            const tileCoordinate = tile.split(',').map(Number);
            const cellsAround = getTileNeighbours(tileCoordinate);

            cellsAround.push(tileCoordinate);

            for (const cell of cellsAround) {
                const currentId = cell.toString();
                const neighbours = getTileNeighbours(cell);
                const totalBlackTiles = neighbours.filter(x => blackTiles.has(x.toString())).length;

                if (blackTiles.has(currentId)) {
                    if (totalBlackTiles === 0 || totalBlackTiles > 2) {
                        newBlackTiles.delete(currentId);
                    } else {
                        newBlackTiles.add(currentId);
                    }
                } else {
                    if (totalBlackTiles === 2) {
                        newBlackTiles.add(currentId);
                    }
                }
            }
        }

        blackTiles = newBlackTiles;
    }

    return blackTiles.size;
}

console.log('How many tiles are left with the black side up?', answerPartOne());
console.log('How many tiles will be black after 100 days?', answerPartTwo());

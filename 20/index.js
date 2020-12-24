const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const puzzleInput = input.trim().split('\n\n');

function extractEdges(imageTile) {
    const result = [imageTile[0], imageTile[imageTile.length - 1], imageTile.map((tile) => tile.substring(0, 1)).join(''), imageTile.map((tile) => tile.substring(tile.length - 1)).join('')]
    return result.concat(result.map((edge) => reverseString(edge)));
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

function matchingTiles(tile1, tile2) {
    for (let i = 0; i < tile1.edges.length; i++) {
        const edge1 = tile1.edges[i];
        for (let j = 0; j < tile2.edges.length; j++) {
            const edge2 = tile2.edges[j];
            if (edge1 === edge2) {
                return edge1;
            }
        }
    }
    return null;
}

function answerPartOne() {
    const tiles = [];

    for (const input of puzzleInput) {
        const [tileName, ...imageTile] = input.split('\n');
        const { groups } = /^Tile (?<tileNumber>\d+):$/.exec(tileName);
        tiles.push({
            id: Number(groups.tileNumber),
            imageTile,
            edges: extractEdges(imageTile),
            matches: [],
        });
    }

    for (let i = 0; i < tiles.length; i++) {
        const tile1 = tiles[i];
        for (let j = i + 1; j < tiles.length; j++) {
            const tile2 = tiles[j];
            const match = matchingTiles(tile1, tile2);

            if (match) {
                tile1.matches.push({
                    id: tile2.id,
                    edge: match,
                });
                tile2.matches.push({
                    id: tile1.id,
                    edge: match,
                });
            }
        }
    }

    let product = 1;
    const cornerTiles = tiles.filter((tile) => tile.matches.length === 2);
    
    for (const tile of cornerTiles) {
        product *= tile.id;
    }
    
    return product;
}

console.log('What do you get if you multiply together the IDs of the four corner tiles?', answerPartOne());

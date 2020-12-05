const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const countTrees = ({ right, down, puzzleInput }) => {
  let column = 0;
  let treesCount = 0;

  for (let index = 0; index < puzzleInput.length; index = index + down) {
    if (index !== 0) {
      const row = puzzleInput[index];
      const repeat = column < row.length ? 1 : column / row.length + 1;
      const mapRow = row.repeat(repeat);
      const isTree = mapRow.split('')[column] === '#';

      if (isTree) {
        treesCount = treesCount + 1;
      }
    }

    column = column + right;
  }

  console.log('Trees Count:', treesCount);

  return treesCount;
};

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ];
  const product = slopes.reduce((acc, cur) => acc * countTrees({ ...cur, puzzleInput }), 1);

  console.log('Product:', product);
};

main().catch(console.error);

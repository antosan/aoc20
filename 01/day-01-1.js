const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const getEntries = (inputData) => {
  let first;
  let second;

  for (let i = 0; i < inputData.length; i++) {
    const nextIndex = i + 1;

    first = inputData[i];

    for (let j = nextIndex; j < inputData.length; j++) {
      second = inputData[j];

      if (first + second === 2020) {
        console.log(first, '+', second, '=', first + second);
        return { first, second };
      }
    }
  }

  throw new Error('No two entries sum to 2020');
};

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const inputData = input.split('\n').map(Number);

  const { first, second } = getEntries(inputData);

  console.log(first * second);
};

main();

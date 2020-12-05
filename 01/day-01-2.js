const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const getEntries = (inputData) => {
  let first;
  let second;
  let third;

  for (let i = 0; i < inputData.length; i++) {
    const nextIndex = i + 1;

    first = inputData[i];

    for (let j = nextIndex; j < inputData.length; j++) {
      const nextNextIndex = j + 1;

      second = inputData[j];

      for (let k = nextNextIndex; k < inputData.length; k++) {
        third = inputData[k];

        if (first + second + third === 2020) {
          console.log(first, '+', second, '+', third, '=', first + second + third);
          return { first, second, third };
        }
      }
    }
  }

  throw new Error('No three entries sum to 2020');
};

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const inputData = input.split('\n').map(Number);

  const { first, second, third } = getEntries(inputData);

  console.log(first * second * third);
};

main();

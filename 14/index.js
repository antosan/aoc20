const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  function answerPartOne() {
    let memoryAddresses = {};
    let mask = '';

    puzzleInput.forEach((input) => {
      if (input.startsWith('mask')) {
        mask = input.split(' = ')[1];
      }
      if (input.startsWith('mem')) {
        const address = Number(input.split(' = ')[0].match(/(\d+)/)[0]);
        const value = Number(input.split(' = ')[1]);
        const valueBinary = value.toString(2).padStart(36, '0');
        const result = parseInt(
          mask
            .split('')
            .map((m, i) => (m === 'X' ? valueBinary[i] : m))
            .join(''),
          2,
        );

        memoryAddresses = { ...memoryAddresses, [address]: result };
      }
    });

    return Object.keys(memoryAddresses).reduce((acc, cur) => (acc += memoryAddresses[cur]), 0);
  }

  // https://stackoverflow.com/a/39734979/3999408
  function getCombinations(length) {
    const combinations = [];

    for (let i = 0; i < 1 << length; i++) {
      let boolArr = [];

      for (let j = length - 1; j >= 0; j--) {
        boolArr.push(Boolean(i & (1 << j)) ? 1 : 0);
      }

      combinations.push(boolArr);
    }

    return combinations;
  }

  function answerPartTwo() {
    let memoryAddresses = {};
    let mask = '';

    puzzleInput.forEach((input) => {
      if (input.startsWith('mask')) {
        mask = input.split(' = ')[1];
      }
      if (input.startsWith('mem')) {
        const address = Number(input.split(' = ')[0].match(/(\d+)/)[0]);
        const value = Number(input.split(' = ')[1]);
        const addressBinary = address.toString(2).padStart(36, '0');
        const resultBinary = mask
          .split('')
          .map((m, i) => (m === '0' ? addressBinary[i] : m))
          .join('');
        const floatingBitsCount = resultBinary.split('').reduce((acc, cur) => (acc += cur === 'X' ? 1 : 0), 0);
        const addresses = getCombinations(floatingBitsCount).map((comb) => {
          return parseInt(
            comb.reduce((acc, cur) => acc.replace('X', cur), resultBinary),
            2,
          );
        });
        const addressValues = addresses.reduce((acc, cur) => ({ ...acc, [cur]: value }), {});

        memoryAddresses = { ...memoryAddresses, ...addressValues };
      }
    });

    return Object.keys(memoryAddresses).reduce((acc, cur) => (acc += memoryAddresses[cur]), 0);
  }

  console.log('What is the sum of all values left in memory after it completes? (Part 1)', answerPartOne());
  console.log('What is the sum of all values left in memory after it completes? (Part 2)', answerPartTwo());
};

main().catch(console.error);

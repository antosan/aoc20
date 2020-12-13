// input is your adapters output joltage
// Adapter can take 1, 2, 3 jolts lower

// Device has inbuild adapter 3 jolts higher than the highest adapter
// e.g. 3, 9, 6 ==> 12

// charging outlet near seat has rating = 0

// INSTRUCTION: Use every adapter in your bag (input) at once

// Distribution of joltage differences

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function getDifferences(puzzleInput) {
  const highestAdapterJoltage = Math.max(...puzzleInput);
  let currentAdapterJoltage = 0;
  const connectedAdapters = [];

  while (currentAdapterJoltage < highestAdapterJoltage) {
    const remainingAdapters = puzzleInput.filter((adapter) => !connectedAdapters.includes(adapter));
    const validNextAdapters = remainingAdapters.filter((adapter) =>
      [1, 2, 3].map((x) => currentAdapterJoltage + x).includes(adapter),
    );
    const nextAdapterJoltage = Math.min(...validNextAdapters);

    console.log(validNextAdapters);

    connectedAdapters.push({
      joltage: nextAdapterJoltage,
      difference: nextAdapterJoltage - currentAdapterJoltage,
    });
    currentAdapterJoltage = nextAdapterJoltage;
  }

  // console.log(connectedAdapters);

  const noOf1JoltDifferences = connectedAdapters.reduce((acc, cur) => (acc += cur.difference === 1 ? 1 : 0), 0);
  const noOf3JoltDifferences = connectedAdapters.filter((x) => x.difference === 3).length + 1;

  console.log({ noOf1JoltDifferences, noOf3JoltDifferences });

  return { noOf1JoltDifferences, noOf3JoltDifferences };
}

function getDistinctArrangements(puzzleInput) {
  const highestAdapterJoltage = Math.max(...puzzleInput);
  let currentAdapterJoltage = 0;
  const connectedAdapters = [];
  const validAdapters = [];

  while (currentAdapterJoltage < highestAdapterJoltage) {
    const remainingAdapters = puzzleInput.filter((adapter) => !connectedAdapters.includes(adapter));
    const validNextAdapters = remainingAdapters.filter((adapter) =>
      [1, 2, 3].map((x) => currentAdapterJoltage + x).includes(adapter),
    );
    const nextAdapterJoltage = Math.min(...validNextAdapters);

    // console.log(validNextAdapters);

    validAdapters.push(validNextAdapters.length === 1 ? validNextAdapters[0] : validNextAdapters);

    connectedAdapters.push({
      joltage: nextAdapterJoltage,
      difference: nextAdapterJoltage - currentAdapterJoltage,
    });
    currentAdapterJoltage = nextAdapterJoltage;
  }

  // console.log(validAdapters);

  const arrayIndexes = [];
  validAdapters.forEach((y, i) => {
    if (Array.isArray(y)) {
      arrayIndexes.push(i);
    }
  });

  const noOfArrays = validAdapters.filter((x) => Array.isArray(x));
  const allPossibleArrangements = getCombn(noOfArrays).map((x) => {
    const indices = x.substring(1).split(':').map(Number);
    let currentArrangement = [...validAdapters];

    // console.log('before', currentArrangement);

    arrayIndexes.forEach((z, i) => {
      // console.log('validAdapters[i - 1]', validAdapters[i - 1]);
      // console.log('Array.isArray(validAdapters[i])', Array.isArray(validAdapters[i]));

      // console.log(z, i, validAdapters[i - 1], indices[i]);

      if (
        validAdapters[z - 1] &&
        // Array.isArray(validAdapters[z]) &&
        [1, 2, 3].map((x) => validAdapters[z - 1] + x).includes(indices[i])
      ) {
        currentArrangement = [...currentArrangement.slice(0, z), indices[i], ...currentArrangement.slice(z + 1)];
      } else {
        currentArrangement = [...currentArrangement.slice(0, z), ...currentArrangement.slice(z + 1)];
      }
    });
    // console.log('after', currentArrangement);

    return cleanupArrangement(currentArrangement.join(','));
  });

  const allPossibleArrangements2 = [...new Set(allPossibleArrangements)];

  // console.log(allPossibleArrangements2, allPossibleArrangements2.length);

  // const validArrangements = allPossibleArrangements.filter(isValidArrangement);

  // console.log(validArrangements);

  return { noOf1JoltDifferences: 0, noOf3JoltDifferences: 0 };
}

function cleanupArrangement(arrangement) {
  return arrangement
    .split(',')
    .map(Number)
    .reduce((acc, cur, index) => {
      if (index === 0) {
        return acc.concat(cur);
      } else {
        const lastAcc = acc[acc.length - 1];
        const valid = [1, 2, 3].includes(cur - lastAcc);
        return acc.concat(valid ? cur : []);
      }
    }, [])
    .join(',');
}

// function isValidArrangement(arrangement) {
//   const arrngmnt = arrangement.split(',').map(Number);
//   return arrngmnt.every((x, i) => {
//     if (i === 0) {
//       return true;
//     } else {
//       const diff = arrngmnt[i] - arrngmnt[i - 1];
//       // console.log(arrangement, diff, [1, 2, 3].includes(diff) && diff > 0);
//       return [1, 2, 3].includes(diff) && diff > 0;
//     }
//   });
// }

function getDistArrangements(arr, pre) {
  console.log(arr);
  pre = pre || '';
  if (!arr.length) {
    return pre;
  }
  var ans = arr.reduce((ans, value) => {
    // console.log(ans);
    return ans.concat(getDistArrangements(arr.slice(1), pre + value));
  }, []);
  return ans;
}

function getCombn(arr, pre) {
  pre = pre || '';
  if (!arr.length) {
    return pre;
  }
  var ans = arr[0]
    .map((x) => `:${x}`)
    .reduce(function (ans, value) {
      return ans.concat(getCombn(arr.slice(1), pre + value));
    }, []);
  return ans;
}

// https://github.com/pseale/advent-of-code/blob/main/src/day10/src/index.test.js
// See, I knew this problem wasn't about programming, but math :/
// https://brilliant.org/wiki/tribonacci-sequence/
const tribonacciSequence = [1, 1, 2, 4, 7, 13, 24, 44, 81, 149];
function getTribonacci(num) {
  if (num > tribonacciSequence.length)
    throw `Can't calculate tribonacci number for ${num}`;

  return tribonacciSequence[num - 1];
}

function solvePartB(adapters) {
  const maxJoltage = adapters.sort((x, y) => x - y)[adapters.length - 1];
  const a = adapters.concat([0, maxJoltage + 3]).sort((x, y) => x - y);

  let multiplier = 1;
  let currentRun = 1;
  for (let joltage of a) {
    if (adapters.includes(joltage + 1)) {
      currentRun++;
    } else {
      multiplier *= getTribonacci(currentRun);
      currentRun = 1;
    }
  }
  return multiplier;
}

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n').map(Number);

  // const { noOf1JoltDifferences, noOf3JoltDifferences } = getDistinctArrangements(puzzleInput);

  console.log(solvePartB(puzzleInput));

  // console.log(
  //   'What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?',
  //   noOf1JoltDifferences * noOf3JoltDifferences,
  // );

  // Ans = 43406276662336
  console.log(
    'What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?',
  );
};

main().catch(console.error);

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  function findMinX(num, rem, k) {
    // https://www.geeksforgeeks.org/chinese-remainder-theorem-set-1-introduction/
    let x = 1; // Initialize result

    // As per the Chinese remainder theorem,
    // this loop will always break.
    while (true) {
      // Check if remainder of x % num[j] is
      // rem[j] or not (for all j from 0 to k-1)
      let j;
      for (j = 0; j < k; j++) {
        if (x % num[j] != rem[j]) {
          break;
        }
      }

      // If all remainders matched, we found x
      if (j == k) {
        return x;
      }

      // Else try next number
      x++;
    }
  }

  function answerPartOne() {
    const earliestDepartureTimestamp = Number(puzzleInput[0]);
    const BUS_IDS = puzzleInput[1]
      .split(',')
      .filter((id) => id != 'x')
      .map(Number);
    const { busId, timestamp } = BUS_IDS.flatMap((id) =>
      Array.from({ length: id })
        .map((_, i) => ({ busId: id, timestamp: earliestDepartureTimestamp + i }))
        .filter((dep) => dep.timestamp % id === 0),
    ).sort((a, b) => a.timestamp - b.timestamp)[0];
    const waitMinutes = timestamp - earliestDepartureTimestamp;

    return busId * waitMinutes;
  }

  function answerPartTwo(input = puzzleInput[1]) {
    // Chinese Remainder Theorem https://brilliant.org/wiki/chinese-remainder-theorem/
    const BUSES = input
      .split(',')
      .map((busId, index) => ({
        id: busId === 'x' ? null : Number(busId),
        rem: index ? busId - index : 0,
        tDelay: index,
      }))
      .filter((bus) => bus.id);

    const num = BUSES.map((bus) => bus.id);
    const rem = BUSES.map((bus) => bus.rem);
    const k = num.length;

    // Generate modulos and remainders
    // Array.from({ length: k }).forEach((_, i) => {
    //   console.log(`x = ${rem[i]} mod ${num[i]}`);
    // });

    return findMinX(num, rem, k);
  }

  // console.log(answerPartTwo('7,13,x,x,59,x,31,19') === 1068781, '7,13,x,x,59,x,31,19');
  // console.log(answerPartTwo('17,x,13,19') === 3417, '17,x,13,19');
  // console.log(answerPartTwo('67,7,59,61') === 754018, '67,7,59,61');
  // console.log(answerPartTwo('67,x,7,59,61') === 779210, '67,x,7,59,61');
  // console.log(answerPartTwo('67,7,x,59,61') === 1261476, '67,7,x,59,61');
  // console.log(answerPartTwo('1789,37,47,1889') === 1202161486, '1789,37,47,1889');

  // This program with the puzzle input took forever to run on my machine as it is not optimized
  // I instead generated the remainders and modulos and used an online calculator https://www.dcode.fr/chinese-remainder to get the answer

  console.log(
    "What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?",
    answerPartOne(),
  );
  console.log(
    'What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?',
    answerPartTwo(),
  );
};

main().catch(console.error);

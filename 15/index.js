function answerPartOne(startingNumbers, lastTurn = 2020) {
  let numbersSpoken = new Map();
  let lastNumberSpoken = startingNumbers[startingNumbers.length - 1];
  const turns = Array.from({ length: lastTurn - startingNumbers.length }).map((_, i) => i + startingNumbers.length + 1);

  startingNumbers.forEach((number, index) => numbersSpoken.set(number, index + 1));

  turns.forEach((turn) => {
    let nextNumber = 0;
    const mostRecentlySpokenTurn = turn - 1;

    if (numbersSpoken.has(lastNumberSpoken)) {
      const lastSpokenTurn = numbersSpoken.get(lastNumberSpoken);

      nextNumber = mostRecentlySpokenTurn - lastSpokenTurn;
    }

    numbersSpoken.set(lastNumberSpoken, mostRecentlySpokenTurn);

    lastNumberSpoken = nextNumber;
  });

  return lastNumberSpoken;
}

function answerPartTwo(startingNumbers, lastTurn = 30000000) {
  return answerPartOne(startingNumbers, lastTurn);
}

// console.log('1,3,2', answerPartOne([0, 3, 6]) === 436);
// console.log('1,3,2', answerPartOne([1, 3, 2]) === 1);
// console.log('2,1,3', answerPartOne([2, 1, 3]) === 10);
// console.log('1,2,3', answerPartOne([1, 2, 3]) === 27);
// console.log('2,3,1', answerPartOne([2, 3, 1]) === 78);
// console.log('3,2,1', answerPartOne([3, 2, 1]) === 438);
// console.log('3,1,2', answerPartOne([3, 1, 2]) === 1836);

// console.log('0,3,6', answerPartTwo([0, 3, 6]) === 175594);
// console.log('1,3,2', answerPartTwo([1, 3, 2]) === 2578);
// console.log('2,1,3', answerPartTwo([2, 1, 3]) === 3544142);
// console.log('1,2,3', answerPartTwo([1, 2, 3]) === 261214);
// console.log('2,3,1', answerPartTwo([2, 3, 1]) === 6895259);
// console.log('3,2,1', answerPartTwo([3, 2, 1]) === 18);
// console.log('3,1,2', answerPartTwo([3, 1, 2]) === 362);

console.log('What will be the 2020th number spoken?(Part 1)', answerPartOne([0, 1, 4, 13, 15, 12, 16]));
console.log('What will be the 30000000th number spoken?(Part 2)', answerPartTwo([0, 1, 4, 13, 15, 12, 16]));

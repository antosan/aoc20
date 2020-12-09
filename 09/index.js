const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function isValidNextNumber(preambleNumbers, nextNumber) {
  return preambleNumbers.some((num, nIndex) => {
    const otherNumbers = preambleNumbers.filter((_, pNumIndex) => pNumIndex > nIndex);

    return otherNumbers.some((oNum) => num + oNum === nextNumber);
  });
}

function getEncryptionWeakness(numbers, total) {
  let range = [];

  numbers.some((_, nIndex) =>
    Array.from({ length: numbers.length - nIndex }).some((_, i) => {
      const rangeNumbers = numbers.slice(nIndex, nIndex + i + 1);
      const rangeNumbersSum = rangeNumbers.reduce((acc, cur) => (acc += cur), 0);

      if (rangeNumbersSum === total && rangeNumbers.length > 1) {
        range = rangeNumbers;
        return true;
      }

      return false;
    }),
  );

  const sortedRange = [...range].sort();
  const smallest = sortedRange[0];
  const largest = sortedRange[sortedRange.length - 1];
  const sum = smallest + largest;

  return sum;
}

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n').map(Number);

  const PREAMBLE = 25;
  const nonPreambleNumbers = puzzleInput.slice(PREAMBLE);

  const notSumOfTwoPreambles = nonPreambleNumbers.filter((nextNonPreambleNumber, index) => {
    const preambleNumbers = puzzleInput.slice(index, index + PREAMBLE);
    const isValidNextNonPreambleNumber = isValidNextNumber(preambleNumbers, nextNonPreambleNumber);

    return !isValidNextNonPreambleNumber;
  });

  const encryptionWeakness = getEncryptionWeakness(puzzleInput, notSumOfTwoPreambles[0]);

  console.log('What is the first number that does not have this property?', notSumOfTwoPreambles[0]);
  console.log('What is the encryption weakness in your XMAS-encrypted list of numbers?', encryptionWeakness);
};

main().catch(console.error);

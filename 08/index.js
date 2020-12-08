const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function getNextInstructionIndex(instruction) {
  const [operation, argument] = instruction.split(' ');

  switch (operation) {
    case 'acc': {
      return { index: 1, accumulator: Number(argument) };
    }
    case 'jmp': {
      return { index: Number(argument), accumulator: 0 };
    }
    case 'nop': {
      return { index: 1, accumulator: 0 };
    }
    default: {
      throw new Error('Invalid operation');
    }
  }
}

function executeInstructions(puzzleInput) {
  const executedInstructionIndeces = new Set();
  let nextInstructionIndex = 0;
  let programTerminates = true;
  let accTotal = 0;

  executedInstructionIndeces.add(0);

  while (programTerminates && puzzleInput[nextInstructionIndex]) {
    const { index, accumulator } = getNextInstructionIndex(puzzleInput[nextInstructionIndex]);

    nextInstructionIndex += index;

    if (executedInstructionIndeces.has(nextInstructionIndex)) {
      programTerminates = false;
    } else {
      accTotal += accumulator;
      executedInstructionIndeces.add(nextInstructionIndex);
    }
  }

  return { programTerminates, accTotal };
}

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  let accAfterTermination = 0;
  const jmpNopOperations = puzzleInput
    .map((instruction) => instruction.split(' ')[0])
    .reduce((acc, cur, index) => acc.concat(['jmp', 'nop'].includes(cur) ? index : []), []);

  jmpNopOperations.some((opIndex) => {
    const newInput = [
      ...puzzleInput.slice(0, opIndex),
      puzzleInput[opIndex].startsWith('nop') ? puzzleInput[opIndex].replace('nop', 'jmp') : puzzleInput[opIndex].replace('jmp', 'nop'),
      ...puzzleInput.slice(opIndex + 1),
    ];
    const { programTerminates, accTotal } = executeInstructions(newInput);

    if (programTerminates) {
      accAfterTermination = accTotal;
    }

    return programTerminates;
  });

  console.log(
    'Immediately before any instruction is executed a second time, what value is in the accumulator?',
    executeInstructions(puzzleInput).accTotal,
  );
  console.log('What is the value of the accumulator after the program terminates?', accAfterTermination);
};

main().catch(console.error);

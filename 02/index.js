const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const validPasswords = puzzleInput.filter((policy) => {
    const [rules, password] = policy.split(': ');
    const [length, character] = rules.split(' ');
    const [min, max] = length.split('-');
    const count = password.split('').reduce((acc, cur) => (cur === character ? acc + 1 : acc), 0);
    const isValid = count >= min && count <= max;

    return isValid;
  });

  console.log('Valid Passwords Part 1:', validPasswords.length);

  const validPasswords2 = puzzleInput.filter((policy) => {
    const [rules, password] = policy.split(': ');
    const [length, character] = rules.split(' ');
    const [pos1, pos2] = length.split('-').map(Number);
    const passwordCharacters = password.split('');
    const pos1Valid = passwordCharacters[pos1 - 1] === character;
    const pos2Valid = passwordCharacters[pos2 - 1] === character;
    const isValid = (pos1Valid || pos2Valid) && !(pos1Valid && pos2Valid); // XOR

    return isValid;
  });

  console.log('Valid Passwords Part 2:', validPasswords2.length);
};

main().catch(console.error);

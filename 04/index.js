const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const REQUIRED_FIELDS = {
  // byr (Birth Year) - four digits; at least 1920 and at most 2002
  byr: '^19[2-9][0-9]|200[0|1|2]$',
  // iyr (Issue Year) - four digits; at least 2010 and at most 2020
  iyr: '^201[0-9]|2020$',
  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030
  eyr: '^202[0-9]|2030$',
  // hgt (Height) - a number followed by either cm or in
  // - If cm, the number must be at least 150 and at most 193.
  // - If in, the number must be at least 59 and at most 76.
  hgt: '^((1[5-8][0-9]|19[0-3])cm)|((59|6[0-9]|7[0-6])in)$',
  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f
  hcl: '^#([0-9a-f]{6})$',
  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth
  ecl: '^amb|blu|brn|gry|grn|hzl|oth$',
  // pid (Passport ID) - a nine-digit number, including leading zeroes
  pid: '^[0-9]{9}$',
};

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const noOfBlankLines = puzzleInput.reduce((acc, cur) => (acc += !cur ? 1 : 0), 0);
  const noOfPassports = noOfBlankLines + 1;

  const passportData = Array.from({ length: noOfPassports }).fill('');
  let index = 0;

  puzzleInput.forEach((input) => {
    if (input) {
      passportData[index] = [passportData[index], input].join(' ').trim();
    } else {
      index += 1;
    }
  });

  const fieldIsValid = (value, regex) => {
    const regExp = new RegExp(regex);

    return regExp.test(value);
  };

  const validPassports = passportData.filter((data) => {
    const passport = data.split(' ').reduce((acc, cur) => ({ ...acc, [cur.split(':')[0]]: cur.split(':')[1] }), {});
    const allFieldsPresent = Object.keys(REQUIRED_FIELDS).every((requiredField) => {
      const fieldIsPresent = Object.keys(passport).includes(requiredField);

      return fieldIsPresent && fieldIsValid(passport[requiredField], REQUIRED_FIELDS[requiredField]);
    });

    return allFieldsPresent;
  });

  console.log('Valid Passports:', validPassports.length);
};

main().catch(console.error);

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  function answerPartOne() {
    const separators = puzzleInput.reduce((acc, cur, index) => (cur === '' ? [...acc, index] : acc), []);
    const rules = puzzleInput.slice(0, separators[0]);
    const nearbyTickets = puzzleInput.slice(separators[1] + 2);
    const rulesMinMax = rules
      .reduce((acc, cur) => acc.concat(cur.match(/(\d+-\d+)/g)), [])
      .map((s) => s.split('-').map(Number));
    const errorRate = nearbyTickets.reduce((acc, ticket) => {
      return (acc += ticket.split(',').reduce((a, c) => {
        const isValid = rulesMinMax.some((minMax) => minMax[0] <= Number(c) && Number(c) <= minMax[1]);
        return (a += isValid ? 0 : Number(c));
      }, 0));
    }, 0);

    return errorRate;
  }

  function isValidValue(rule, value) {
    return (rule.min1 <= value && value <= rule.max1) || (rule.min2 <= value && value <= rule.max2);
  }

  function matchAtLeastOneRule(value, ticketRules) {
    for (const rule of ticketRules) {
      if (isValidValue(rule, value)) {
        return true;
      }
    }
    return false;
  }

  function answerPartTwo() {
    const separators = puzzleInput.reduce((acc, cur, index) => (cur === '' ? [...acc, index] : acc), []);
    const rules = puzzleInput.slice(0, separators[0]);
    const yourTicket = puzzleInput
      .slice(separators[0] + 2, separators[1])[0]
      .split(',')
      .map(Number);
    const nearbyTickets = puzzleInput.slice(separators[1] + 2).map((ticket) => ticket.split(',').map(Number));
    const ticketRules = [];

    rules.forEach((rule) => {
      const field = rule.split(': ')[0];
      const ranges = rule
        .split(': ')[1]
        .match(/(\d+-\d+)/g)
        .map((s) => s.split('-').map(Number));
      ticketRules.push({ field, min1: ranges[0][0], max1: ranges[0][1], min2: ranges[1][0], max2: ranges[1][1] });
    });

    let allTickets = [yourTicket];

    for (const ticket of nearbyTickets) {
      let valid = true;

      for (const value of ticket) {
        if (!matchAtLeastOneRule(value, ticketRules)) {
          valid = false;
        }
      }

      if (valid) {
        allTickets.push(ticket);
      }
    }

    let fieldPositions = [];

    yourTicket.forEach((_, index) => {
      for (const rule of ticketRules) {
        let valid = true;

        for (const ticket of allTickets) {
          if (!isValidValue(rule, ticket[index])) {
            valid = false;
            break;
          }
        }

        if (valid) {
          fieldPositions.push({ field: rule.field, index });
        }
      }
    });

    while (fieldPositions.length > ticketRules.length) {
      yourTicket.forEach((_, index) => {
        const fieldsMatchingCurrentPosition = fieldPositions.filter((p) => p.index === index);

        if (fieldsMatchingCurrentPosition.length === 1) {
          const currentField = fieldsMatchingCurrentPosition[0];

          fieldPositions = fieldPositions.filter((pos) => {
            if (pos.field === currentField.field) {
              return pos.index === currentField.index;
            }

            return true;
          });
        }
      });
    }

    const departureFields = fieldPositions.filter((pos) => pos.field.startsWith('departure'));
    let product = 1;

    for (const field of departureFields) {
      product *= yourTicket[field.index];
    }

    return product;
  }

  console.log('What is your ticket scanning error rate?(Part 1)', answerPartOne());
  console.log('What do you get if you multiply those six values together?(Part 2)', answerPartTwo());
};

main().catch(console.error);

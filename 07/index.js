const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const parsedBags = puzzleInput.reduce((acc, input) => {
    const [outerBag, contents] = input.split(' bags contain ');
    let innerBags = [];

    if (contents !== 'no other bags.') {
      innerBags = contents
        .replace(/\sbags{0,1}[\.]{0,1}/g, '')
        .split(', ')
        .map((bg) => {
          const [count, ...color] = bg.split(' ');

          return { count: Number(count), color: color.join(' ') };
        });
    }

    return { ...acc, [outerBag]: innerBags };
  }, {});

  const getValidOutermostBags = (bagColor) => {
    const result = new Set();

    const getOutermostBags = (bagColor2) => {
      const outermostBags = Object.keys(parsedBags).filter((bg) =>
        parsedBags[bg].map((b) => b.color).includes(bagColor2),
      );

      if (bagColor !== bagColor2) {
        result.add(bagColor2);
      }
      outermostBags.map((oBg) => getOutermostBags(oBg));
    };

    getOutermostBags(bagColor);

    return result;
  };

  let counts = {};
  const getTotalIndividualBags = (bagColor) => {
    parsedBags[bagColor].forEach((bg) => {
      for (let i = 0; i < bg.count; i++) {
        getTotalIndividualBags(bg.color);
        counts = { ...counts, [bg.color]: (counts[bg.color] || 0) + 1 };
      }
    });

    return Object.values(counts).reduce((acc, cur) => acc + cur, 0);
  };

  const validOutermostBags = getValidOutermostBags('shiny gold');
  const totalIndividualBags = getTotalIndividualBags('shiny gold');

  console.log(
    'Part 1: How many bag colors can eventually contain at least one shiny gold bag?',
    [...validOutermostBags].length,
  );
  console.log('Part 2: How many individual bags are required inside your single shiny gold bag?', totalIndividualBags);
};

main().catch(console.error);

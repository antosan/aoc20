const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const noOfBlankLines = puzzleInput.reduce((acc, cur) => (acc += !cur ? 1 : 0), 0);
  const noOfGroups = noOfBlankLines + 1;

  // PART ONE
  const uniqueQuestionsAnsweredYesPerGroup = Array.from({ length: noOfGroups }).fill('');
  let i = 0;

  puzzleInput.forEach((input) => {
    if (input) {
      const questionsAlreadyAnsweredYes = uniqueQuestionsAnsweredYesPerGroup[i];
      const newQuestionsAnsweredYes = input
        .split('')
        .filter((q) => !questionsAlreadyAnsweredYes.includes(q))
        .join('');

      uniqueQuestionsAnsweredYesPerGroup[i] = questionsAlreadyAnsweredYes.concat(newQuestionsAnsweredYes);
    } else {
      i += 1;
    }
  });

  const sumOfAnyoneAnsweredCounts = uniqueQuestionsAnsweredYesPerGroup.reduce((acc, cur) => (acc += cur.length), 0);

  // PART TWO
  const allQuestionsAnsweredYesPerGroup = Array.from({ length: noOfGroups }).fill([]);
  let j = 0;

  puzzleInput.forEach((input) => {
    if (input) {
      allQuestionsAnsweredYesPerGroup[j] = allQuestionsAnsweredYesPerGroup[j].concat(input);
    } else {
      j += 1;
    }
  });

  const answeredByEveryone = (uniqueAnswersString, allAnswersArray) => {
    return uniqueAnswersString.split('').reduce((acc, cur) => {
      const noOfYeses = allAnswersArray.filter((allAns) => allAns.includes(cur));
      const everyoneAnsweredYes = noOfYeses.length === allAnswersArray.length;

      return (acc += everyoneAnsweredYes ? 1 : 0);
    }, 0);
  };

  const sumOfEveryoneAnsweredCounts = Array.from({ length: noOfGroups })
    .map((_, idx) => idx)
    .reduce((acc, cur) => {
      const uniqueAnswers = uniqueQuestionsAnsweredYesPerGroup[cur];
      const allAnswers = allQuestionsAnsweredYesPerGroup[cur];
      const count = answeredByEveryone(uniqueAnswers, allAnswers);

      return (acc += count);
    }, 0);

  console.log({ sumOfAnyoneAnsweredCounts, sumOfEveryoneAnsweredCounts });
};

main().catch(console.error);

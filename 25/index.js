const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const [cardPublicKey, doorPublicKey] = input.trim().split('\n').map(Number);

function answerPartOne() {
    const SUBJECT_NUMBER = 7;
    const QUOTIENT = 20201227;
    let cardLoopSize = 0;
    let doorLoopSize = 0;
    let tempCardKey = 1;
    let tempDoorKey = 1;

    while (tempCardKey !== cardPublicKey) {
        cardLoopSize = cardLoopSize + 1;
        tempCardKey = (tempCardKey * SUBJECT_NUMBER) % QUOTIENT;
    }

    while (tempDoorKey !== doorPublicKey) {
        doorLoopSize = doorLoopSize + 1;
        tempDoorKey = (tempDoorKey * SUBJECT_NUMBER) % QUOTIENT;
    }

    let cardEncryptionKey = 1;

    for (let size = 0; size < cardLoopSize; size++) {
        cardEncryptionKey = (cardEncryptionKey * doorPublicKey) % QUOTIENT;
    }

    return cardEncryptionKey;
}

console.log('What encryption key is the handshake trying to establish?', answerPartOne());


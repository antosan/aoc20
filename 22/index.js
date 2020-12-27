const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const puzzleInput = input.trim().split('\n\n');

function calculateScore(winner) {
    let totalScore = 0;

    for (let i = 0, j = winner.length; i < winner.length; i++, j--) {
        totalScore += winner[i] * j;
    }

    return totalScore;
}

function answerPartOne() {
    let player1 = puzzleInput[0].split('\n').slice(1).map(Number);
    let player2 = puzzleInput[1].split('\n').slice(1).map(Number);

    while (player1.length > 0 && player2.length > 0) {
        const p1Card = player1.shift();
        const p2Card = player2.shift();

        if (p1Card > p2Card) {
            player1.push(p1Card, p2Card);
        } else {
            player2.push(p2Card, p1Card);
        }
    }

    const winner = player1 > player2 ? player1 : player2;

    return calculateScore(winner);
}

function answerPartTwo() {
    let player1 = puzzleInput[0].split('\n').slice(1).map(Number);
    let player2 = puzzleInput[1].split('\n').slice(1).map(Number);
    let cache = new Set();
    let maxGame = 0;

    function playGame(player1, player2, game, round) {
        while (player1.length > 0 && player2.length > 0) {
            round++;

            const key = `game${game},player1,${player1.join(',')},player2,${player1.join(',')}`;

            if (cache.has(key)) {
                return {
                    winner: 1,
                };
            }

            cache.add(key);

            const p1Card = player1.shift();
            const p2Card = player2.shift();

            let winner;

            if (p1Card <= player1.length && p2Card <= player2.length) {
                // New Game
                maxGame++;

                const { winner: winningPlayer } = playGame(player1.slice(0, p1Card), player2.slice(0, p2Card), maxGame + 1, 0);

                winner = winningPlayer;
            } else {
                winner = p1Card > p2Card ? 1 : 2;
            }

            // console.log(`Player ${winner} wins round ${round} of game ${game}!`);

            if (winner === 1) {
                player1.push(p1Card, p2Card);
            } else {
                player2.push(p2Card, p1Card);
            }
        }

        return {
            winner: player1.length > 0 ? 1 : 2,
        };
    }

    playGame(player1, player2, 1, 0);

    const winner = player1 > player2 ? player1 : player2;

    return calculateScore(winner);
}

console.log("What is the winning player's score (Part One)?", answerPartOne());
console.log("What is the winning player's score (Part Two)?", answerPartTwo());


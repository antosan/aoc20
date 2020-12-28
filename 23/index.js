function getNextCurrentCup(currentCup, cups) {
    const currentCupIndex = cups.indexOf(currentCup);
    const index = currentCupIndex + 1 === cups.length ? 0 : currentCupIndex + 1;

    return cups[index];
}

function getDestinationFromPickedCups(pickedCups, destinationCup, cups) {
    let destination = destinationCup - 1;

    if (pickedCups.includes(destination)) {
        return getDestinationFromPickedCups(pickedCups, destination);
    }

    return destination;
}

function answerPartOne() {
    let cups = Array.from('589174263').map(Number);
    let currentCup = cups[0];
    let destinationCup = '';
    let pickedCups = [];

    for (let i = 1; i <= 100; i++) {
        currentCupIndex = cups.indexOf(currentCup);
        const extraItems = 3 - (cups.length - 1 - currentCupIndex);

        if (extraItems > 0) {
            const removed = cups.splice(0, extraItems);
            cups.push(...removed);
        }

        currentCupIndex = cups.indexOf(currentCup);
        pickedCups = cups.splice(currentCupIndex + 1, 3);

        let destinationCup = currentCup - 1;

        if (pickedCups.includes(destinationCup)) {
            destinationCup = getDestinationFromPickedCups(pickedCups, destinationCup, cups);
        }

        const lowestCupLabel = Math.min(...cups);

        if (destinationCup < lowestCupLabel) {
            destinationCup = Math.max(...cups);
        }

        const destinationCupIndex = cups.indexOf(destinationCup);

        cups.splice(destinationCupIndex + 1, 0, ...pickedCups);
        currentCup = getNextCurrentCup(currentCup, cups);
    }

    const cupWithLabel1Index = cups.indexOf(1);

    return [...cups.slice(cupWithLabel1Index + 1), ...cups.slice(0, cupWithLabel1Index)].join('');
}

console.log('What are the labels on the cups after cup 1?', answerPartOne());

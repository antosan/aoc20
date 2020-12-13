// Floor (.) Empty Seat (L) Occupied Seat (#)
// Number of occupied seats adjacent to a given seat (up/down/left/right/diagonal)
/**
 * - If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
 * - If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
 * - Otherwise, the seat's state does not change.
 */

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const FLOOR = '.';
  const EMPTY_SEAT = 'L';
  const OCCUPIED_SEAT = '#';

  function getAdjacentSeatIndexes(row, col, maxRows, maxCols, seatRows) {
    const topLeft = [row - 1, col - 1];
    const top = [row, col - 1];
    const topRight = [row + 1, col - 1];
    const left = [row - 1, col];
    const right = [row + 1, col];
    const bottomLeft = [row - 1, col + 1];
    const bottom = [row, col + 1];
    const bottomRight = [row + 1, col + 1];

    return [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight].filter(
      (seat) =>
        seat[0] >= 0 &&
        seat[1] >= 0 &&
        seat[0] < maxRows &&
        seat[1] < maxCols &&
        seatRows[seat[0]].split('')[seat[1]] !== FLOOR,
    );
  }

  function getOccupiedAdjacentSeatsCount(adjacentSeats, seatRows) {
    return adjacentSeats.reduce((acc, cur) => (acc += seatRows[cur[0]].split('')[cur[1]] === OCCUPIED_SEAT ? 1 : 0), 0);
  }

  function getTotalOccupiedSeats(seatRows) {
    return seatRows.reduce(
      (acc, cur) => (acc += cur.split('').reduce((a, c) => (a += c === OCCUPIED_SEAT ? 1 : 0), 0)),
      0,
    );
  }

  function getFirstSeatInDirection(row, col, rowChange, colChange, maxRows, maxCols, seatRows) {
    let seat = null;
    let newSeatRow = row + rowChange;
    let newSeatCol = col + colChange;

    while (newSeatRow >= 0 && newSeatCol >= 0 && newSeatRow < maxRows && newSeatCol < maxCols) {
      if (seatRows[newSeatRow].split('')[newSeatCol] !== FLOOR) {
        seat = [newSeatRow, newSeatCol];
        break;
      }

      newSeatRow += rowChange;
      newSeatCol += colChange;
    }

    return seat;
  }

  function getFirstSeatInDirectionIndexes(row, col, maxRows, maxCols, seatRows) {
    const firstTopLeft = getFirstSeatInDirection(row, col, -1, -1, maxRows, maxCols, seatRows);
    const firstTop = getFirstSeatInDirection(row, col, -1, 0, maxRows, maxCols, seatRows);
    const firstTopRight = getFirstSeatInDirection(row, col, -1, 1, maxRows, maxCols, seatRows);
    const firstLeft = getFirstSeatInDirection(row, col, 0, -1, maxRows, maxCols, seatRows);
    const firstRight = getFirstSeatInDirection(row, col, 0, 1, maxRows, maxCols, seatRows);
    const firstBottomLeft = getFirstSeatInDirection(row, col, 1, -1, maxRows, maxCols, seatRows);
    const firstBottom = getFirstSeatInDirection(row, col, 1, 0, maxRows, maxCols, seatRows);
    const firstBottomRight = getFirstSeatInDirection(row, col, 1, 1, maxRows, maxCols, seatRows);

    return [
      firstTopLeft,
      firstTop,
      firstTopRight,
      firstLeft,
      firstRight,
      firstBottomLeft,
      firstBottom,
      firstBottomRight,
    ].filter(Boolean);
  }

  function getOccupiedSeatsInDirectionCount(adjacentSeats, seatRows) {
    return adjacentSeats.reduce((acc, cur) => (acc += seatRows[cur[0]].split('')[cur[1]] === OCCUPIED_SEAT ? 1 : 0), 0);
  }

  function answerPartOne() {
    let seatRows = [...puzzleInput];
    let totalOccupiedSeats;
    let nextSeatRows;
    let nextTotalOccupiedSeats;

    do {
      totalOccupiedSeats = getTotalOccupiedSeats(seatRows);
      nextSeatRows = [];

      for (let row = 0; row < seatRows.length; row++) {
        const seatColumns = seatRows[row].split('');

        nextSeatRows[row] = '';

        for (let col = 0; col < seatColumns.length; col++) {
          const space = seatColumns[col];
          const adjacentSeats = getAdjacentSeatIndexes(row, col, seatRows.length, seatColumns.length, seatRows);
          const noOfOccupiedAdjacentSeats = getOccupiedAdjacentSeatsCount(adjacentSeats, seatRows);

          if (space === EMPTY_SEAT && noOfOccupiedAdjacentSeats === 0) {
            nextSeatRows[row] += OCCUPIED_SEAT;
          } else if (space === OCCUPIED_SEAT && noOfOccupiedAdjacentSeats >= 4) {
            nextSeatRows[row] += EMPTY_SEAT;
          } else {
            nextSeatRows[row] += space;
          }
        }
      }

      nextTotalOccupiedSeats = getTotalOccupiedSeats(nextSeatRows);
      seatRows = nextSeatRows;
    } while (totalOccupiedSeats !== nextTotalOccupiedSeats);

    return totalOccupiedSeats;
  }

  function answerPartTwo() {
    let seatRows = [...puzzleInput];
    let totalOccupiedSeats;
    let nextSeatRows;
    let nextTotalOccupiedSeats;

    do {
      totalOccupiedSeats = getTotalOccupiedSeats(seatRows);
      nextSeatRows = [];

      for (let row = 0; row < seatRows.length; row++) {
        const seatColumns = seatRows[row].split('');

        nextSeatRows[row] = '';

        for (let col = 0; col < seatColumns.length; col++) {
          const space = seatColumns[col];
          const adjacentSeats = getFirstSeatInDirectionIndexes(row, col, seatRows.length, seatColumns.length, seatRows);
          const noOfOccupiedAdjacentSeats = getOccupiedSeatsInDirectionCount(adjacentSeats, seatRows);

          if (space === EMPTY_SEAT && noOfOccupiedAdjacentSeats === 0) {
            nextSeatRows[row] += OCCUPIED_SEAT;
          } else if (space === OCCUPIED_SEAT && noOfOccupiedAdjacentSeats >= 5) {
            nextSeatRows[row] += EMPTY_SEAT;
          } else {
            nextSeatRows[row] += space;
          }
        }
      }

      nextTotalOccupiedSeats = getTotalOccupiedSeats(nextSeatRows);
      seatRows = nextSeatRows;
    } while (totalOccupiedSeats !== nextTotalOccupiedSeats);

    return totalOccupiedSeats;
  }

  console.log('How many seats end up occupied (Part One)?', answerPartOne());
  console.log('How many seats end up occupied (Part Two)?', answerPartTwo());
};

main().catch(console.error);

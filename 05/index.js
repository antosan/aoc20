// Example Seat: FBFBBFFRLR
// 7 || 3
// F B F B B F F || R L R
// F - Front
// B - Back
// L - Left
// R - Right

// Rows - 128 (0 - 127)

// - Start by considering the whole range, rows 0 through 127.
// - F means to take the lower half, keeping rows 0 through 63.
// - B means to take the upper half, keeping rows 32 through 63.
// - F means to take the lower half, keeping rows 32 through 47.
// - B means to take the upper half, keeping rows 40 through 47.
// - B keeps rows 44 through 47.
// - F keeps rows 44 through 45.
// - The final F keeps the lower of the two, row 44.

// Columns - 8 (0 - 7)

// - Start by considering the whole range, columns 0 through 7.
// - R means to take the upper half, keeping columns 4 through 7.
// - L means to take the lower half, keeping columns 4 through 5.
// - The final R keeps the upper of the two, column 5.

// SeatID = row * 8 + column => 44 * 8 + 5 = 357

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const getRowColumnSeatId = (boardingPassSeatNo) => {
  const rowData = boardingPassSeatNo.substring(0, 7).split('');
  const columnData = boardingPassSeatNo.substring(7).split('');
  const row = rowData.reduce(
    ({ start, end }, cur) => {
      const middle = Math.floor((start + end) / 2);

      return cur === 'F' ? { start, end: middle } : { start: middle + 1, end };
    },
    { start: 0, end: 127 },
  );
  const column = columnData.reduce(
    ({ start, end }, cur) => {
      const middle = Math.floor((start + end) / 2);

      return cur === 'L' ? { start, end: middle } : { start: middle + 1, end };
    },
    { start: 0, end: 7 },
  );

  return { row: row.start, column: column.start, seatId: row.start * 8 + column.start };
};

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  const seatIds = puzzleInput.map((input) => getRowColumnSeatId(input).seatId);

  const sortedSeatIds = [...seatIds].sort((a, b) => a - b);
  const lowestSeatId = sortedSeatIds[0];
  const highestSeatId = sortedSeatIds[sortedSeatIds.length - 1];

  const allSeats = Array(highestSeatId - lowestSeatId + 1).fill().map((_, index) => lowestSeatId + index);

  const missingSeats = allSeats.filter((s) => !seatIds.includes(s));

  console.log('Hightest Seat ID:', highestSeatId);
  console.log('Missing Seat IDs:', missingSeats);
};

main().catch(console.error);

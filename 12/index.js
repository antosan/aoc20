const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const main = async () => {
  const input = await readFile('./puzzle-input.txt', 'utf-8');
  const puzzleInput = input.trim().split('\n');

  function getDirectionFromDegrees(degrees) {
    switch (degrees) {
      case 0: {
        return 'north';
      }
      case 90:
      case -270: {
        return 'east';
      }
      case 180:
      case -180: {
        return 'south';
      }
      case 270:
      case -90: {
        return 'west';
      }
      default: {
        throw new Error('We should not get here');
      }
    }
  }

  function getDegreesFromDirection(direction) {
    switch (direction) {
      case 'north': {
        return 0;
      }
      case 'east': {
        return 90;
      }
      case 'south': {
        return 180;
      }
      case 'west': {
        return 270;
      }
      default: {
        throw new Error('We should not get here');
      }
    }
  }

  function getOppositeDirection(direction) {
    switch (direction) {
      case 'north': {
        return 'south';
      }
      case 'east': {
        return 'west';
      }
      case 'south': {
        return 'north';
      }
      case 'west': {
        return 'east';
      }
      default: {
        throw new Error('Direction should be one of north/south/east/west');
      }
    }
  }

  function getDirections(directions, action, value) {
    const actionValue = directions[action];
    const oppositeActionValue = directions[getOppositeDirection(action)];
    const diff = actionValue + value - oppositeActionValue;

    return {
      ...directions,
      [action]: diff > 0 ? diff : 0,
      [getOppositeDirection(action)]: diff < 0 ? Math.abs(diff) : 0,
    };
  }

  function answerPartOne() {
    let currentDirection = 'east';
    let degrees = 90;
    let directions = {
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    };

    puzzleInput.forEach((input) => {
      const action = input.substring(0, 1);
      const value = Number(input.substring(1));

      switch (action) {
        case 'N': {
          directions = getDirections(directions, 'north', value);
          break;
        }
        case 'S': {
          directions = getDirections(directions, 'south', value);
          break;
        }
        case 'E': {
          directions = getDirections(directions, 'east', value);
          break;
        }
        case 'W': {
          directions = getDirections(directions, 'west', value);
          break;
        }
        case 'L': {
          degrees -= value;
          currentDirection = getDirectionFromDegrees(degrees % 360);
          break;
        }
        case 'R': {
          degrees += value;
          currentDirection = getDirectionFromDegrees(degrees % 360);
          break;
        }
        case 'F': {
          directions = getDirections(directions, currentDirection, value);
          break;
        }
        default: {
          directions = directions;
        }
      }
    });

    return Object.keys(directions).reduce((acc, cur) => (acc += directions[cur]), 0);
  }

  function answerPartTwo() {
    let currentWaypoint = {
      north: 1,
      south: 0,
      east: 10,
      west: 0,
    };
    let directions = {
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    };

    puzzleInput.forEach((input) => {
      const action = input.substring(0, 1);
      const value = Number(input.substring(1));

      switch (action) {
        case 'N': {
          currentWaypoint = {
            ...currentWaypoint,
            north: currentWaypoint.north + value,
          };
          break;
        }
        case 'S': {
          currentWaypoint = {
            ...currentWaypoint,
            south: currentWaypoint.south + value,
          };
          break;
        }
        case 'E': {
          currentWaypoint = {
            ...currentWaypoint,
            east: currentWaypoint.east + value,
          };
          break;
        }
        case 'W': {
          currentWaypoint = {
            ...currentWaypoint,
            west: currentWaypoint.west + value,
          };
          break;
        }
        case 'L': {
          currentWaypoint = Object.keys(currentWaypoint)
            .filter(() => Boolean(currentWaypoint))
            .reduce(
              (acc, cur) => {
                const degrees = getDegreesFromDirection(cur) - value;
                const newDirection = getDirectionFromDegrees(degrees % 360);

                return { ...acc, [newDirection]: currentWaypoint[cur] };
              },
              {
                north: 0,
                south: 0,
                east: 0,
                west: 0,
              },
            );
          break;
        }
        case 'R': {
          currentWaypoint = Object.keys(currentWaypoint)
            .filter(() => Boolean(currentWaypoint))
            .reduce(
              (acc, cur) => {
                const degrees = getDegreesFromDirection(cur) + value;
                const newDirection = getDirectionFromDegrees(degrees % 360);

                return { ...acc, [newDirection]: currentWaypoint[cur] };
              },
              {
                north: 0,
                south: 0,
                east: 0,
                west: 0,
              },
            );
          break;
        }
        case 'F': {
          directions = getDirections(directions, 'north', currentWaypoint.north * value);
          directions = getDirections(directions, 'south', currentWaypoint.south * value);
          directions = getDirections(directions, 'east', currentWaypoint.east * value);
          directions = getDirections(directions, 'west', currentWaypoint.west * value);
          break;
        }
        default: {
          directions = directions;
        }
      }
    });

    return Object.keys(directions).reduce((acc, cur) => (acc += directions[cur]), 0);
  }

  console.log(
    "What is the Manhattan distance between that location and the ship's starting position (Part One)?",
    answerPartOne(),
  );
  console.log(
    "What is the Manhattan distance between that location and the ship's starting position (Part Two)?",
    answerPartTwo(),
  );
};

main().catch(console.error);

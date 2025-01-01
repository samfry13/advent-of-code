import { getInput } from "../../utils/file";
import { clone } from "../../utils/object";

const input = await getInput(__dirname); //, "test.txt");

type Position = { x: number; y: number };
const Direction = {
  Up: "up",
  Right: "right",
  Down: "down",
  Left: "left",
} as const;
type Direction = (typeof Direction)[keyof typeof Direction];

type GuardLocation = {
  position: Position;
  direction: Direction;
};

function init(input: string): {
  board: string[][];
  guardLocation: { position: Position; direction: Direction };
} {
  const board = input.split("\n").map((row) => row.split(""));

  const guardLocation: GuardLocation = {
    position: { x: -1, y: -1 },
    direction: "up",
  };

  // find guard starting location
  outer: for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === "^") {
        guardLocation.position = { x, y };
        board[y][x] = ".";
        break outer;
      }
    }
  }

  if (guardLocation.position.x === -1 || guardLocation.position.y === -1)
    throw new Error("No Guard Starting Location");

  return { board, guardLocation };
}

function isPositionInBounds(position: Position, board: string[][]) {
  return (
    position.y >= 0 &&
    position.y < board.length &&
    position.x >= 0 &&
    position.x < board[position.y].length
  );
}

function hasObstacleInFront(location: GuardLocation, board: string[][]) {
  switch (location.direction) {
    case Direction.Up:
      return board[location.position.y - 1]?.[location.position.x] === "#";
    case Direction.Right:
      return board[location.position.y][location.position.x + 1] === "#";
    case Direction.Down:
      return board[location.position.y + 1]?.[location.position.x] === "#";
    case Direction.Left:
      return board[location.position.y][location.position.x - 1] === "#";
  }
}

function rotateClockwise(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
  }
}

function updateGuardLocation(
  guardLocation: GuardLocation,
  board: string[][]
): GuardLocation {
  const newLocation = clone(guardLocation);

  // check for obstacles
  while (hasObstacleInFront(newLocation, board)) {
    newLocation.direction = rotateClockwise(newLocation.direction);
  }

  // update position
  switch (newLocation.direction) {
    case Direction.Up:
      newLocation.position.y -= 1;
      break;
    case Direction.Right:
      newLocation.position.x += 1;
      break;
    case Direction.Down:
      newLocation.position.y += 1;
      break;
    case Direction.Left:
      newLocation.position.x -= 1;
      break;
  }

  return newLocation;
}

function debugPrintBoard(
  board: string[][],
  guardLocation: GuardLocation,
  obstacle?: Position,
  lastNewPosition?: Position
) {
  return board
    .map((row, rowIndex) =>
      row
        .map((col, colIndex) => {
          if (
            rowIndex === guardLocation.position.y &&
            colIndex === guardLocation.position.x
          ) {
            return {
              [Direction.Up]: "^",
              [Direction.Right]: ">",
              [Direction.Down]: "v",
              [Direction.Left]: "<",
            }[guardLocation.direction];
          }

          if (
            lastNewPosition &&
            rowIndex === lastNewPosition.y &&
            colIndex === lastNewPosition.x
          ) {
            return "X";
          }

          if (obstacle && rowIndex === obstacle.y && colIndex === obstacle.x) {
            return "O";
          }

          return col;
        })
        .join("")
    )
    .join("\n");
}

// ------------- PART 1 ---------------------
const originalDistinctLocations = new Set<`{x:${number},y:${number}}`>();
{
  let { board, guardLocation } = init(input);

  while (isPositionInBounds(guardLocation.position, board)) {
    // record position
    originalDistinctLocations.add(
      `{x:${guardLocation.position.x},y:${guardLocation.position.y}}`
    );

    guardLocation = updateGuardLocation(guardLocation, board);
  }

  console.log("Distinct Positions: ", originalDistinctLocations.size);
}

// ------------- PART 2 ---------------------
{
  const obstructionPositions = new Set<`{x:${number},y:${number}}`>();

  const { board, guardLocation: initialPosition } = init(input);
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      // only check non-obstacle spaces
      if (board[y][x] === "#") continue;
      // only check places the guard would run into
      if (!originalDistinctLocations.has(`{x:${x},y:${y}}`)) continue;
      // don't check guard's initial position
      if (initialPosition.position.x === x && initialPosition.position.y === y)
        continue;

      const obstacleBoard = board.map((row, rowIndex) =>
        rowIndex === y
          ? row.map((col, colIndex) => (colIndex === x ? "#" : col))
          : row
      );
      let guardLocation = clone(initialPosition);

      const distinctPositions = new Set<`{x:${number},y:${number}}`>([
        `{x:${guardLocation.position.x},y:${guardLocation.position.y}}`,
      ]);

      let lastNewPosition = clone(guardLocation.position);

      while (isPositionInBounds(guardLocation.position, obstacleBoard)) {
        guardLocation = updateGuardLocation(guardLocation, obstacleBoard);

        // record position
        const positionString =
          `{x:${guardLocation.position.x},y:${guardLocation.position.y}}` as const;

        if (!distinctPositions.has(positionString)) {
          distinctPositions.add(positionString);
          lastNewPosition = clone(guardLocation.position);
          continue;
        } else {
          if (
            guardLocation.position.x === lastNewPosition.x &&
            guardLocation.position.y === lastNewPosition.y
          ) {
            // we've made a loop
            obstructionPositions.add(`{x:${x},y:${y}}`);
            break;
          }
        }
      }
    }
  }

  console.log("Possible Obstruction Positions: ", obstructionPositions.size);
}

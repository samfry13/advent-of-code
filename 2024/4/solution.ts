import { getInput } from "../../utils/file";

const input = await getInput(__dirname);
const wordSearch = input.split("\n").map((line) => line.split(""));

// ------------- PART 1 ---------------------

let total = 0;
for (let line = 0; line < wordSearch.length; line++) {
  for (let col = 0; col < wordSearch[line].length; col++) {
    const possibleMatches = [
      // North
      line >= 3
        ? `${wordSearch[line][col]}${wordSearch[line - 1][col]}${wordSearch[line - 2][col]}${wordSearch[line - 3][col]}`
        : "",

      // North East
      line >= 3 && col <= wordSearch[line].length - 4
        ? `${wordSearch[line][col]}${wordSearch[line - 1][col + 1]}${wordSearch[line - 2][col + 2]}${wordSearch[line - 3][col + 3]}`
        : "",

      // East
      col <= wordSearch[line].length - 4
        ? `${wordSearch[line][col]}${wordSearch[line][col + 1]}${wordSearch[line][col + 2]}${wordSearch[line][col + 3]}`
        : "",

      // South East
      line <= wordSearch.length - 4 && col <= wordSearch[line].length - 4
        ? `${wordSearch[line][col]}${wordSearch[line + 1][col + 1]}${wordSearch[line + 2][col + 2]}${wordSearch[line + 3][col + 3]}`
        : "",

      // South
      line <= wordSearch.length - 4
        ? `${wordSearch[line][col]}${wordSearch[line + 1][col]}${wordSearch[line + 2][col]}${wordSearch[line + 3][col]}`
        : "",

      // South West
      line <= wordSearch.length - 4 && col >= 3
        ? `${wordSearch[line][col]}${wordSearch[line + 1][col - 1]}${wordSearch[line + 2][col - 2]}${wordSearch[line + 3][col - 3]}`
        : "",

      // West
      col >= 3
        ? `${wordSearch[line][col]}${wordSearch[line][col - 1]}${wordSearch[line][col - 2]}${wordSearch[line][col - 3]}`
        : "",

      // North West
      line >= 3 && col >= 3
        ? `${wordSearch[line][col]}${wordSearch[line - 1][col - 1]}${wordSearch[line - 2][col - 2]}${wordSearch[line - 3][col - 3]}`
        : "",
    ];

    total += possibleMatches.filter((match) => match === "XMAS").length;
  }
}

console.log(`Total XMAS: ${total}`);

// ------------- PART 2 ---------------------

let newTotal = 0;

for (let line = 1; line < wordSearch.length - 1; line++) {
  for (let col = 1; col < wordSearch[line].length - 1; col++) {
    if (wordSearch[line][col] !== "A") continue;

    // NW / NE / SE / SW
    const x = `${wordSearch[line - 1][col - 1]}${wordSearch[line - 1][col + 1]}${wordSearch[line + 1][col + 1]}${wordSearch[line + 1][col - 1]}`;

    const possibleMatches = ["MMSS", "SMMS", "SSMM", "MSSM"];

    if (possibleMatches.includes(x)) newTotal += 1;
  }
}

console.log(`Total X-MAS: ${newTotal}`);

import { getInput } from "../../utils/file";
import { wrap } from "../../utils/wrap";

const input = await getInput(__dirname, "input.txt");
const commands = input.split("\n").map((line) => {
  const [direction, ...amountString] = line.split("");
  const amount = parseInt(amountString.join(""));
  return [direction, amount] as const;
});

// ------------- PART 1 ---------------------
let position = 50;
let totalZeroes = 0;
// console.log("START", position);
for (const [direction, amount] of commands) {
  if (direction === "R") {
    position = wrap(100, position + amount);
    // console.log(direction, "\tby\t", amount, "\tto\t", position);
  } else if (direction === "L") {
    position = wrap(100, position - amount);
    // console.log(direction, "\tby\t", amount, "\tto\t", position);
  }

  if (position === 0) totalZeroes++;
}

// console.log("TOTAL ZEROES\t", totalZeroes);

// ------------- PART 2 ---------------------
position = 50;
totalZeroes = 0;

console.log("START", 50);
// brute force lol
for (const [direction, amount] of commands) {
  const directionMult = direction === "R" ? 1 : -1;
  for (let i = 0; i < amount; i++) {
    position = wrap(100, position + 1 * directionMult);
    if (position === 0) totalZeroes++;
  }

  console.log(direction, "\tby\t", amount, "\tto\t", position);
}
console.log("TOTAL ZEROES\t", totalZeroes);

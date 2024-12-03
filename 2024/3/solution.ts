import { getInput } from "../../utils/file";

const program = await getInput(__dirname);

// ------------- PART 1 ---------------------

let multTotal = 0;
for (let chunk of program.split("mul")) {
  const regex = /^\((\d+),(\d+)\)/;
  const matchResult = regex.exec(chunk);
  if (matchResult) {
    const [_, num1, num2] = matchResult;
    multTotal += Number(num1) * Number(num2);
  }
}

console.log(`Mult Total: ${multTotal}`);

// ------------- PART 2 ---------------------

const instructions = program.match(/do\(\)|don't\(\)|mul\(\d+,\d+\)/g) ?? [];

let newMultTotal = 0;
let enabled = true;
for (const instruction of instructions) {
  switch (true) {
    case instruction === "don't()":
      enabled = false;
      break;
    case instruction === "do()":
      enabled = true;
      break;
    case instruction.startsWith("mul"):
      if (!enabled) break;

      const matchResult = /mul\((\d+),(\d+)\)/.exec(instruction);
      if (matchResult) {
        const [_, num1, num2] = matchResult;
        newMultTotal += Number(num1) * Number(num2);
      }
      break;
  }
}

console.log(`New Mult Total: ${newMultTotal}`);

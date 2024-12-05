import { getInput } from "../../utils/file";

const input = await getInput(__dirname);
const [rawRules, rawUpdates] = input.split("\n\n");

const rules = rawRules.split("\n");
const updates = rawUpdates
  .split("\n")
  .map((line) => line.split(",").map(Number));

// ------------- PART 1 ---------------------

const getBrokenRules = (update: number[], rules: string[]) => {
  const brokenRules = [];

  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const brokenRule = `${update[j]}|${update[i]}`;
      if (rules.includes(brokenRule)) {
        brokenRules.push(brokenRule);
      }
    }
  }

  return brokenRules;
};

const isValidUpdate = (update: number[], rules: string[]) => {
  return getBrokenRules(update, rules).length === 0;
};

const validMiddleTotal = updates
  .filter((update) => isValidUpdate(update, rules))
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((t, c) => t + c, 0);

console.log("Total: ", validMiddleTotal);

// ------------- PART 2 ---------------------

const invalidMiddleTotal = updates
  .filter((update) => !isValidUpdate(update, rules))
  .map((update) =>
    update.sort((a, b) => {
      const applicableRule = rules.find(
        (rule) => rule === `${a}|${b}` || rule === `${b}|${a}`
      );

      if (applicableRule) {
        const [first, second] = applicableRule.split("|");
        const weights = {
          [first]: 1,
          [second]: 2,
        };

        return weights[a] - weights[b];
      } else {
        return 0;
      }
    })
  )
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((t, c) => t + c, 0);

console.log("Invalid Total: ", invalidMiddleTotal);

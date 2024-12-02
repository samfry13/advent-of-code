import { deleteIndex } from "../../utils/array";
import { getInput } from "../../utils/file";

// Setup
const reports = await getInput(__dirname);

// ------------- PART 1 ---------------------

const totalSafe = reports
  .split("\n")
  .map((report) => {
    const levels = report.split(" ").map(Number);

    for (let i = 0; i < levels.length - 1; i++) {
      // check if increasing/decreasing
      if (i !== 0) {
        const previousSign = Math.sign(levels[i - 1] - levels[i]);
        const nextSign = Math.sign(levels[i] - levels[i + 1]);

        if (previousSign === 0 || nextSign === 0) return false;

        if (previousSign !== nextSign) return false;
      }

      // check amount
      if (Math.abs(levels[i] - levels[i + 1]) > 3) return false;
    }

    return true;
  })
  .filter((x) => x).length;

console.log("Total safe: ", totalSafe);

// ------------- PART 2 ---------------------

function checkSafety(levels: number[]) {
  for (let i = 0; i < levels.length - 1; i++) {
    // check if increasing/decreasing
    if (i !== 0) {
      const previousSign = Math.sign(levels[i - 1] - levels[i]);
      const nextSign = Math.sign(levels[i] - levels[i + 1]);

      if (previousSign === 0 || nextSign === 0) return false;

      if (previousSign !== nextSign) return false;
    }

    // check amount
    if (Math.abs(levels[i] - levels[i + 1]) > 3) return false;
  }

  return true;
}

const totalSafeWithDampening = reports
  .split("\n")
  .map((report) => {
    const levels = report.split(" ").map(Number);

    const baseSafety = checkSafety(levels);

    if (!baseSafety) {
      for (let i = 0; i < levels.length; i++) {
        const deletedSafety = checkSafety(deleteIndex(levels, i));

        if (deletedSafety) return true;
      }

      return false;
    }

    return true;
  })
  .filter((x) => x).length;

console.log("Total safe with dampening", totalSafeWithDampening);

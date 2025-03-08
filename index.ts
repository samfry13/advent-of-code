import { parseArgs } from "util";
import { $, ShellError } from "bun";
import { Command } from "@commander-js/extra-typings";

const program = new Command();

program
  .command("day")
  .description("Run a specific day's solution")
  .argument("<day>", "Day to run")
  .option(
    "-y, --year <year>",
    "Year to run",
    new Date().getFullYear().toString()
  )
  .option("-w, --watch", "Watch for changes")
  .action(async (day, { year, watch }) => {
    await $`bun run ${watch ? "--watch" : ""} ${year}/${day}/solution.ts`;
  });

program
  .command("generate")
  .description("Generate solution files for a new day")
  .argument("<day>", "Day to generate")
  .option(
    "-y, --year <year>",
    "Year to generate",
    new Date().getFullYear().toString()
  )
  .option("-o, --overwrite", "Overwrite existing files")
  .action(async (day, { year, overwrite }) => {
    const path = `./${year}/${day}`;

    if (Bun.file(`${path}/solution.ts`).exists() && !overwrite) {
      return console.error(`Solution files already exist for ${year}/${day}`);
    }

    await $`mkdir -p ${path}`;
    await Promise.all([
      $`touch ${path}/input.txt`,
      $`touch ${path}/test.txt`,
      $`touch ${path}/solution.ts`,
    ]);

    const solutionFile = Bun.file(`${path}/solution.ts`);
    const writer = solutionFile.writer();

    writer.write(`import { getInput } from "../../utils/file";\n\n`);
    writer.write(`const input = await getInput(__dirname, "test.txt");\n\n`);
    writer.write(`// ------------- PART 1 ---------------------\n\n`);
    writer.write(`// ------------- PART 2 ---------------------\n\n`);
    writer.end();

    await Promise.all([
      $`code -r ${path}/input.txt`,
      $`code -r ${path}/test.txt`,
      $`code -r ${path}/solution.ts`,
    ]);
  });

program.parse();

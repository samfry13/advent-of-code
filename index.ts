import { parseArgs } from "util";
import { $, ShellError } from "bun";

const printUsage = () => {
  console.log(`Usage: bun run index.ts --year=<year> <day>`);
};

// Runs a file based on year and day
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    watch: {
      type: "boolean",
    },
    year: {
      type: "string",
    },
  },
  allowPositionals: true,
});

const [_bun, _filename, day] = positionals;
const { year = "2024", watch } = values;

try {
  const parsedYear = Number(year);
  if (!parsedYear || isNaN(parsedYear) || !day) {
    printUsage();
    await $`exit 1`;
  }

  await $`bun run ${watch ? "--watch" : ""} ${year}/${day}/solution.ts`;
} catch (err: any) {
  if ("exitCode" in err) console.error(`Failed with code ${err.exitCode}`);
}

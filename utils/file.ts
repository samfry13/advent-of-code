import { join } from "path";

export async function getInput(dir = __dirname, file = "input.txt") {
  const inputFile = Bun.file(join(dir, file));

  if (!(await inputFile.exists())) {
    throw new Error(`Input file (${file}) missing at directory: ${dir}`);
  }

  return await inputFile.text();
}

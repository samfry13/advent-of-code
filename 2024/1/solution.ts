import { getInput } from "../../utils/file";
import zip from "../../utils/zip";

// Setup
const input = await getInput(__dirname);

const list1 = [],
  list2 = [];

for (const line of input.split("\n")) {
  const [item1, item2] = line.split("   ");
  list1.push(Number(item1));
  list2.push(Number(item2));
}

// ------------- PART 1 ---------------------

let totalDistance = 0;
for (const [item1, item2] of zip(list1.toSorted(), list2.toSorted())) {
  totalDistance += Math.abs(item1 - item2);
}

console.log(`Total Distance: ${totalDistance}`);

// ------------- PART 2 ---------------------

const rightTotals = list2.reduce(
  (t, c) => {
    return {
      ...t,
      [c]: (t[c] ?? 0) + 1,
    };
  },
  {} as Record<number, number>
);

let totalSimilarity = 0;
for (const leftItem of list1) {
  totalSimilarity += leftItem * (rightTotals[leftItem] ?? 0);
}

console.log(`Total Similarity: ${totalSimilarity}`);

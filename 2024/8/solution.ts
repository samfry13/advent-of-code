import { getInput } from "../../utils/file";

const input = await getInput(__dirname);
const map = input.split("\n").map((row) => row.split(""));

// ------------- PART 1 ---------------------

type Point = [number, number];

const buildAntennaeList = (map: string[][]) => {
  const returnDict: Record<string, Point[]> = {};

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const value = map[y][x];
      if (value !== ".") {
        const point = [y, x];
        if (value in returnDict) {
          returnDict[value].push(point);
        } else {
          returnDict[value] = [point];
        }
      }
    }
  }

  return returnDict;
};

const getAntinodes = (antennae: Record<string, Point[]>) => {
  const antiNodes = new Set<string>();
  for (let [antennaValue, nodes] of Object.entries(antennae)) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const firstNode = nodes[i],
          secondNode = nodes[j];
        const rise = firstNode[0] - secondNode[0];
        const run = firstNode[1] - secondNode[1];

        [
          [firstNode[0] + rise, firstNode[1] + run],
          [secondNode[0] - rise, secondNode[1] - run],
        ]
          .filter(([y, x]) => {
            return y < map.length && x < map[0].length && y >= 0 && x >= 0;
          })
          .forEach((antinode) => antiNodes.add(antinode.join(".")));
      }
    }
  }

  return Array.from(antiNodes).map((node) => node.split("."));
};

const antennae = buildAntennaeList(map);
const antinodes = getAntinodes(antennae);
console.log(`Unique Antinodes: ${antinodes.length}`);

// ------------- PART 2 ---------------------

const getAntinodesWithResonance = (antennae: Record<string, Point[]>) => {
  const antiNodes = new Set<string>();
  for (let [antennaValue, nodes] of Object.entries(antennae)) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const firstNode = nodes[i],
          secondNode = nodes[j];
        const rise = firstNode[0] - secondNode[0];
        const run = firstNode[1] - secondNode[1];

        // generate previous antinodes with harmonics
        let y = firstNode[0] + rise,
          x = firstNode[1] + run;
        while (y < map.length && x < map[0].length && y >= 0 && x >= 0) {
          antiNodes.add(`${y}.${x}`);
          (y += rise), (x += run);
        }

        // generate next antinodes with harmonics
        (y = firstNode[0]), (x = firstNode[1]);
        while (y < map.length && x < map[0].length && y >= 0 && x >= 0) {
          antiNodes.add(`${y}.${x}`);
          (y -= rise), (x -= run);
        }

        antiNodes.add(firstNode.join("."));
      }
    }
  }

  return Array.from(antiNodes).map((node) => node.split("."));
};

const resonanceAntinodes = getAntinodesWithResonance(antennae);
console.log(`Unique Antinodes with Resonance: ${resonanceAntinodes.length}`);

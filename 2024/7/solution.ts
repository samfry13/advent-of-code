import { getInput } from "../../utils/file";

const input = await getInput(__dirname); //, "test.txt");

const Operator = {
  Add: "+",
  Multiply: "*",
  Concatenate: "||",
} as const;
type Operator = (typeof Operator)[keyof typeof Operator];

const equations = input.split("\n").map((line) => {
  const [value, remainder] = line.split(": ");
  const operands = remainder.split(" ").map(Number);

  return {
    value: Number(value),
    operands,
  } as const;
});

function compute(lhs: number, rhs: number, operator: Operator) {
  switch (operator) {
    case Operator.Add:
      return lhs + rhs;
    case Operator.Multiply:
      return lhs * rhs;
    case Operator.Concatenate:
      return Number(`${lhs}${rhs}`);
  }
}

function checkOperand({
  target,
  currentTotal,
  remainder,
  operator,
  checkConcat = false,
}: {
  target: number;
  currentTotal: number;
  remainder: number[];
  operator: Operator;
  checkConcat?: boolean;
}): boolean {
  if (remainder.length === 0) return target === currentTotal;

  const rightHandSide = remainder[0];

  const newTotal = compute(currentTotal, rightHandSide, operator);

  const options = {
    target,
    currentTotal: newTotal,
    remainder: remainder.slice(1),
    checkConcat,
  };

  if (checkOperand({ ...options, operator: Operator.Add })) {
    return true;
  } else if (checkOperand({ ...options, operator: Operator.Multiply })) {
    return true;
  } else if (
    checkConcat &&
    checkOperand({ ...options, operator: Operator.Concatenate })
  ) {
    return true;
  }

  return false;
}

// ------------- PART 1 ---------------------

const totalResult1 = equations
  .filter((equation) =>
    checkOperand({
      target: equation.value,
      currentTotal: 0,
      remainder: equation.operands,
      operator: Operator.Add,
    })
  )
  .reduce((t, c) => t + c.value, 0);
console.log(`Total Calibration Result: `, totalResult1);

// ------------- PART 2 ---------------------

const totalResult2 = equations
  .filter((equation) =>
    checkOperand({
      target: equation.value,
      currentTotal: 0,
      remainder: equation.operands,
      operator: Operator.Add,
      checkConcat: true,
    })
  )
  .reduce((t, c) => t + c.value, 0);

console.log(`Total Calibration Result 2: `, totalResult2);

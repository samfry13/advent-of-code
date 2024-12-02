export function deleteIndex<T>(array: T[], index: number) {
  if (index < 0 || index > array.length - 1) {
    throw new Error("Error, index out of bounds");
  }

  return [...array.slice(0, index), ...array.slice(index + 1)];
}

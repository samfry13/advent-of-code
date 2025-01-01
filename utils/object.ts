export function clone<T extends object>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

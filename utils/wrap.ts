export function wrap(total: number, current: number) {
  return current >= 0 ? current % total : ((current % total) + total) % total;
}

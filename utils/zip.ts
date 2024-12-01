export default function zip<Ta, Tb>(a: Ta[], b: Tb[]): [Ta, Tb][] {
  if (a.length >= b.length) {
    return a.map((k, i) => [k, b[i]]);
  } else {
    return b.map((k, i) => [a[i], k]);
  }
}
export default function compareFloats(a: number, b: number) {
  return {
    a: a,
    b: b,
    isChanged: a !== b
  };
}

export default function compareFloats(a: number, b: number) {
  return {
    a,
    b,
    isChanged: a !== b
  };
}

export default function compareIntegers(a: number, b: number) {
  const intA = Math.floor(a);
  const intB = Math.floor(b);
  return {
    a: intA,
    b: intB,
    isChanged: intA !== intB
  };
}

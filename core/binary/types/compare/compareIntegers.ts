export default function compareIntegers(a: number, b: number) {
  var intA = Math.floor(a);
  var intB = Math.floor(b);
  return {
    a: intA,
    b: intB,
    isChanged: intA !== intB
  };
}

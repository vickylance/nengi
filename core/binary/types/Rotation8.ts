const scale = function(n, a, b, c, d) {
  return ((d - c) * (n - a)) / (b - a) + c;
};

const write = function(bitStream, value) {
  // no longer write the converted value
  // is there a bug on initial creation?
  bitStream.writeUInt8(value);
};

const read = function(bitStream) {
  const rawValue = bitStream.readUInt8();
  return byteToRadians(rawValue);
};

const compare = function(a, b) {
  const intA = radiansToByte(a);
  const intB = radiansToByte(b);

  return {
    a: intA,
    b: intB,
    isChanged: intA !== intB
  };
};

const countBits = function() {
  return 8;
};

const boundsCheck = function(value) {
  return value >= Rotation8.min && value <= Rotation8.max;
};

const radiansToByte = function(radians) {
  return Math.floor(scale(radians, 0, 2 * Math.PI, 0, 255) % 256);
};

const byteToRadians = function(uint8) {
  return uint8 * ((2 * Math.PI) / 255);
};

/*
 * Interpolates radians as a rotation around a circle, carefully
 * wraps around 0 and 255 choosing the intuitive direction to turn
 * @method interp
 * @param {UInt8} a First angle as a byte
 * @param {UInt8} b Second angle as a byte
 * @param {Number} ratio Amount to interpolate (0 -> a, 1 -> b, 0.5 -> halfway)
 * @return {Number} Returns the new angle
 */
const interp = function(a, b, ratio) {
  throw new Error(
    'nengi.Rotation8 interpolation is not implemented. Try nengi.RotationFloat32 instead.'
  );
  // console.log('interp', a, b, ratio)
  // return interpRot = lerp(a, b, ratio)
  const PI = Math.PI;
  const whole = 2 * PI;
  const quarter = PI / 2;
  const threeQuarters = (3 * PI) / 2;

  if (a < quarter && b > threeQuarters) {
    return (interpRot = lerp(a + whole, b, ratio) - whole);
  } else if (a > threeQuarters && b < quarter) {
    return (interpRot = lerp(a, b + whole, ratio) - whole);
  } else {
    return (interpRot = lerp(a, b, ratio));
  }
};

const lerp = function(a, b, portion) {
  return a + (b - a) * portion;
};

/* A rotation mapped to an unsigned 8 bit integer, autoconverts from radians
 * i.e. a 256 degree circle (0-255, specifically) instead of a 360 degree circle
 * range: 0 to 255
 * uses BitBuffer functions for write/read
 */
const Rotation8 = {
  min: 0,
  max: 255,
  interp,
  boundsCheck,
  compare,
  bits: 8,
  customWrite: true,
  write,
  customRead: true,
  read
};

export default Rotation8;

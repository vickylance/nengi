/**
 * Definition of an Int8, a signed 8 bit integer
 * range: -128 to 127
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers';

const boundsCheck = (value: number) => {
  return value >= Int8.min && value <= Int8.max;
};

const Int8 = {
  min: -128,
  max: 127,
  bits: 8,
  compare: compareInts,
  write: 'writeInt8',
  read: 'readInt8',
  boundsCheck
};

export default Int8;

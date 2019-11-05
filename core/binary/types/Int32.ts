/**
 * Definition of an Int32, a signed 32 bit integer
 * range: -2147483648 to 2147483647
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers';

const boundsCheck = (value: number) => {
  return value >= Int32.min && value <= Int32.max;
};

const Int32 = {
  min: -2147483648,
  max: 2147483647,
  bits: 32,
  compare: compareInts,
  write: 'writeInt32',
  read: 'readInt32',
  boundsCheck
};

export default Int32;

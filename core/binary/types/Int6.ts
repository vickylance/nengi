/**
 * Definition of an Int6, a signed 6 bit integer
 * range: -32 to 31
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers';

const boundsCheck = (value: number) => {
  return value >= Int6.min && value <= Int6.max;
};

const Int6 = {
  min: -32,
  max: 31,
  bits: 6,
  compare: compareInts,
  write: 'writeInt6',
  read: 'readInt6',
  boundsCheck
};

export default Int6;

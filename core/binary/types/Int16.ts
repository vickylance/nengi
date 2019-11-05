/**
 * Definition of an Int16, a signed 16 bit integer
 * range: -32768 to 32767
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers';

const boundsCheck = (value: number) => {
  return value >= Int16.min && value <= Int16.max;
};

const Int16 = {
  min: -32768,
  max: 32767,
  bits: 16,
  compare: compareInts,
  write: 'writeInt16',
  read: 'readInt16',
  boundsCheck
};

export default Int16;

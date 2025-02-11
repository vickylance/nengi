/**
 * Definition of an Int10, a signed 10 bit integer
 * range: -512 to 511
 * uses BitBuffer functions for write/read
 */
import compareInts from './compare/compareIntegers';

const boundsCheck = (value: number) => {
  return value >= Int10.min && value <= Int10.max;
};

const Int10 = {
  min: -512,
  max: 511,
  bits: 10,
  compare: compareInts,
  write: 'writeInt10',
  read: 'readInt10',
  boundsCheck
};

export default Int10;

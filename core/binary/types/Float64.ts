/**
 * Definition of an Float64
 * uses BitBuffer functions for write/read
 */
import compareFloats from './compare/compareFloats';

const boundsCheck = (value: number) => {
  return true; // value >= Float32.min && value <= Float32.max
};

const Float64 = {
  bits: 64,
  compare: compareFloats,
  write: 'writeFloat64',
  read: 'readFloat64',
  boundsCheck
};

export default Float64;

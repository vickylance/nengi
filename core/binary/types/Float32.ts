/**
 * Definition of an Float32
 * uses BitBuffer functions for write/read
 */
import compareFloats from './compare/compareFloats';

const boundsCheck = (value: number) => {
  return true; // value >= Float32.min && value <= Float32.max
};

const Float32 = {
  bits: 32,
  compare: compareFloats,
  write: 'writeFloat32',
  read: 'readFloat32',
  boundsCheck
};

export default Float32;

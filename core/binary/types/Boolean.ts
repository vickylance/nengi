const boundsCheck = value => {
  return typeof value === 'boolean';
};

const compare = (a: boolean, b: boolean) => {
  return {
    a,
    b,
    isChanged: a !== b
  };
};

/**
 * Definition of a Boolean
 * size is 1 bit
 * uses BitBuffer functions for write/read
 * should never be interpolated (what is halfway between true and false? so esoteric)
 */
const bool = {
  bits: 1,
  write: 'writeBoolean',
  read: 'readBoolean',
  boundsCheck,
  compare
  // 'interp': 'never'
};

export default bool;

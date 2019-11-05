const boundsCheck = value => {
  return value >= EntityId.min && value <= EntityId.max;
};

/**
 * Definition of an EntityId, an usigned 8 bit integer
 * range: 0 to 255
 * uses BitBuffer functions for write/read
 */
const EntityId = {
  min: 0,
  max: 255,
  boundsCheck,
  bits: 8,
  write: 'writeUInt8',
  read: 'readUInt8'
};

export default EntityId;

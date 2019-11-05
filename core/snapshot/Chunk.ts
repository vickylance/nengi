// var selectUIntType = require('../schema/selectUIntType')
import BinaryType from '../binary/BinaryType';

const reverse = {};
function createEnum(values) {
  const enumm = {};
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    enumm[value] = i;
    reverse[i] = value;
  }
  return enumm;
}

const snapshotCategories = [
  'ClientTick',
  'Ping',
  'Pong',
  'Timesync',

  'CreateEntities',
  'UpdateEntitiesPartial',
  'UpdateEntitiesOptimized',
  'DeleteEntities',

  'CreateComponents',
  'UpdateComponentsPartial',
  'UpdateComponentsOptimized',
  'DeleteComponents',

  'Messages',
  'LocalEvents',
  'Commands',
  'JSONs',

  'TransferClient',
  'TransferRequest',
  'TransferResponse',

  'Handshake',
  'ConnectionResponse',

  'Engine'
];

// must be at least one byte to avoid corner case buffer reading bugs
const chunkType = BinaryType.UInt8; // selectUIntType(snapshotCategories.length)

const Chunk = createEnum(snapshotCategories);

export const ChunkReverse = reverse;
export { Chunk };

import { Chunk } from '../Chunk';
import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';

// var config = require('../../../config')

function readDeleteEntities(bitStream, config) {
  const ids = [];

  const length = bitStream[Binary[BinaryType.UInt16].read]();
  for (let i = 0; i < length; i++) {
    const id = bitStream[Binary[config.ID_BINARY_TYPE].read]();
    ids.push(id);
  }

  return ids;
}

export default readDeleteEntities;

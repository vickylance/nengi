import { Chunk } from '../Chunk';
import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import writeDeleteId from '../../protocol/write/writeDeleteId';
// var config = require('../../../config')

function writeDeleteEntities(chunkType, bitStream, ids, config) {
  if (ids.length > 0) {
    bitStream[Binary[BinaryType.UInt8].write](chunkType);
    bitStream[Binary[BinaryType.UInt16].write](ids.length);
    ids.forEach(id => {
      writeDeleteId(bitStream, config.ID_BINARY_TYPE, id);
    });
  }
}

export default writeDeleteEntities;

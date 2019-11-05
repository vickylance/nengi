import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readMessage from '../../protocol/read/readMessage';
// var config = require('../../../config')

function readCreateEntities(bitStream, protocols, config) {
  // number of entities
  const length = bitStream[Binary[BinaryType.UInt16].read]();

  const entities = [];
  for (let i = 0; i < length; i++) {
    const type = bitStream[Binary[config.TYPE_BINARY_TYPE].read]();
    const protocol = protocols.getProtocol(type);
    const entity = readMessage(bitStream, protocol, 1, type, config.TYPE_PROPERTY_NAME);
    entity.protocol = protocol;
    entities.push(entity);
  }
  return entities;
}

export default readCreateEntities;

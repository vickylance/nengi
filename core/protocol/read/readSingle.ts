import Binary from '../../binary/Binary';

// var config = require('../../../config')
import readProp from './readProp';

function readSingle(bitStream, protocolResolver, config) {
  const id = bitStream[Binary[config.ID_BINARY_TYPE].read]();
  const protocol = protocolResolver(id);
  const propKey = bitStream[Binary[protocol.keyType].read]();
  const prop = protocol.keys[propKey];
  const propData = protocol.properties[prop];
  const value = readProp(bitStream, propData.type, propData.arrayIndexType); // bitStream[Binary[propData.type].read]()

  return {
    [config.ID_PROPERTY_NAME]: id,
    prop,
    path: propData.path,
    value
  };
}

export default readSingle;

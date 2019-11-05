import Binary from '../../binary/Binary';
import readProp from './readProp';
import setValue from '../setValue';

const readMessage = function(bitStream, protocol, initialPosition, type, typePropertyName) {
  let start = 0;

  const proxy = {};
  if (initialPosition) {
    start = initialPosition;
    // proxy.push(type)
    proxy[typePropertyName] = type;
  }

  for (let i = start; i < protocol.keys.length; i++) {
    const propName = protocol.keys[i];
    const propData = protocol.properties[propName];

    if (propData.protocol && propData.isArray) {
      const arrayIndexBinaryMeta = Binary[propData.arrayIndexType];
      const length = bitStream[arrayIndexBinaryMeta.read]();
      const temp = [];
      for (let j = 0; j < length; j++) {
        temp.push(readMessage(bitStream, propData.protocol));
      }
      value = temp;
    } else if (propData.protocol) {
      const value = readMessage(bitStream, propData.protocol); // , propData.protocol)
    } else {
      const value = readProp(bitStream, propData.type, propData.arrayIndexType);
    }
    setValue(proxy, propData.path, value);
    // proxy[propName] = value
  }
  return proxy;
};

export default readMessage;

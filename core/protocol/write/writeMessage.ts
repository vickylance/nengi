import Binary from '../../binary/Binary';
import writeProp from './writeProp';
import getValue from '../getValue';

const writeMessage = (bitStream, proxy, protocol, initialPosition?) => {
  // console.log('writing message', proxy, protocol)
  const start = initialPosition || 0;
  for (let i = 0; i < protocol.keys.length; i++) {
    const propName = protocol.keys[i];
    const propData = protocol.properties[propName];
    const value = getValue(proxy, propData.path); // proxy[propName]

    if (propData.protocol && propData.isArray) {
      // console.log('writing array of sub protocol')
      const arrayIndexBinaryMeta = Binary[propData.arrayIndexType];
      bitStream[arrayIndexBinaryMeta.write](value.length);
      for (let j = 0; j < value.length; j++) {
        writeMessage(bitStream, value[j], propData.protocol);
      }
    } else if (propData.protocol) {
      // console.log('writing sub protocol')
      writeMessage(bitStream, value, propData.protocol);
    } else if (propData.isArray) {
      // console.log('writing array')
      const arrayIndexBinaryMeta = Binary[propData.arrayIndexType];
      bitStream[arrayIndexBinaryMeta.write](value.length);
      for (let j = 0; j < value.length; j++) {
        writeProp(bitStream, propData.type, propData.arrayIndexType, value[j]);
      }
    } else {
      // console.log('writing regular prop', value, propData)
      writeProp(bitStream, propData.type, propData.arrayIndexType, value);
    }
  }
};

export default writeMessage;

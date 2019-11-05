import Binary from '../../binary/Binary';
import countPropBits from './countPropBits';

function countMessageBits(proxy, protocol, initialPosition?) {
  if (!protocol) {
    throw new Error(
      'Protocol error: nengi encountered a Message without a protocol (did you mean to try to send this object? did you remember to add its protocol to the config?). Data:' +
        JSON.stringify(proxy)
    );
  }
  const start = initialPosition || 0;
  let bits = 0;
  for (let i = 0; i < protocol.keys.length; i++) {
    const propName = protocol.keys[i];
    const propData = protocol.properties[propName];
    const value = proxy[propName];

    if (propData.protocol && propData.isArray) {
      // array of nengi objects
      const arrayIndexBinaryMeta = Binary[propData.arrayIndexType];
      bits += arrayIndexBinaryMeta.bits;
      for (let j = 0; j < value.length; j++) {
        if (proxy.text) {
          // console.log('yo', proxy, proxy.protocol)
          console.log('aaa', value[j], propData.protocol, ';;', proxy.protocol);
        }

        bits += countMessageBits(value[j], propData.protocol);
      }
    } else if (propData.protocol) {
      // a single nengi object
      bits += countMessageBits(value, propData.protocol);
    } else if (propData.isArray) {
      // array of nengi values
      const arrayIndexBinaryMeta = Binary[propData.arrayIndexType];
      bits += arrayIndexBinaryMeta.bits;
      for (let j = 0; j < value.length; j++) {
        bits += countPropBits(propData.type, propData.arrayIndexType, value[j]);
      }
    } else {
      // a single nengi value
      bits += countPropBits(propData.type, propData.arrayIndexType, value);
    }
  }
  return bits;
}

export default countMessageBits;

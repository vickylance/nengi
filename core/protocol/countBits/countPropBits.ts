import Binary from '../../binary/Binary';
import BinaryType from '../../binary/BinaryType';

export default function(type, arrayIndexType, value) {
  // console.log('type', type, 'arrayIndexType', arrayIndexType, 'value', value)
  let bits = 0;
  const binaryMeta = Binary[type];

  if (binaryMeta.countBits) {
    bits = binaryMeta.countBits(value);
  } else {
    bits = binaryMeta.bits;
  }

  return bits;
}

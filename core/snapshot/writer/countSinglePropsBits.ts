import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import countPartialBits from '../../protocol/countBits/countSingleBits';

function countSinglePropsBits(singleProps) {
  let bits = 0;
  if (singleProps.length > 0) {
    bits += Binary[BinaryType.UInt8].bits;
    bits += Binary[BinaryType.UInt16].bits;
    for (let i = 0; i < singleProps.length; i++) {
      const singleProp = singleProps[i];
      bits += countPartialBits(singleProp);
    }
  }
  return bits;
}

export default countSinglePropsBits;

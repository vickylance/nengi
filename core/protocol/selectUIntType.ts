import Type from '../binary/BinaryType';
import Binary from '../binary/Binary';

const UIntTypes = [
  Type.UInt2,
  Type.UInt3,
  Type.UInt4,
  Type.UInt5,
  Type.UInt6,
  Type.UInt7,
  Type.UInt8,
  Type.UInt9,
  Type.UInt10,
  Type.UInt11,
  Type.UInt12,
  Type.UInt16,
  Type.UInt32
];

const selectUIntType = function(max) {
  for (let i = 0; i < UIntTypes.length; i++) {
    const type = UIntTypes[i];
    if (Binary[type].max >= max) {
      return type;
    }
  }

  throw new Error('selectUIntType max out of bounds');
};

export default selectUIntType;

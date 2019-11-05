import Binary from '../../binary/Binary';
import BinaryType from '../../binary/BinaryType';

const writeProp = function(bitStream, type, arrayIndexType, value) {
  const binaryMeta = Binary[type];

  if (binaryMeta.customWrite) {
    binaryMeta.write(bitStream, value);
  } else {
    bitStream[binaryMeta.write](value);
  }
};

export default writeProp;

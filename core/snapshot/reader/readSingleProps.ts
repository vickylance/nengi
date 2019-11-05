import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readSingle from '../../protocol/read/readSingle';
// var config = require('../../../config')

function readSingleProps(bitStream, protocolResolver, config) {
  // number of singleProps
  const length = bitStream[Binary[BinaryType.UInt16].read]();

  const singleProps = [];
  for (let i = 0; i < length; i++) {
    // TODO is config needed here?
    const singleProp = readSingle(bitStream, protocolResolver, config);
    singleProps.push(singleProp);
  }
  return singleProps;
}

export default readSingleProps;

import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readBatch from '../../protocol/read/readBatch';

function readBatches(bitStream, entityCache) {
  var length = bitStream[Binary[BinaryType.UInt16].read]();

  var batches = [];
  for (var i = 0; i < length; i++) {
    var batch = readBatch(bitStream, entityCache);
    batches.push(batch);
  }
  return batches;
}

export default readBatches;

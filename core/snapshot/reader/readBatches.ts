import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readBatch from '../../protocol/read/readBatch';

function readBatches(bitStream, entityCache) {
  const length = bitStream[Binary[BinaryType.UInt16].read]();

  const batches = [];
  for (let i = 0; i < length; i++) {
    const batch = readBatch(bitStream, entityCache);
    batches.push(batch);
  }
  return batches;
}

export default readBatches;

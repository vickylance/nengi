import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import countBatchBits from '../../protocol/countBits/countBatchBits';

function countBatchesBits(batches) {
  let bits = 0;
  if (batches.length > 0) {
    bits += Binary[BinaryType.UInt8].bits;
    bits += Binary[BinaryType.UInt16].bits;
    batches.forEach(batch => {
      bits += countBatchBits(batch);
    });
  }
  return bits;
}

export default countBatchesBits;

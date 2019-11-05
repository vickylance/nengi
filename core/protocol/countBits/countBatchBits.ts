import Binary from '../../binary/Binary';

export default function(batch) {
  let bits = Binary[batch.idType].bits;
  batch.updates.forEach(update => {
    bits += Binary[update.valueType].bits;
  });
  return bits;
}

import Binary from '../../binary/Binary';

const readProp = function(bitStream, type, arrayIndexType) {
  const binaryMeta = Binary[type];
  if (typeof arrayIndexType === 'number') {
    const arrayIndexMeta = Binary[arrayIndexType];
    const length = bitStream[arrayIndexMeta.read]();

    const arr = [];
    for (let i = 0; i < length; i++) {
      if (binaryMeta.customRead) {
        const value = binaryMeta.read(bitStream);
        arr.push(value);
      } else {
        const value = bitStream[binaryMeta.read]();
        arr.push(value);
      }
    }
    return arr;
  } else {
    if (binaryMeta.customRead) {
      return binaryMeta.read(bitStream);
    } else {
      return bitStream[binaryMeta.read]();
    }
  }
};

export default readProp;

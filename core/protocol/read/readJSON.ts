import utf8 from 'utf8';

const readJSON = function(bitStream) {
  const length = bitStream.readUInt32();
  let encoded = '';
  for (let i = 0; i < length; i++) {
    encoded += String.fromCharCode(bitStream.readUInt8());
  }
  return utf8.decode(encoded);
};

export default readJSON;

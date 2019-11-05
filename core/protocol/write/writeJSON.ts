import utf8 from 'utf8';

const writeJSON = function(bitStream, json) {
  const encoded = utf8.encode(json);
  bitStream.writeUInt32(encoded.length);
  for (let i = 0; i < encoded.length; i++) {
    bitStream.writeUInt8(encoded.charCodeAt(i));
  }
};

export default writeJSON;

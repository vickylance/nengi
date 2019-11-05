import utf8 from 'utf8';

const boundsCheck = function(value) {
  return value.length <= 4294967295;
};

const write = function(bitStream, value) {
  const encoded = utf8.encode(value);
  bitStream.writeUInt32(encoded.length);
  for (let i = 0; i < encoded.length; i++) {
    bitStream.writeUInt8(encoded.charCodeAt(i));
  }
};

const read = function(bitStream) {
  const length = bitStream.readUInt32();
  let encoded = '';
  for (let i = 0; i < length; i++) {
    encoded += String.fromCharCode(bitStream.readUInt8());
  }
  return utf8.decode(encoded);
};

const countBits = function(string) {
  let bits = 32; // will represent the string length
  bits += utf8.encode(string).length * 8;
  return bits;
};

const UTF8String = {
  boundsCheck,
  customBits: true,
  countBits,
  customWrite: true,
  write,
  customRead: true,
  read
};

UTF8String.compare = function(a, b) {
  return {
    a,
    b,
    isChanged: a !== b
  };
};

export default UTF8String;
